import {
  TeamsActivityHandler,
  TurnContext,
  MessageFactory,
  CardFactory,
  ActivityTypes,
  ConversationReference,
  ConversationAccount,
  TeamsInfo
} from 'botbuilder';
import { IdentitySecurityFlow } from './services/identitySecurityFlow';
import { SettingsService } from './services/settingsService';
import { config } from './config';
import { CardBuilder } from './cards/cardBuilder';
import { HandoffService } from './services/handoff';
import { ServiceNowService } from './services/servicenow';
import { M365CardBuilder, AuditTrail } from './cards/m365CardBuilder';
import { GraphService } from './services/graphService';
import { ExchangeService } from './services/exchangeService';
import { AIService } from './services/aiService';
import { ApprovalService } from './services/approvalService';
import { StateManager } from './services/stateManager';
import { supportUseCases } from './useCases';

export class CIS360SupportBot extends TeamsActivityHandler {
  private checkUseCaseEnabled: (context: TurnContext, ucCode: string) => Promise<boolean>;

  constructor() {
    super();

    // Helper to validate if a use case is enabled
    this.checkUseCaseEnabled = async (context: TurnContext, ucCode: string): Promise<boolean> => {
      const settings = SettingsService.getSettings();
      // If enabledUseCases is undefined, assume all are enabled by default
      if (settings.enabledUseCases && settings.enabledUseCases[ucCode] === false) {
        const contactMode = settings.supportContactMode || 'support@company.com';
        await context.sendActivity(`This automation is turned off - Please contact administrator (${contactMode})`);
        return false;
      }
      return true;
    };

    // Handle incoming messages
    this.onMessage(async (context, next) => {
      const activity = context.activity;
      const userId = activity.from.id;
      const userName = activity.from.name || 'User';

      // 1. Determine if this message is coming from the Support Agent Channel
      const isChannelMessage = activity.conversation?.conversationType === 'channel' || 
                              activity.conversation?.id === config.supportChannelId;

      if (isChannelMessage) {
        await this.handleAgentChannelMessage(context);
        await next();
        return;
      }

      // 2. Message is from a regular user (Direct Message or personal scope)
      
      // A. Check if user is in an active handoff session
      const inHandoff = HandoffService.isUserInHandoff(userId);
      if (inHandoff) {
        await this.handleUserHandoffMessage(context);
        await next();
        return;
      }

      // B. Process card submissions (Action.Submit)
      if (activity.value && activity.value.action) {
        await this.handleCardAction(context);
        await next();
        return;
      }

      // Check Identity Security Flow state machine (SUC001, SUC002, SUC006)
      const rawText = (activity.text || '').trim();
      const text = rawText.toLowerCase();
      const requestorUpn = await this.resolveRequestorUpn(context);

      const flowResult = await IdentitySecurityFlow.handle(context, rawText, requestorUpn);
      if (flowResult.handled) {
        StateManager.clearHistory(userId);
        if (flowResult.triggerHandoff) {
           await (this as any).initiateHandoff(context, flowResult.category);
        }
        await next();
        return;
      }

      // Check if there is a pending AI execution for this user
      const pendingExec = StateManager.getPendingExecution(userId);
      if (pendingExec) {
        if (text === 'yes' || text === 'y' || text === 'sure' || text === 'do it') {
          StateManager.clearPendingExecution(userId);
          StateManager.clearHistory(userId);
          const requestorUpn = await this.resolveRequestorUpn(context);
          if (['SUC001', 'SUC002', 'SUC006'].includes(pendingExec.ucCode.toUpperCase())) {
            await IdentitySecurityFlow.handle(context, pendingExec.ucCode, requestorUpn);
          } else {
            await this.executeM365UseCase(context, pendingExec.ucCode, pendingExec.parameters, true);
          }
        } else {
          StateManager.clearPendingExecution(userId);
          StateManager.clearHistory(userId);
          await context.sendActivity('Okay, I have cancelled that request.');
        }
        await next();
        return;
      }

      // C. Fallback to text command parsing or NL Dialog
      const ucMatch = text.match(/^\/?((?:s)?uc\d{3})$/i);

      if (text === 'help' || text === 'menu') {
        const card = CardBuilder.helpCard();
        await context.sendActivity({ attachments: [card] });
      } else if (text === 'm365' || text === 'admin' || text === '/m365') {
        const card = M365CardBuilder.m365MenuCard();
        await context.sendActivity({ attachments: [card] });
      } else if (ucMatch) {
        const ucCode = ucMatch[1].toUpperCase();
        await context.sendActivity({
          attachments: [CardBuilder.textResponseCard('Direct Execution Disabled', `Task ${ucCode} cannot be run directly via ID anymore. Please describe what you want to do in natural language.`, 'warning')]
        });
      } else if (text === 'ticket' || text === 'snow') {
        const card = CardBuilder.ticketFormCard();
        await context.sendActivity({ attachments: [card] });
      } else if (text === 'escalate' || text === 'human' || text === 'agent') {
        const card = CardBuilder.escalationFormCard();
        await context.sendActivity({ attachments: [card] });
      } else if (rawText) {
        // Route to natural language parser
        await this.handleNaturalLanguageInput(context, rawText);
      }

      await next();
    });

    // Handle member additions (e.g. user starts a conversation)
    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      if (membersAdded) {
        for (const member of membersAdded) {
          if (member.id !== context.activity.recipient.id) {
            const userName = member.name || 'User';
            const welcome = CardBuilder.welcomeCard(userName);
            await context.sendActivity({ attachments: [welcome] });
          }
        }
      }
      await next();
    });
  }

  /**
   * Process message inputs when the user is in an active handoff session
   */
  private async handleUserHandoffMessage(context: TurnContext): Promise<void> {
    const activity = context.activity;
    const userId = activity.from.id;
    const session = HandoffService.getSessionByUserId(userId);

    if (!session) return;

    // Check if user wants to force-cancel
    const text = (activity.text || '').trim().toLowerCase();
    if (text === 'cancel' || text === 'exit' || text === 'end') {
      await this.terminateHandoffSession(context, userId, 'user');
      return;
    }

    if (session.state === 'waiting') {
      // Still waiting for an agent, send an update card
      const card = CardBuilder.textResponseCard(
        'Still Connecting...',
        'We are still waiting for a support agent to join your chat. Please wait, or type **"cancel"** to end this request.',
        'warning'
      );
      await context.sendActivity({ attachments: [card] });
      return;
    }

    if (session.state === 'active' && session.agentThreadId) {
      // Forward the user's message to the support channel thread
      const userText = activity.text || '';
      
      const agentRef = {
        channelId: 'msteams',
        serviceUrl: activity.serviceUrl,
        conversation: {
          id: config.supportChannelId,
          conversationType: 'channel',
          isGroup: true,
          name: 'Support Channel'
        },
        bot: activity.recipient
      } as ConversationReference;

      await context.adapter.continueConversationAsync(
        config.microsoftAppId,
        agentRef,
        async (agentContext) => {
          // Replying directly to the thread (agentThreadId)
          const reply = MessageFactory.text(`**[User ${session.userName}]:** ${userText}`);
          reply.replyToId = session.agentThreadId;
          await agentContext.sendActivity(reply);
        }
      );
    }
  }

  /**
   * Processes replies coming from the agent support channel
   */
  private async handleAgentChannelMessage(context: TurnContext): Promise<void> {
    const activity = context.activity;

    // Ignore messages from the bot itself to prevent infinite loops
    if (activity.from.id === activity.recipient.id) {
      return;
    }

    // Identify the thread ID (root message of the thread)
    const convId = activity.conversation.id;
    let rootMessageId = '';

    if (convId.includes('replyChainId=')) {
      const match = convId.match(/replyChainId=([^@\s]+)/);
      if (match) {
        rootMessageId = match[1];
      }
    } else if (activity.replyToId) {
      rootMessageId = activity.replyToId;
    }

    if (!rootMessageId) return;

    // Find the session linked to this thread
    const session = HandoffService.getSessionByThreadId(rootMessageId);
    if (!session || session.state !== 'active') {
      // Thread is not associated with an active handoff session
      return;
    }

    // Check if this is a card action from the agent console (e.g. End Chat)
    if (activity.value && activity.value.action) {
      if (activity.value.action === 'agent_end_handoff') {
        await this.terminateHandoffSession(context, session.userId, 'agent');
      }
      return;
    }

    // Forward the agent's text message to the user
    const agentText = (activity.text || '').trim();
    if (!agentText) return;

    await context.adapter.continueConversationAsync(
      config.microsoftAppId,
      session.userConversationReference,
      async (userContext) => {
        // All responses to the user MUST be adaptive cards
        const card = CardBuilder.textResponseCard(
          `Support Agent (${activity.from.name || 'Agent'})`,
          agentText,
          'info'
        );
        await userContext.sendActivity({ attachments: [card] });
      }
    );
  }

  /**
   * Processes submit actions from Adaptive Cards
   */
  private async handleCardAction(context: TurnContext): Promise<void> {
    const activity = context.activity;
    const action = activity.value.action;
    const userId = activity.from.id;
    const userName = activity.from.name || 'User';

    switch (action) {
      case 'show_welcome':
        await context.sendActivity({ attachments: [CardBuilder.welcomeCard(userName)] });
        break;

      case 'show_help':
        await context.sendActivity({ attachments: [CardBuilder.helpCard()] });
        break;

      case 'show_ticket_form':
        await context.sendActivity({ attachments: [CardBuilder.ticketFormCard()] });
        break;

      case 'submit_ticket':
        await this.handleTicketSubmission(context);
        break;

      case 'show_escalation_form':
        const prefilled = activity.value.details || '';
        await context.sendActivity({ attachments: [CardBuilder.escalationFormCard(prefilled)] });
        break;

      case 'submit_escalation':
        await this.initiateHandoff(context);
        break;

      case 'agent_claim_handoff':
        await this.handleAgentClaim(context);
        break;

      case 'end_handoff_session':
        await this.terminateHandoffSession(context, userId, 'user');
        break;

      case 'agent_end_handoff':
        await this.terminateHandoffSession(context, activity.value.userId, 'agent');
        break;

      // M365 Actions
      case 'm365_menu':
        await context.sendActivity({ attachments: [M365CardBuilder.m365MenuCard()] });
        break;

      case 'm365_submenu':
      case 'm365_form': {
        await context.sendActivity({
          attachments: [CardBuilder.textResponseCard('Menu Deprecated', 'The visual forms have been deprecated. Please type your request in natural language.', 'info')]
        });
        break;
      }
      case 'm365_run_direct': {
        const uc = activity.value.uc;
        if (uc === 'SUC001' || uc === 'SUC002' || uc === 'SUC006') {
          await IdentitySecurityFlow.handle(context, uc, await this.resolveRequestorUpn(context));
          break;
        }
        if (await this.checkUseCaseEnabled(context, uc)) {
          const card = M365CardBuilder.reviewAndConfirmCard(uc, {});
          await context.sendActivity({ attachments: [card] });
        }
        break;
      }

      case 'm365_execute': {
        const uc = activity.value.uc;
        if (uc === 'SUC001' || uc === 'SUC002' || uc === 'SUC006') {
          await IdentitySecurityFlow.handle(context, uc, await this.resolveRequestorUpn(context));
          break;
        }
        if (await this.checkUseCaseEnabled(context, uc)) {
          await this.handleM365ExecutionRequest(context);
        }
        break;
      }

      case 'm365_confirm_request':
        await this.handleM365ConfirmRequest(context);
        break;

      case 'm365_manager_decision':
        await this.handleM365ManagerDecision(context);
        break;
      default:
        console.log(`[Card Action] Unknown card action: ${action}`);
        await context.sendActivity({
          attachments: [CardBuilder.textResponseCard('Unknown Action', `The action "${action}" is not supported.`, 'error')]
        });
        break;
    }
  }

  /**
   * Submits ticket to ServiceNow (or mock client)
   */
  private async handleTicketSubmission(context: TurnContext): Promise<void> {
    const vals = context.activity.value;
    const shortDesc = vals.shortDescription;
    const desc = vals.description;
    const severity = vals.severity || 'Medium';

    if (!shortDesc || !desc) {
      await context.sendActivity({
        attachments: [CardBuilder.textResponseCard('Error', 'Missing required fields. Please fill out both title and details.', 'error')]
      });
      return;
    }

    // Send a typing indicator or temporary card
    const loadingCard = CardBuilder.textResponseCard('Creating Ticket', 'Submitting incident ticket to ServiceNow, please wait...', 'info');
    const loadingMessage = await context.sendActivity({ attachments: [loadingCard] });

    try {
      const incident = await ServiceNowService.createIncident(shortDesc, desc, severity);
      
      // Delete/update the loading message if supported, or just send the result card
      if (loadingMessage && loadingMessage.id) {
        try {
          await context.deleteActivity(loadingMessage.id);
        } catch (e) {
          // Ignored if client/channel doesn't support deleting
        }
      }

      const resultCard = CardBuilder.ticketResultCard(
        incident.number,
        incident.sys_id,
        incident.short_description,
        incident.state,
        config.serviceNowUrl,
        config.serviceNowMock
      );
      await context.sendActivity({ attachments: [resultCard] });

    } catch (err: any) {
      const errCard = CardBuilder.textResponseCard('ServiceNow Ticket Failed', `Failed to log incident: ${err.message}`, 'error');
      await context.sendActivity({ attachments: [errCard] });
    }
  }

  /**
   * Places the user in the human agent escalation queue
   */
  private async initiateHandoff(context: TurnContext, category?: string): Promise<void> {
    const activity = context.activity;
    const userId = activity.from.id;
    const userName = activity.from.name || 'User';
    
    // Resolve Support Channel ID
    let supportChannelId = config.supportChannelId;
    if (category) {
      const mappings = SettingsService.getSettings().categoryMappings || {};
      if (mappings[category] && mappings[category].trim() !== '') {
        supportChannelId = mappings[category];
      }
    }

    const escalationDetails = activity.value?.escalationDetails || activity.text || 'User requested human assistance.';
    const userConversationRef = TurnContext.getConversationReference(activity);

    // 1. Create in-memory session mapping
    HandoffService.createSession(userId, userName, userConversationRef as ConversationReference, escalationDetails, supportChannelId);

    // 2. Notify the user they are placed in the queue
    const userCard = CardBuilder.handoffStatusCard('waiting');
    await context.sendActivity({ attachments: [userCard] });

    // 3. Post a request card to the Support Agent Channel
    const agentCard = CardBuilder.agentChannelHandoffCard(userName, userId, escalationDetails);
    const channelMessage = MessageFactory.attachment(agentCard);
    
    // Ensure the message goes to the correct Teams Channel
    channelMessage.channelData = {
      teamsChannelId: supportChannelId
    };

    const supportConversationRef = {
      channelId: 'msteams',
      serviceUrl: activity.serviceUrl,
      conversation: {
        isGroup: true,
        conversationType: 'channel',
        id: supportChannelId,
        tenantId: activity.conversation?.tenantId
      },
      bot: activity.recipient
    } as ConversationReference;

    try {
      console.log(`[Handoff] Posting escalation ticket to support channel: ${supportChannelId}`);
      
      let agentThreadId = '';
      const conversationParams = {
        isGroup: true,
        channelData: {
          channel: { id: supportChannelId }
        },
        activity: channelMessage
      };

      // Create a new thread in the channel
      await context.adapter.createConversationAsync(
        config.microsoftAppId,
        'msteams',
        activity.serviceUrl,
        '',
        conversationParams as any,
        async (tContext) => {
          agentThreadId = tContext.activity.id || '';
        }
      );

      // Save the thread ID in the session so we can map replies and updates
      const session = HandoffService.getSessionByUserId(userId);
      if (session && agentThreadId) {
        session.agentThreadId = agentThreadId;
        console.log(`[Handoff] Saved agentThreadId: ${agentThreadId} for user: ${userId}`);
      } else if (session) {
        // Fallback if SDK didn't populate ID synchronously in callback
        session.agentThreadId = 'mock-thread-id-' + Date.now();
        console.log(`[Handoff] Fallback thread ID generated: ${session.agentThreadId}`);
      }

    } catch (err: any) {
      console.error('[Handoff Error] Failed to post message to support channel:', err.message);
      // Notify the user of the error
      HandoffService.endSession(userId);
      let errorDesc = err.message;
      if (err.message.includes('Bad format of conversation ID') || err.message.includes('Missing channelId')) {
        errorDesc = 'The IT Administrator has not configured a valid Teams Channel ID for this support category. Please ask them to update the Automation Hub Support Routing settings in the Control Plane.';
      }
      const errCard = CardBuilder.textResponseCard(
        'Escalation Error',
        `We were unable to contact the support channel: ${errorDesc}`,
        'error'
      );
      await context.sendActivity({ attachments: [errCard] });
    }
  }

  /**
   * Handles an agent claiming a handoff session from the support channel
   */
  private async handleAgentClaim(context: TurnContext): Promise<void> {
    const activity = context.activity;
    const targetUserId = activity.value.userId;
    const agentId = activity.from.id;
    const agentName = activity.from.name || 'Agent';

    const session = HandoffService.getSessionByUserId(targetUserId);

    if (!session) {
      // Session no longer exists or expired
      const expiredCard = CardBuilder.textResponseCard('Session Expired', 'This escalation request is no longer active.', 'error');
      await context.sendActivity({ attachments: [expiredCard] });
      return;
    }

    if (session.state === 'active') {
      // Session already claimed
      const claimedCard = CardBuilder.textResponseCard(
        'Already Claimed',
        `This support session has already been claimed by ${session.agentName}.`,
        'warning'
      );
      await context.sendActivity({ attachments: [claimedCard] });
      return;
    }

    // 1. Establish claim mappings
    const agentConversationRef = TurnContext.getConversationReference(activity);
    
    // In Teams, the activity ID of the card clicked is the parent message ID
    const threadId = activity.replyToId || session.agentThreadId || '';

    HandoffService.claimSession(
      targetUserId,
      threadId,
      agentConversationRef as ConversationReference,
      agentId,
      agentName
    );

    console.log(`[Handoff] Session claimed by ${agentName} for user ${session.userName}. Thread ID: ${threadId}`);

    // 2. Update the card in the Support Channel to show active console
    try {
      const consoleCard = CardBuilder.agentChatConsoleCard(session.userName, targetUserId);
      const updateActivity = MessageFactory.attachment(consoleCard);
      updateActivity.id = threadId;
      updateActivity.conversation = activity.conversation;
      await context.updateActivity(updateActivity);
    } catch (err: any) {
      console.error('[Handoff Error] Failed to update card in agent channel:', err.message);
      // Post a text update if updateActivity fails
      const reply = MessageFactory.text(`*System: Session claimed by ${agentName}.*`);
      reply.replyToId = threadId;
      await context.sendActivity(reply);
    }

    // 3. Notify the user they are connected
    await context.adapter.continueConversationAsync(
      config.microsoftAppId,
      session.userConversationReference as ConversationReference,
      async (userContext) => {
        const userCard = CardBuilder.handoffStatusCard('active', agentName);
        await userContext.sendActivity({ attachments: [userCard] });
      }
    );
  }

  /**
   * Terminate handoff session and return user to bot mode
   */
  private async terminateHandoffSession(
    context: TurnContext,
    userId: string,
    triggeredBy: 'user' | 'agent'
  ): Promise<void> {
    const session = HandoffService.getSessionByUserId(userId);
    if (!session) return;

    // Remove the session from state store
    HandoffService.endSession(userId);

    console.log(`[Handoff] Session terminated for ${session.userName} by ${triggeredBy}`);

    // 1. Notify the User
    if (triggeredBy === 'agent') {
      // If agent ended it, we need to actively push the notification to user
      await context.adapter.continueConversationAsync(
        config.microsoftAppId,
        session.userConversationReference as ConversationReference,
        async (userContext) => {
          const userCard = CardBuilder.handoffStatusCard('ended');
          await userContext.sendActivity({ attachments: [userCard] });
        }
      );
    } else {
      // If user ended it, we are already in the user's turn context
      const userCard = CardBuilder.handoffStatusCard('ended');
      await context.sendActivity({ attachments: [userCard] });
    }

    // 2. Update the Agent Support Channel Thread
    if (session.agentThreadId) {
      const agentRef = {
        channelId: 'msteams',
        serviceUrl: context.activity.serviceUrl,
        conversation: {
          id: config.supportChannelId,
          conversationType: 'channel',
          isGroup: true,
          name: 'Support Channel'
        },
        bot: context.activity.recipient
      } as ConversationReference;

      await context.adapter.continueConversationAsync(
        config.microsoftAppId,
        agentRef,
        async (agentContext) => {
          // Post notification in the thread
          const systemMsg = MessageFactory.text(`*System: Support session closed by ${triggeredBy === 'user' ? 'the user' : 'the agent'}.*`);
          systemMsg.replyToId = session.agentThreadId;
          await agentContext.sendActivity(systemMsg);

          // Update the original root card to a closed status
          try {
            const closedCard = CardBuilder.textResponseCard(
              'Support Session Closed',
              `The support session with ${session.userName} has ended.`,
              'info'
            );
            const updateActivity = MessageFactory.attachment(closedCard);
            updateActivity.id = session.agentThreadId;
            (updateActivity as any).conversation = {
              id: config.supportChannelId,
              conversationType: 'channel',
              isGroup: true,
              name: 'Support Channel'
            };
            await agentContext.updateActivity(updateActivity);
          } catch (e: any) {
            console.error('[Handoff Error] Failed to update agent card on termination:', e.message);
          }
        }
      );
    }
  }

  /**
   * Intercepts manual execution requests to present the Review & Confirm card
   */
  private async handleM365ExecutionRequest(context: TurnContext): Promise<void> {
    const vals = { ...context.activity.value };
    const uc = vals.uc;

    // Remove metadata fields from parameters
    delete vals.action;
    delete vals.uc;

    const card = M365CardBuilder.reviewAndConfirmCard(uc, vals);
    await context.sendActivity({ attachments: [card] });
  }

  /**
   * Processes a user's natural language request using the OpenAI service
   */
  private async handleNaturalLanguageInput(context: TurnContext, text: string): Promise<void> {
    const userId = context.activity.from.id;
    
    // Send typing indicator to Teams
    await context.sendActivity({ type: ActivityTypes.Typing });

    try {
      const aiResponse = await AIService.processMessage(userId, text);
      
      if (aiResponse.type === 'probe') {
        const card = CardBuilder.textResponseCard('CIS360 Support', aiResponse.text, 'info');
        await context.sendActivity({ attachments: [card] });
      } else if (aiResponse.type === 'general') {
        const card = CardBuilder.textResponseCard('CIS360 Support', aiResponse.text, 'info');
        await context.sendActivity({ attachments: [card] });
      } else if (aiResponse.type === 'execute') {
        const ucCode = aiResponse.ucCode.toUpperCase();
        if (!(await this.checkUseCaseEnabled(context, ucCode))) {
          return;
        }

        StateManager.setPendingExecution(userId, aiResponse);
        const useCase = supportUseCases.find(uc => uc.id === ucCode);
        const ucName = useCase ? useCase.name : ucCode;
        await context.sendActivity(`I understand you want to **${aiResponse.actionDescription}**. This corresponds to **${ucName}**. Do you want me to execute this? (Yes/No)`);
      }
    } catch (err: any) {
      console.error('[NLP Interaction Error] Failed to process message via AI:', err.message);
      const errCard = CardBuilder.textResponseCard(
        'NLP Service Unreachable',
        `I had trouble analyzing your request: ${err.message}. You can type **"m365"** to open the administrative portal forms manually.`,
        'error'
      );
      await context.sendActivity({ attachments: [errCard] });
    }
  }

  /**
   * Resolves the requestor UPN from the active session or Entra ID
   */
  private async resolveRequestorUpn(context: TurnContext): Promise<string> {
    try {
      const member = await TeamsInfo.getMember(context, context.activity.from.id);
      if (member && member.userPrincipalName) {
        return member.userPrincipalName.trim().toLowerCase();
      }
    } catch (err: any) {
      console.log('[UPN Resolve] TeamsInfo lookup failed, falling back to database check.', err.message);
    }

    const from = context.activity.from as any;
    if (from.aadObjectId) {
      try {
        const user = await GraphService.getUser(from.aadObjectId);
        if (user) {
          return user.userPrincipalName.trim().toLowerCase();
        }
      } catch (err: any) {
        console.log('[UPN Resolve] GraphService getUser failed.', err.message);
      }
    }

    // Default fallback UPN for tests and simulator
    return 'adele.vance@tenant.onmicrosoft.com';
  }

  /**
   * Determines if a request is self-service (targets the requestor's own profile/mailbox)
   */
  private isSelfService(ucCode: string, inputs: any, requestorUpn: string): boolean {
    const cleanRequestor = requestorUpn.trim().toLowerCase();
    const targetUpn = (inputs.userUpn || inputs.mailboxUpn || inputs.delegateUpn || '').trim().toLowerCase();

    // We will evaluate the new SUCxxxx use cases here later.
    const userSpecificUseCases: string[] = [];

    if (userSpecificUseCases.includes(ucCode) && targetUpn === cleanRequestor) {
      return true;
    }

    return false;
  }

  /**
   * Handles user/requestor consent when clicking "Confirm & Proceed" on the Review & Confirm card
   */
  private async handleM365ConfirmRequest(context: TurnContext): Promise<void> {
    const vals = { ...context.activity.value };
    const ucCode = vals.uc;

    // Filter metadata
    delete vals.action;
    delete vals.uc;
    const parameters = vals;

    // 1. Resolve requestor UPN
    const requestorUpn = await this.resolveRequestorUpn(context);

    // 2. Check if request is Self-Service
    const selfService = this.isSelfService(ucCode, parameters, requestorUpn);

    if (selfService) {
      // User Level issue/request: execute immediately with user/requestor consent
      const infoCard = CardBuilder.textResponseCard(
        'Processing Task',
        `Self-service request confirmed. Executing **${M365CardBuilder.getUseCaseName(ucCode)}**...`,
        'info'
      );
      await context.sendActivity({ attachments: [infoCard] });
      await this.executeM365UseCase(context, ucCode, parameters, true);
    } else {
      // Non-Self-Service: Require manager approval
      const requestorUser = await GraphService.getUser(requestorUpn);
      const managerUpn = requestorUser?.managerUpn;

      if (!managerUpn) {
        const errCard = CardBuilder.textResponseCard(
          'Approval Routing Failed',
          `We could not find a registered manager for **${requestorUpn}** in Entra ID. Administrative changes require manager approval.`,
          'error'
        );
        await context.sendActivity({ attachments: [errCard] });
        return;
      }

      // Generate request tracking details
      const requestId = M365CardBuilder.generateGuid();
      const userRef = TurnContext.getConversationReference(context.activity);
      
      ApprovalService.createRequest(
        requestId,
        ucCode,
        parameters,
        requestorUpn,
        userRef as ConversationReference,
        managerUpn
      );

      let approvalSent = false;
      try {
        const managerUser = await GraphService.getUser(managerUpn);
        if (managerUser && managerUser.id) {
          const managerId = managerUser.id;

          // Establish a proactive 1:1 chat with the manager
          const conversationParams = {
            bot: context.activity.recipient,
            members: [{ id: managerId }],
            isGroup: false,
            tenantId: context.activity.conversation.tenantId
          };

          await context.adapter.createConversationAsync(
            config.microsoftAppId,
            'msteams',
            context.activity.serviceUrl,
            '',
            conversationParams as any,
            async (managerContext) => {
              const approvalCard = M365CardBuilder.managerApprovalRequestCard(
                requestorUpn,
                ucCode,
                parameters,
                requestId
              );
              const response = await managerContext.sendActivity({ attachments: [approvalCard] });
              if (response && response.id) {
                ApprovalService.setManagerCardActivityId(requestId, response.id);
              }
            }
          );
          approvalSent = true;
        }
      } catch (err: any) {
        console.error('[Approval Flow] Failed to send proactive message to manager:', err.message);
      }

      // Fallback: If proactive chat creation fails (e.g. running in Emulator or tenant restriction),
      // we send it to the current chat as a simulated manager approval for testing.
      if (!approvalSent) {
        const approvalCard = M365CardBuilder.managerApprovalRequestCard(
          requestorUpn,
          ucCode,
          parameters,
          requestId
        );
        const notice = CardBuilder.textResponseCard(
          'Simulated Manager Chat',
          `[DEVELOPER MODE] A proactive approval request has been simulated. Approvals are routed to **${managerUpn}**. Use the card below to approve/reject.`,
          'warning'
        );
        await context.sendActivity({ attachments: [notice] });
        const response = await context.sendActivity({ attachments: [approvalCard] });
        if (response && response.id) {
          ApprovalService.setManagerCardActivityId(requestId, response.id);
        }
      } else {
        // Notify requestor that approval is sent to manager
        const pendingCard = CardBuilder.textResponseCard(
          'Awaiting Approval',
          `Your request has been forwarded to your manager (**${managerUpn}**) for approval. Once approved, the task will be executed automatically.`,
          'warning'
        );
        await context.sendActivity({ attachments: [pendingCard] });
      }
    }
  }

  /**
   * Handles the manager's click on the Approve or Reject action button
   */
  private async handleM365ManagerDecision(context: TurnContext): Promise<void> {
    const vals = context.activity.value;
    const { decision, requestId } = vals;

    const req = ApprovalService.getRequest(requestId);
    if (!req) {
      const expiredCard = CardBuilder.textResponseCard(
        'Request Expired',
        'This approval request is no longer valid or expired.',
        'error'
      );
      await context.sendActivity({ attachments: [expiredCard] });
      return;
    }

    if (req.status !== 'Pending') {
      const handledCard = CardBuilder.textResponseCard(
        'Request Processed',
        `This request has already been ${req.status.toLowerCase()}.`,
        'warning'
      );
      await context.sendActivity({ attachments: [handledCard] });
      return;
    }

    const clickerName = context.activity.from.name || 'Manager';

    if (decision === 'approve') {
      ApprovalService.updateStatus(requestId, 'Approved');

      // Update the manager's card in place to show Approved outcome
      try {
        const outcomeCard = M365CardBuilder.approvalOutcomeCard(
          'Approved',
          req.requestorUpn,
          req.ucCode,
          req.parameters
        );
        const updateActivity = MessageFactory.attachment(outcomeCard);
        updateActivity.id = context.activity.replyToId || req.managerCardActivityId;
        updateActivity.conversation = context.activity.conversation;
        await context.updateActivity(updateActivity);
      } catch (err: any) {
        console.error('[Manager Flow] Failed to update approval card:', err.message);
      }

      // Notify the requestor and execute the M365 task
      await context.adapter.continueConversationAsync(
        config.microsoftAppId,
        req.requestorConversationReference,
        async (userContext) => {
          const approvedCard = CardBuilder.textResponseCard(
            'Request Approved',
            `Your manager **${clickerName}** has approved your request. Executing task...`,
            'success'
          );
          await userContext.sendActivity({ attachments: [approvedCard] });

          // Execute under userContext so requestor gets the outcome and audit trail card
          await this.executeM365UseCase(userContext, req.ucCode, req.parameters, true);
        }
      );
    } else {
      ApprovalService.updateStatus(requestId, 'Rejected');

      // Update the manager's card in place to show Rejected outcome
      try {
        const outcomeCard = M365CardBuilder.approvalOutcomeCard(
          'Rejected',
          req.requestorUpn,
          req.ucCode,
          req.parameters
        );
        const updateActivity = MessageFactory.attachment(outcomeCard);
        updateActivity.id = context.activity.replyToId || req.managerCardActivityId;
        updateActivity.conversation = context.activity.conversation;
        await context.updateActivity(updateActivity);
      } catch (err: any) {
        console.error('[Manager Flow] Failed to update rejection card:', err.message);
      }

      // Notify the requestor of cancellation
      await context.adapter.continueConversationAsync(
        config.microsoftAppId,
        req.requestorConversationReference,
        async (userContext) => {
          const rejectedCard = CardBuilder.textResponseCard(
            'Request Rejected',
            `Your manager **${clickerName}** has rejected your request. The operation has been cancelled.`,
            'error'
          );
          await userContext.sendActivity({ attachments: [rejectedCard] });
        }
      );
    }
  }

  /**
   * Executes the M365 Administrative Use Case
   */
  private async executeM365UseCase(
    context: TurnContext,
    ucCode: string,
    inputs: any,
    confirmed: boolean
  ): Promise<void> {
    const userName = context.activity.from.name || 'Admin User';
    
    // Construct default audit trail
    const audit: AuditTrail = {
      requestId: M365CardBuilder.generateGuid(),
      timestamp: new Date().toISOString(),
      initiatedBy: userName,
      task: `${ucCode} - Execution`,
      target: inputs.userUpn || inputs.mailboxUpn || inputs.groupSearch || inputs.siteSearch || 'Tenant-level',
      status: 'Success',
      approvalRequired: confirmed ? 'Yes' : 'No'
    };

    try {
      const requestorUpn = await this.resolveRequestorUpn(context);
      let summaryText = '';
      const resultDetails: { title: string; facts: { title: string; value: string }[] }[] = [];
      let rollbackAction: any = undefined;

      switch (ucCode) {
        case 'SUC004': { // Check Password Expiry Status
          const upn = inputs.userUpn || requestorUpn;
          const user = await GraphService.getUser(upn);
          if (!user) throw new Error("User not found.");
          
          let lastChange = user.lastPasswordChangeDateTime ? new Date(user.lastPasswordChangeDateTime) : null;
          let expiryDateStr = 'Unknown';
          let daysRemainingStr = 'Unknown';

          if (lastChange) {
            const expiryDate = new Date(lastChange.getTime() + (90 * 24 * 60 * 60 * 1000)); // Default 90 days
            const daysRemaining = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            expiryDateStr = expiryDate.toDateString();
            daysRemainingStr = daysRemaining > 0 ? `${daysRemaining} days` : 'Expired';
          }

          summaryText = `Password expiry status for **${user.userPrincipalName}**.`;
          resultDetails.push({
            title: 'Expiry Status',
            facts: [
              { title: 'Last Changed:', value: lastChange ? lastChange.toDateString() : 'N/A' },
              { title: 'Estimated Expiry Date:', value: expiryDateStr },
              { title: 'Days Remaining:', value: daysRemainingStr }
            ]
          });
          break;
        }

        case 'SUC005': { // Check Last Password Change Date
          const upn = inputs.userUpn || requestorUpn;
          const user = await GraphService.getUser(upn);
          if (!user) throw new Error("User not found.");

          let lastChange = user.lastPasswordChangeDateTime ? new Date(user.lastPasswordChangeDateTime) : null;
          let elapsedStr = 'Unknown';

          if (lastChange) {
            const daysElapsed = Math.floor((new Date().getTime() - lastChange.getTime()) / (1000 * 3600 * 24));
            elapsedStr = `${daysElapsed} days ago`;
          }

          summaryText = `Last password change for **${user.userPrincipalName}**.`;
          resultDetails.push({
            title: 'Password History',
            facts: [
              { title: 'Last Changed Date:', value: lastChange ? lastChange.toLocaleString() : 'N/A' },
              { title: 'Time Elapsed:', value: elapsedStr }
            ]
          });
          break;
        }

        case 'SUC007': { // Check SSPR Enrollment Status
          const upn = inputs.userUpn || requestorUpn;
          const user = await GraphService.getUser(upn);
          if (!user) throw new Error("User not found.");

          const hasPhone = !!user.mobilePhone;
          const hasEmail = user.otherMails && user.otherMails.length > 0;
          const isEnrolled = hasPhone || hasEmail;

          summaryText = `SSPR Enrollment status for **${user.userPrincipalName}**.`;
          resultDetails.push({
            title: 'SSPR Status',
            facts: [
              { title: 'Enrollment Status:', value: isEnrolled ? '✅ Enrolled' : '❌ Not Enrolled' },
              { title: 'Mobile Phone:', value: hasPhone ? user.mobilePhone : 'Not Configured' },
              { title: 'Alternate Email:', value: hasEmail ? user.otherMails!.join(', ') : 'Not Configured' }
            ]
          });
          break;
        }

        case 'SUC030': { // View My Sign-in History
          const upn = inputs.userUpn || requestorUpn;
          const limit = inputs.limit ? parseInt(inputs.limit) : 5;
          const logs = await GraphService.getSignInHistory(upn, 'all', limit);
          
          summaryText = `Recent Sign-in History for **${upn}** (Last ${limit} attempts).`;
          
          if (logs.length === 0) {
            resultDetails.push({ title: 'Sign-ins', facts: [{ title: 'Result:', value: 'No sign-in history found.' }] });
          } else {
            logs.forEach((log, index) => {
              const statusStr = log.status.errorCode === 0 ? '✅ Success' : `❌ Failed (${log.status.errorCode}: ${log.status.failureReason})`;
              resultDetails.push({
                title: `Attempt ${index + 1}`,
                facts: [
                  { title: 'Time:', value: new Date(log.createdDateTime).toLocaleString() },
                  { title: 'Status:', value: statusStr },
                  { title: 'App:', value: log.appDisplayName },
                  { title: 'IP Address:', value: log.ipAddress },
                  { title: 'Location:', value: `${log.location.city || 'Unknown'}, ${log.location.state || ''} ${log.location.countryOrRegion || ''}`.trim() }
                ]
              });
            });
          }
          break;
        }

        case 'SUC031': { // View Failed Sign-ins
          const upn = inputs.userUpn || requestorUpn;
          const limit = inputs.limit ? parseInt(inputs.limit) : 5;
          const logs = await GraphService.getSignInHistory(upn, 'failed', limit);
          
          summaryText = `Recent Failed Sign-ins for **${upn}** (Last ${limit} failures).`;
          
          if (logs.length === 0) {
            resultDetails.push({ title: 'Failed Sign-ins', facts: [{ title: 'Result:', value: 'No failed sign-ins found! 🎉' }] });
          } else {
            logs.forEach((log, index) => {
              resultDetails.push({
                title: `Failure ${index + 1}`,
                facts: [
                  { title: 'Time:', value: new Date(log.createdDateTime).toLocaleString() },
                  { title: 'Reason:', value: `${log.status.errorCode}: ${log.status.failureReason}` },
                  { title: 'App:', value: log.appDisplayName },
                  { title: 'IP Address:', value: log.ipAddress },
                  { title: 'Location:', value: `${log.location.city || 'Unknown'}, ${log.location.state || ''} ${log.location.countryOrRegion || ''}`.trim() }
                ]
              });
            });
          }
          break;
        }

        case 'SUC032': { // View Sign-in Locations
          const upn = inputs.userUpn || requestorUpn;
          const limit = inputs.limit ? parseInt(inputs.limit) : 10;
          const logs = await GraphService.getSignInHistory(upn, 'all', limit);
          
          summaryText = `Recent Sign-in Locations for **${upn}** (Last ${limit} attempts).`;
          
          if (logs.length === 0) {
            resultDetails.push({ title: 'Locations', facts: [{ title: 'Result:', value: 'No sign-in locations found.' }] });
          } else {
            // Group locations
            const locationMap = new Map<string, number>();
            logs.forEach(log => {
              const locStr = `${log.location.city || 'Unknown'}, ${log.location.countryOrRegion || 'Unknown'}`;
              locationMap.set(locStr, (locationMap.get(locStr) || 0) + 1);
            });
            
            const facts = Array.from(locationMap.entries()).map(([loc, count]) => ({
              title: loc,
              value: `${count} sign-in(s)`
            }));
            
            resultDetails.push({
              title: 'Sign-in Frequency by Region',
              facts: facts
            });
          }
          break;
        }

        default:
          throw new Error(`Unsupported M365 Administrative Use Case: ${ucCode}`);
      }

      // Render the success Adaptive Card with Audit details and rollback button if set
      audit.status = 'Success';
      const successCard = M365CardBuilder.useCaseResultCard(
        ucCode,
        summaryText,
        audit,
        resultDetails,
        rollbackAction
      );

      await context.sendActivity({ attachments: [successCard] });

    } catch (err: any) {
      console.error(`[M365 Exec Error] Failed to run UC ${ucCode}:`, err.message);
      
      // Render the failed Adaptive Card
      audit.status = 'Failed';
      const errorCard = M365CardBuilder.useCaseErrorCard(
        ucCode,
        'API_EXECUTION_FAILURE',
        err.message || 'Unknown network error',
        'Verify target existence, permissions scope, or network connection status.',
        { action: 'm365_execute', uc: ucCode, ...inputs } // Offer retry
      );

      await context.sendActivity({ attachments: [errorCard] });
    }
  }
}
