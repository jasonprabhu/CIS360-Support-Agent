const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'src', 'services', 'aiService.ts');
let content = fs.readFileSync(p, 'utf8');

content = content.replace(/export type AIResponse = AIExecutionResponse \| AIProbeResponse \| AIGeneralResponse;/g,
`export interface AIEscalateResponse {
  type: 'escalate';
  domain: string;
  summary: string;
}

export type AIResponse = AIExecutionResponse | AIProbeResponse | AIGeneralResponse | AIEscalateResponse;`);

content = content.replace(/const tools: OpenAI\.Chat\.Completions\.ChatCompletionTool\[\] = \[[\s\S]*?\];/,
`const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
        {
          type: 'function',
          function: {
            name: 'execute_m365_task',
            description: 'Executes an administrative task/use-case when all required parameters are collected and the task perfectly matches a supported automation.',
            parameters: {
              type: 'object',
              properties: {
                ucCode: { type: 'string', description: 'The use case code (e.g. SUC001) identifying the task.' },
                actionDescription: { type: 'string', description: 'A short, user-friendly description of what you are about to do.' },
                parameters: { type: 'object', description: 'Dynamic arguments collected for the specific use case.', additionalProperties: true }
              },
              required: ['ucCode', 'actionDescription', 'parameters']
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'escalate_to_support',
            description: 'Routes the user to Level 3 Human Support. Use this ONLY if the issue is strictly within M365 Scope (Identity, Exchange, SharePoint, ODFB, Teams) BUT there is no exact automation available.',
            parameters: {
              type: 'object',
              properties: {
                domain: { type: 'string', enum: ['Identity', 'Exchange', 'SharePoint', 'OneDrive', 'Teams', 'Other M365'], description: 'The M365 domain this issue belongs to.' },
                summary: { type: 'string', description: 'A concise summary of the exact problem.' }
              },
              required: ['domain', 'summary']
            }
          }
        }
      ];`);

content = content.replace(/const systemPrompt = \`You are CIS Support Agent[\s\S]*?never ask for admin credentials or passwords\.[\s\S]*?\`;/g, 
`const systemPrompt = \`You are CIS Support Agent, a Level 1 IT Support assistant.
Your job is to strictly help users with Microsoft 365 services (Identity, Exchange, SharePoint, OneDrive for Business, Teams).

Supported Automations:
\${useCaseList}

Triage & Routing Logic:
1. Intent Recognition: Determine if the user's issue falls under the M365 Scope (Identity, Exchange, SharePoint, ODFB, Teams).
2. Automation Available (IN SCOPE): If their issue PERFECTLY MATCHES a supported automation, call 'execute_m365_task' (probe for parameters first if necessary). NOTE: Identity security tasks (SUC001, SUC002, SUC006) require NO parameters.
3. No Automation Available (IN SCOPE): If their issue is M365 related (e.g. "I can't upload files", "Teams call quality is bad") but NO AUTOMATION exists, DO NOT GUESS. You must call 'escalate_to_support' to route them to L3.
4. OUT OF SCOPE: If the user asks about third-party software (SAP, Adobe, etc), non-IT topics, or hardware, DO NOT use any tools. Politely decline and state that you only support M365/Identity services.\`;`);

content = content.replace(/if \(toolCall\.function\.name === 'execute_m365_task'\) \{[\s\S]*?\}\n      \}/,
`if (toolCall.function.name === 'execute_m365_task') {
          const parsed = JSON.parse(toolCall.function.arguments);
          return {
            type: 'execute',
            ucCode: parsed.ucCode,
            actionDescription: parsed.actionDescription || 'execute task',
            parameters: parsed.parameters
          };
        } else if (toolCall.function.name === 'escalate_to_support') {
          const parsed = JSON.parse(toolCall.function.arguments);
          return {
            type: 'escalate',
            domain: parsed.domain,
            summary: parsed.summary
          };
        }
      }`);

fs.writeFileSync(p, content);
console.log('Successfully updated aiService.ts');
