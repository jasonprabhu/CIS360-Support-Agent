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
    this.openaiClient = new OpenAI({ apiKey: config.openaiApiKey, baseURL: config.openaiApiBase });
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
            description: 'Executes a supported M365 administrative use-case once all required parameters are confirmed by the user.',
            parameters: {
              type: 'object',
              properties: {
                ucCode: { type: 'string', description: 'The use case code e.g. SUC001, EXC001.' },
                actionDescription: { type: 'string', description: 'Short user-friendly description of the action.' },
                parameters: {
                  type: 'object',
                  description: 'Collected parameters. For EXC001 MUST use keys: mailboxName, emailAddress, permissions.',
                  properties: {
                    mailboxName: { type: 'string', description: 'Display name of the shared mailbox. Required for EXC001.' },
                    emailAddress: { type: 'string', description: 'Full email address of the shared mailbox. Required for EXC001.' },
                    permissions: { type: 'string', description: 'Permission level: Full Access, Send As, or Read Only. Required for EXC001.' },
                    userUpn: { type: 'string', description: 'User UPN for identity-based use cases.' }
                  },
                  additionalProperties: true
                }
              },
              required: ['ucCode', 'actionDescription', 'parameters']
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'escalate_to_support',
            description: 'Routes the user to Level 3 Human Support for issues outside available automations.',
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
            description: 'Shows a visual card routing from Triage Agent to a Specialist Agent. Call this AFTER all parameters are collected but BEFORE the specialist confirms them with the user.',
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

      // EXC151 is excluded from Rule A — it must only be triggered via the multi-agent Rule C playbook
      const useCaseList = supportUseCases
        .filter(uc => uc.id !== 'EXC151')
        .map(uc => `- ${uc.id}: ${uc.name} (${uc.description})`)
        .join('\n');

      const systemPrompt = `You are CIS360, an advanced AI Support Orchestrator.
Your behavior depends strictly on the user's intent.

=== RULE A: Automation Hub ===
If the user asks for a DIRECT administrative action (e.g. reset password, unlock account), use the 'execute_m365_task' tool immediately with the correct ucCode.
Supported Use Cases:
${useCaseList}

=== RULE B: Troubleshooting Playbook ===
If the user reports a vague problem (e.g. "my email is not working"):
1. As "Triage Agent": ask diagnostic questions (send/receive? web vs desktop? error messages?).
2. Once domain is identified, call 'transition_agent' (sourceAgent="Triage Agent", targetAgent="Exchange & Outlook Specialist Agent").
3. As "Exchange & Outlook Specialist": probe deeper.
4. Call 'present_investigation' with your findings.
5. Call 'propose_remediation' with your recommended fix.

=== RULE C: Create Shared Mailbox (EXC151) ===
Follow these EXACT steps IN ORDER when a user wants to create a shared mailbox:

STEP 1 — As "Triage Agent", ask for and collect all 3 required details:
  1. Mailbox display name (mailboxName)
  2. Full email address (emailAddress — must keep the exact domain the user specifies, e.g. @2lzb80.onmicrosoft.com)
  3. Permission level (permissions — e.g. Full Access, Send As, or Read Only)
  Do not proceed to Step 2 until you have received all 3 answers from the user.

STEP 2 — Once you have all 3 details, call the 'transition_agent' tool (sourceAgent="Triage Agent", targetAgent="Exchange & Outlook Specialist Agent").

STEP 3 — As "Exchange & Outlook Specialist Agent", present the collected details to the user and ask them to confirm (e.g. "Please reply 'Confirm' or 'Yes' to proceed"). Do NOT call execute_m365_task in this turn.

STEP 4 — When the user confirms (replies "yes", "confirm", "correct", "proceed", etc.), call the 'execute_m365_task' tool:
  - ucCode: "EXC151"
  - actionDescription: "Create Shared Mailbox"
  - parameters: { mailboxName: [the actual mailbox name collected in Step 1], emailAddress: [the actual email address collected in Step 1], permissions: [the actual permission level collected in Step 1] }
  IMPORTANT: Pass the real collected values from the conversation history, NOT placeholder strings.

=== GENERAL RULES ===
- You may only call ONE tool per turn.
- Always complete the current step fully before moving to the next.
- Maintain a professional, intelligent, and empathetic tone throughout.`;

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
          console.log('[AI Service] execute_m365_task called. ucCode:', parsed.ucCode, 'parameters:', JSON.stringify(parsed.parameters));
          return {
            type: 'execute',
            ucCode: parsed.ucCode,
            actionDescription: parsed.actionDescription || 'execute task',
            parameters: parsed.parameters
          };
        } else if (toolCall.function.name === 'escalate_to_support') {
          return { type: 'escalate', domain: parsed.domain, summary: parsed.summary };
        } else if (toolCall.function.name === 'transition_agent') {
          StateManager.addMessage(userId, 'assistant', `[System Action: Transitioned to ${parsed.targetAgent}. I am now the ${parsed.targetAgent}. I should confirm collected details with the user next.]`);
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
      return { type: 'probe', text: replyText };

    } catch (err: any) {
      console.error('[AI Service Error]', err.message);
      return this.simulateAIIntent(userText, history);
    }
  }

  private static async simulateAIIntent(text: string, history: ChatMessage[]): Promise<AIResponse> {
    return { type: 'probe', text: 'Simulated mode — please configure your OpenAI API key.' };
  }
}
