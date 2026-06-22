import OpenAI from 'openai';
import { config } from '../config';
import { StateManager, ChatMessage } from './stateManager';

export interface AIExecutionResponse {
  type: 'execute';
  ucCode: string;
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
            description: 'Executes an M365 IT administrative task/use-case when all required parameters are collected.',
            parameters: {
              type: 'object',
              properties: {
                ucCode: {
                  type: 'string',
                  description: 'The use case code (e.g. UC001, UC002, ..., UC050) identifying the task.',
                  enum: [
                    'UC001', 'UC002', 'UC003', 'UC004', 'UC005', 'UC008', 'UC010', 'UC011', 'UC012',
                    'UC013', 'UC014', 'UC015', 'UC016', 'UC020', 'UC021', 'UC022', 'UC023', 'UC024',
                    'UC025', 'UC026', 'UC027', 'UC028', 'UC029', 'UC030', 'UC031', 'UC032', 'UC036',
                    'UC037', 'UC038', 'UC039', 'UC040', 'UC041', 'UC042', 'UC043', 'UC044', 'UC045',
                    'UC046', 'UC047', 'UC048', 'UC049', 'UC050'
                  ]
                },
                parameters: {
                  type: 'object',
                  description: 'Dynamic arguments collected for the specific use case.',
                  properties: {
                    userUpn: { type: 'string', description: 'UPN/Email of the target user.' },
                    firstName: { type: 'string', description: 'User first name.' },
                    lastName: { type: 'string', description: 'User last name.' },
                    displayName: { type: 'string', description: 'New display name or group title.' },
                    jobTitle: { type: 'string', description: 'New job title.' },
                    department: { type: 'string', description: 'New department.' },
                    managerUpn: { type: 'string', description: 'UPN of the user manager.' },
                    forceChange: { type: 'string', description: 'Whether password change is forced (true/false).' },
                    skuId: { type: 'string', description: 'License SKU ID (e.g. sku-e5, sku-e3).' },
                    groupSearch: { type: 'string', description: 'Group Display Name or unique ID.' },
                    newName: { type: 'string', description: 'New group display name.' },
                    mailboxUpn: { type: 'string', description: 'UPN of the target shared mailbox.' },
                    delegateUpn: { type: 'string', description: 'UPN of the delegate user.' },
                    permission: { type: 'string', enum: ['FullAccess', 'SendAs', 'SendOnBehalf'], description: 'Delegation role.' },
                    forwardAddress: { type: 'string', description: 'Target email address for forwarding.' },
                    message: { type: 'string', description: 'Out-of-office automatic reply message.' },
                    quotaGb: { type: 'number', description: 'New mailbox storage limit size in GB.' },
                    targetUserUpn: { type: 'string', description: 'UPN of target user to grant access.' },
                    daysAgo: { type: 'number', description: 'OneDrive restore point duration in days.' },
                    alias: { type: 'string', description: 'SharePoint site directory path name.' },
                    siteSearch: { type: 'string', description: 'SharePoint Site Title, Alias, or absolute URL.' },
                    role: { type: 'string', enum: ['owner', 'write', 'read'], description: 'SharePoint access permissions role.' }
                  }
                }
              },
              required: ['ucCode', 'parameters']
            }
          }
        }
      ];

      // Construct system prompt
      const systemPrompt = `You are CIS Support Agent, a Level 1 M365 IT Support assistant.
Your job is to help the administrator perform M365 tenant administrative tasks.
You support exactly 50 administrative use cases (UC001 - UC050).

Use Case Requirements:
- UC001 (Create User): Requires firstName, lastName, userUpn. Optional: department, jobTitle, licenseType.
- UC002 (Update Display Name): Requires userUpn, displayName.
- UC003 (Update Job Title): Requires userUpn, jobTitle.
- UC004 (Update Department): Requires userUpn, department.
- UC005 (Update Manager): Requires userUpn, managerUpn.
- UC008 (Reset Password): Requires userUpn, forceChange.
- UC010 (Block Sign-in): Requires userUpn.
- UC011 (Unblock Sign-in): Requires userUpn.
- UC012 (Delete User): Requires userUpn.
- UC013 (Assign License): Requires userUpn, skuId.
- UC014 (Remove License): Requires userUpn, skuId.
- UC015 (Check User License): Requires userUpn.
- UC016 (Check Available Licenses): Requires no inputs.
- UC020 (Find Unlicensed Users): Requires no inputs.
- UC021 (Create Security Group): Requires displayName, description.
- UC022 (Create M365 Group): Requires displayName, description.
- UC023 (Add Member to Group): Requires groupSearch, userUpn.
- UC024 (Remove Member from Group): Requires groupSearch, userUpn.
- UC025 (View Group Members): Requires groupSearch.
- UC026 (Update Group Owner): Requires groupSearch, userUpn.
- UC027 (Hide Group from GAL): Requires groupSearch, hide.
- UC028 (Rename Group): Requires groupSearch, newName.
- UC029 (Create Shared Mailbox): Requires displayName, userUpn.
- UC030 (Delete Shared Mailbox): Requires userUpn.
- UC031 (Add Mailbox Delegate): Requires mailboxUpn, delegateUpn, permission.
- UC032 (Remove Mailbox Delegate): Requires mailboxUpn, delegateUpn, permission.
- UC036 (Check Mailbox Permissions): Requires userUpn.
- UC037 (Enable Mail Forwarding): Requires userUpn, forwardAddress.
- UC038 (Disable Mail Forwarding): Requires userUpn.
- UC039 (Set Automatic Reply): Requires userUpn, message.
- UC040 (Disable Automatic Reply): Requires userUpn.
- UC041 (Increase Mailbox Quota): Requires userUpn, quotaGb.
- UC042 (Check Mailbox Size): Requires userUpn.
- UC043 (Convert Mailbox to Shared): Requires userUpn.
- UC044 (Check OneDrive Storage): Requires userUpn.
- UC045 (Grant OneDrive Access): Requires userUpn, targetUserUpn.
- UC046 (Restore OneDrive Files): Requires userUpn, daysAgo.
- UC047 (Generate Sharing Report): Requires userUpn.
- UC048 (Create SharePoint Site): Requires displayName, alias.
- UC049 (Add User to SharePoint Site): Requires siteSearch, userUpn, role.
- UC050 (Check SharePoint Permissions): Requires siteSearch.

Probing Flow:
1. Examine the user's request. Identify if they want to run one of these admin tasks.
2. Check if they have provided ALL required parameters.
3. If ALL required parameters are present, call the tool 'execute_m365_task' passing the correct 'ucCode' and 'parameters'.
4. If some required parameters are missing, DO NOT call the tool. Instead, ask for the missing parameters one-by-one or in a friendly prompt.
5. If the request is not related to M365 administration (e.g. general chat or help query), respond in natural language.`;

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

    // Match Direct Use Case commands (e.g. "UC001" or "/uc001")
    const ucDirectMatch = cleanText.match(/(uc\d{3})/);
    if (ucDirectMatch) {
      const code = ucDirectMatch[1].toUpperCase();
      return {
        type: 'probe',
        text: `Opening form for **${code}**. Please complete the inputs in the card below:`
      };
    }

    // Helper: Find past user messages in history to reconstruct details
    const findArgument = (regexes: RegExp[]): string | undefined => {
      // Search from newest to oldest in history
      for (let i = history.length - 1; i >= 0; i--) {
        const content = history[i].content;
        for (const regex of regexes) {
          const match = content.match(regex);
          if (match && match[1]) return match[1].trim();
        }
      }
      return undefined;
    };

    // 1. UC001 - Create User
    if (cleanText.includes('create user') || cleanText.includes('new user') || findArgument([/create user/i])) {
      const firstName = findArgument([/first name is (\w+)/i, /name is (\w+)/i, /first name:?\s*(\w+)/i]);
      const lastName = findArgument([/last name is (\w+)/i, /last name:?\s*(\w+)/i]);
      const userUpn = findArgument([/upn is ([^\s]+@[^\s]+)/i, /upn:?\s*([^\s]+@[^\s]+)/i, /email is ([^\s]+@[^\s]+)/i]);
      const dept = findArgument([/dept:?\s*(\w+)/i, /department is (\w+)/i]) || 'IT';
      const title = findArgument([/title:?\s*([\w\s]+)/i, /job title is ([\w\s]+)/i]) || 'User';

      if (!firstName || !lastName) {
        return { type: 'probe', text: 'I can help you create a new M365 user account. Could you please provide the **First Name** and **Last Name** of the user?' };
      }
      if (!userUpn) {
        return { type: 'probe', text: `Thanks! I've noted first name **${firstName}** and last name **${lastName}**. What **UPN email address** should we assign to this user? (e.g., username@tenant.onmicrosoft.com)` };
      }

      return {
        type: 'execute',
        ucCode: 'UC001',
        parameters: { firstName, lastName, userUpn, department: dept, jobTitle: title, licenseType: 'SPE_E5' }
      };
    }

    // 2. UC002 - Update Display Name
    if (cleanText.includes('display name') || findArgument([/display name/i])) {
      const userUpn = findArgument([/user is ([^\s]+@[^\s]+)/i, /upn is ([^\s]+@[^\s]+)/i, /for ([^\s]+@[^\s]+)/i, /upn:?\s*([^\s]+@[^\s]+)/i]);
      const displayName = findArgument([/name to ([\w\s]+)/i, /display name ([\w\s]+)/i, /name:?\s*([\w\s]+)/i]);

      if (!userUpn) {
        return { type: 'probe', text: 'I can update a user\'s display name. What is the **UPN email address** of the user account?' };
      }
      if (!displayName) {
        return { type: 'probe', text: `Got it. For user **${userUpn}**, what should the **new display name** be?` };
      }

      return {
        type: 'execute',
        ucCode: 'UC002',
        parameters: { userUpn, displayName }
      };
    }

    // 3. UC008 - Reset Password
    if (cleanText.includes('reset') && (cleanText.includes('password') || cleanText.includes('pass')) || findArgument([/reset password/i])) {
      const userUpn = findArgument([/user is ([^\s]+@[^\s]+)/i, /upn is ([^\s]+@[^\s]+)/i, /for ([^\s]+@[^\s]+)/i, /upn:?\s*([^\s]+@[^\s]+)/i]);
      if (!userUpn) {
        return { type: 'probe', text: 'I can perform a password reset. Which user account **UPN** needs its password reset?' };
      }
      return {
        type: 'execute',
        ucCode: 'UC008',
        parameters: { userUpn, forceChange: 'true' }
      };
    }

    // 4. UC010 / UC011 - Block/Unblock Sign-in
    if (cleanText.includes('block') || findArgument([/block/i])) {
      const userUpn = findArgument([/user is ([^\s]+@[^\s]+)/i, /upn is ([^\s]+@[^\s]+)/i, /for ([^\s]+@[^\s]+)/i, /upn:?\s*([^\s]+@[^\s]+)/i]);
      if (!userUpn) {
        return { type: 'probe', text: 'I can change account sign-in block statuses. Please specify the **UPN** of the user account.' };
      }
      const isUnblock = cleanText.includes('unblock');
      return {
        type: 'execute',
        ucCode: isUnblock ? 'UC011' : 'UC010',
        parameters: { userUpn }
      };
    }

    // 5. UC016 - Available Licenses
    if (cleanText.includes('licenses') && (cleanText.includes('available') || cleanText.includes('check') || cleanText.includes('tenant'))) {
      return {
        type: 'execute',
        ucCode: 'UC016',
        parameters: {}
      };
    }

    // 6. UC042 - Check Mailbox Size
    if (cleanText.includes('mailbox') && (cleanText.includes('size') || cleanText.includes('storage') || cleanText.includes('capacity'))) {
      const userUpn = findArgument([/mailbox ([^\s]+@[^\s]+)/i, /upn is ([^\s]+@[^\s]+)/i, /for ([^\s]+@[^\s]+)/i, /upn:?\s*([^\s]+@[^\s]+)/i]);
      if (!userUpn) {
        return { type: 'probe', text: 'I can check mailbox storage sizes. Which **mailbox UPN** would you like me to inspect?' };
      }
      return {
        type: 'execute',
        ucCode: 'UC042',
        parameters: { userUpn }
      };
    }

    // Fallback: general conversation greeting
    return {
      type: 'general',
      text: 'Hello! I am **CIS Support Agent**, your Microsoft 365 administrative assistant. Type **"m365"** to open the categories dashboard, or tell me what you\'d like to do (e.g. "create a new user", "reset password", or "check mailbox size").'
    };
  }
}
