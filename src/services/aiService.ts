import OpenAI from 'openai';
import { config } from '../config';
import { StateManager, ChatMessage } from './stateManager';
import { supportUseCases } from '../useCases';

export interface AIExecutionResponse {
  type: 'execute';
  ucCode: string;
  actionDescription: string;
  parameters: any;
}

export interface AIProbeResponse {
  type: 'probe';
  text: string;
}

export interface AIGeneralResponse {
  type: 'general';
  text: string;
}

export interface AIEscalateResponse {
  type: 'escalate';
  domain: string;
  summary: string;
}

export interface AITransitionResponse {
  type: 'transition';
  sourceAgent: string;
  targetAgent: string;
}

export interface AIInvestigationResponse {
  type: 'investigation';
  checks: string[];
  finding: string;
}

export interface AIRemediationResponse {
  type: 'remediation';
  remediation: string;
  description: string;
}

export type AIResponse = AIExecutionResponse | AIProbeResponse | AIGeneralResponse | AIEscalateResponse | AITransitionResponse | AIInvestigationResponse | AIRemediationResponse;

export class AIService {
  private static openaiClient: OpenAI | null = null;

  private static getClient(): OpenAI | null {
    if (this.openaiClient) return this.openaiClient;

    const hasKey = config.openaiApiKey && 
                   config.openaiApiKey !== 'your_openai_api_key' && 
                   config.openaiApiKey !== 'your_openai_api_key_here' && 
                   config.openaiApiKey.trim() !== '';

    if (!hasKey) {
      console.log('[AI Service] OpenAI Key is empty. Running in SIMULATED AI mode.');
      return null;
    }

    this.openaiClient = new OpenAI({
      apiKey: config.openaiApiKey,
      baseURL: config.openaiApiBase
    });

    return this.openaiClient;
  }

  public static async processMessage(userId: string, userText: string): Promise<AIResponse> {
    StateManager.addMessage(userId, 'user', userText);
    const history = StateManager.getHistory(userId);

    const client = this.getClient();
    if (!client) {
      const response = await this.simulateAIIntent(userText, history);
      if (response.type === 'probe' || response.type === 'general') {
        StateManager.addMessage(userId, 'assistant', response.text);
      }
      return response;
    }

    try {
      const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
        {
          type: 'function',
          function: {
            name: 'execute_m365_task',
            description: 'Executes an administrative task/use-case when all required parameters are collected and the task perfectly matches a supported automation.',
            parameters: {
              type: 'object',
              properties: {
                ucCode: { type: 'string' },
                actionDescription: { type: 'string' },
                parameters: { type: 'object', additionalProperties: true }
              },
              required: ['ucCode', 'actionDescription', 'parameters']
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'escalate_to_support',
            description: 'Routes the user to Level 3 Human Support.',
            parameters: {
              type: 'object',
              properties: {
                domain: { type: 'string', enum: ['Identity', 'Exchange', 'SharePoint', 'OneDrive', 'Teams', 'Other M365'] },
                summary: { type: 'string' }
              },
              required: ['domain', 'summary']
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'transition_agent',
            description: 'Visually routes the conversation from a Triage Agent to a Specialist Agent.',
            parameters: {
              type: 'object',
              properties: {
                sourceAgent: { type: 'string' },
                targetAgent: { type: 'string' }
              },
              required: ['sourceAgent', 'targetAgent']
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'present_investigation',
            description: 'Visually presents a completed diagnostic checklist and preliminary finding.',
            parameters: {
              type: 'object',
              properties: {
                checks: { type: 'array', items: { type: 'string' } },
                finding: { type: 'string' }
              },
              required: ['checks', 'finding']
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'propose_remediation',
            description: 'Proposes an automated remediation action for human approval.',
            parameters: {
              type: 'object',
              properties: {
                remediation: { type: 'string' },
                description: { type: 'string' }
              },
              required: ['remediation', 'description']
            }
          }
        }
      ];

      const useCaseList = supportUseCases.map(uc => `- ${uc.id}: ${uc.name} (${uc.description})`).join('\n');

      const systemPrompt = `You are CIS360, an advanced AI Support Orchestrator. 
Your behavior depends on the user's intent.

RULE A (Automation Hub): If the user asks for a DIRECT administrative action (like resetting a password), use 'execute_m365_task'. 
Valid Use Cases:
${useCaseList}
* Note: Map "create shared mailbox" or "request shared mailbox" to SUC041.

RULE B (Multi-Agent Troubleshooting Playbook): If the user reports a vague problem (e.g., "my email is not working"), follow this exact multi-turn playbook:
1. Adopt the "Triage Agent" persona. Ask diagnostic questions one by one (e.g., send/receive? web vs desktop? error messages?).
2. Once you determine the domain (e.g., Exchange/Outlook), call the 'transition_agent' tool (e.g., source="Triage Agent", target="Exchange & Outlook Specialist Agent").
3. Immediately adopt the "Exchange & Outlook Specialist" persona. Probe deeper (e.g., authentication loops, other M365 apps, recent password changes).
4. When you have enough information, say "I have enough information to begin the technical investigation. Investigation in progress..." as conversational text. DO NOT CALL TOOLS YET.
5. In the VERY NEXT user turn (or immediately if you can), call 'present_investigation' with the checklist of what you found.
6. If the user acknowledges the investigation or if you choose to bundle it, call 'propose_remediation' (e.g., remediation="Refresh Outlook Session & Revoke Tokens").

RULE C (Shared Mailbox Playbook for SUC041): If the user wants to create or request access to a shared mailbox:
1. Adopt the "Triage Agent" persona. Probe for the Name of the mailbox, the Email Address, and the Permissions to be added.
2. Once you have all parameters, call the 'transition_agent' tool (source="Triage Agent", target="Exchange & Outlook Specialist Agent").
3. As the Specialist Agent, re-confirm the information with the user via a conversational message. DO NOT CALL execute_m365_task YET.
4. Once the user explicitly confirms the details are correct, call the 'execute_m365_task' tool with ucCode="SUC041", actionDescription="Provision Shared Mailbox", and the collected parameters.

IMPORTANT: You can only call ONE tool per turn in this setup.
Keep your conversational tone extremely professional, intelligent, and empathetic. Do NOT break character.`;

      const response = await client.chat.completions.create({
        model: config.openaiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...history.map(msg => ({ role: msg.role, content: msg.content } as any))
        ],
        tools: tools,
        tool_choice: 'auto'
      });

      const choice = response.choices[0];
      const message = choice.message;

      if (message.tool_calls && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0];
        const parsed = JSON.parse(toolCall.function.arguments);
        
        if (toolCall.function.name === 'execute_m365_task') {
          return {
            type: 'execute',
            ucCode: parsed.ucCode,
            actionDescription: parsed.actionDescription || 'execute task',
            parameters: parsed.parameters
          };
        } else if (toolCall.function.name === 'escalate_to_support') {
          return {
            type: 'escalate',
            domain: parsed.domain,
            summary: parsed.summary
          };
        } else if (toolCall.function.name === 'transition_agent') {
          StateManager.addMessage(userId, 'assistant', `[System Action: Transitioned to ${parsed.targetAgent}. I am now the ${parsed.targetAgent}. I should ask deeper specialist questions now.]`);
          return { type: 'transition', sourceAgent: parsed.sourceAgent, targetAgent: parsed.targetAgent };
        } else if (toolCall.function.name === 'present_investigation') {
          StateManager.addMessage(userId, 'assistant', `[System Action: Presented investigation checklist. Finding: ${parsed.finding}. Next I should propose remediation.]`);
          return { type: 'investigation', checks: parsed.checks, finding: parsed.finding };
        } else if (toolCall.function.name === 'propose_remediation') {
          StateManager.addMessage(userId, 'assistant', `[System Action: Proposed remediation: ${parsed.remediation}. Awaiting user approval.]`);
          return { type: 'remediation', remediation: parsed.remediation, description: parsed.description };
        }
      }

      const replyText = message.content || 'I need more information to process this request.';
      StateManager.addMessage(userId, 'assistant', replyText);
      return {
        type: 'probe',
        text: replyText
      };

    } catch (err: any) {
      console.error('[AI Service Error]', err.message);
      return this.simulateAIIntent(userText, history);
    }
  }

  private static async simulateAIIntent(text: string, history: ChatMessage[]): Promise<AIResponse> {
    const cleanText = text.toLowerCase().trim();
    if (cleanText.includes('suc')) {
      return { type: 'probe', text: `Opening form.` };
    }
    return { type: 'probe', text: 'Simulated mode.' };
  }
}
