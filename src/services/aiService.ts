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

export type AIResponse = AIExecutionResponse | AIProbeResponse | AIGeneralResponse;

export class AIService {
  private static openaiClient: OpenAI | null = null;

  /**
   * Instantiates and returns the OpenAI client if API Key is configured
   */
  private static getClient(): OpenAI | null {
    if (this.openaiClient) return this.openaiClient;

    const hasKey = config.openaiApiKey && 
                   config.openaiApiKey !== 'your_openai_api_key' && 
                   config.openaiApiKey !== 'your_openai_api_key_here' && 
                   config.openaiApiKey.trim() !== '';

    if (!hasKey) {
      console.log('[AI Service] OpenAI Key is empty. Running in SIMULATED AI (offline regex) mode.');
      return null;
    }

    this.openaiClient = new OpenAI({
      apiKey: config.openaiApiKey,
      baseURL: config.openaiApiBase
    });

    return this.openaiClient;
  }

  /**
   * Processes a user's natural language input:
   * 1. Appends user text to state manager history.
   * 2. Resolves intent using OpenAI or Simulated parser.
   * 3. Appends AI response to state manager history (if probe/general).
   */
  public static async processMessage(userId: string, userText: string): Promise<AIResponse> {
    // 1. Add user message to history context
    StateManager.addMessage(userId, 'user', userText);
    const history = StateManager.getHistory(userId);

    const client = this.getClient();
    if (!client) {
      // Run the local regex simulator if offline/unconfigured
      const response = await this.simulateAIIntent(userText, history);
      if (response.type === 'probe' || response.type === 'general') {
        StateManager.addMessage(userId, 'assistant', response.text);
      }
      return response;
    }

    try {
      // Define tool schema for OpenAI Function Calling
      const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
        {
          type: 'function',
          function: {
            name: 'execute_m365_task',
            description: 'Executes an administrative task/use-case when all required parameters are collected.',
            parameters: {
              type: 'object',
              properties: {
                ucCode: { type: 'string', description: 'The use case code (e.g. SUC001) identifying the task.' },
                actionDescription: { type: 'string', description: 'A short, user-friendly description of what you are about to do. Example: "check your password expiry status"' },
                parameters: { type: 'object', description: 'Dynamic arguments collected for the specific use case.', additionalProperties: true }
              },
              required: ['ucCode', 'actionDescription', 'parameters']
            }
          }
        }
      ];

      const useCaseList = supportUseCases.map(uc => `- ${uc.id}: ${uc.name} (${uc.description})`).join('\n');

      const systemPrompt = `You are CIS Support Agent, a Level 1 IT Support assistant.
Your job is to strictly help users and administrators perform IT administrative tasks and nothing else.
You should collect parameters based on the use case before executing.

Valid Use Cases:
${useCaseList}

Probing Flow:
1. Examine the user's request. Identify if they want to run one of the tasks.
2. Check if they have provided ALL required parameters. NOTE: For identity security tasks like Password Reset (SUC001), Unlock Account (SUC002), and Reset SSPR (SUC006), NO parameters are required. Execute them immediately.
3. If ALL required parameters are present, you MUST call the tool 'execute_m365_task' immediately passing the correct 'ucCode', 'actionDescription' and 'parameters'. DO NOT generate conversational text confirming you will execute it. ONLY output the tool call.
4. If some required parameters are missing, ask for them. NEVER ask for admin credentials or passwords.
5. If the request is not related to IT administration, you MUST politely refuse to answer. State clearly that your capabilities are strictly limited to IT support. Do NOT provide general knowledge, creative writing, or non-IT assistance under any circumstances.`;

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

      // Check if tool execution was called
      if (message.tool_calls && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0];
        if (toolCall.function.name === 'execute_m365_task') {
          const parsed = JSON.parse(toolCall.function.arguments);
          return {
            type: 'execute',
            ucCode: parsed.ucCode,
            actionDescription: parsed.actionDescription || 'execute task',
            parameters: parsed.parameters
          };
        }
      }

      // Fallback: It is a probe response or general conversation
      const replyText = message.content || 'I need more information to process this request.';
      StateManager.addMessage(userId, 'assistant', replyText);
      return {
        type: 'probe',
        text: replyText
      };

    } catch (err: any) {
      console.error('[AI Service Error] ChatCompletion call failed:', err.message);
      // Fallback to simulation if api fails mid-transit
      return this.simulateAIIntent(userText, history);
    }
  }

  /**
   * Simulated AI engine using regex parsing when offline / unconfigured
   */
  private static async simulateAIIntent(text: string, history: ChatMessage[]): Promise<AIResponse> {
    const cleanText = text.toLowerCase().trim();
    const ucDirectMatch = cleanText.match(/(suc\d{3})/);
    if (ucDirectMatch) {
      const code = ucDirectMatch[1].toUpperCase();
      return { type: 'probe', text: `Opening form for **${code}**. Please complete the inputs in the card below:` };
    }
    return { type: 'probe', text: 'I am in simulated mode and need a direct use case ID (e.g. SUC001).' };
  }
}
