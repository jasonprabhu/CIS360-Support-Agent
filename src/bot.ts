import {
  TeamsActivityHandler,
  TurnContext,
  MessageFactory,
  CardFactory,
  ActivityTypes,
  ConversationReference,
  ConversationAccount
} from 'botbuilder';
import { config } from './config';
import { CardBuilder } from './cards/cardBuilder';
import { HandoffService } from './services/handoff';
import { ServiceNowService } from './services/servicenow';
import { M365CardBuilder, AuditTrail } from './cards/m365CardBuilder';
import { GraphService } from './services/graphService';
import { ExchangeService } from './services/exchangeService';

export class CIS360SupportBot extends TeamsActivityHandler {
  constructor() {
    super();

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

      // C. Fallback to text command parsing
      const text = (activity.text || '').trim().toLowerCase();
      const ucMatch = text.match(/^\/?(uc\d{3})$/);

      if (text === 'help' || text === 'menu') {
        const card = CardBuilder.helpCard();
        await context.sendActivity({ attachments: [card] });
      } else if (text === 'm365' || text === 'admin' || text === '/m365') {
        const card = M365CardBuilder.m365MenuCard();
        await context.sendActivity({ attachments: [card] });
      } else if (ucMatch) {
        const ucCode = ucMatch[1].toUpperCase();
        const card = M365CardBuilder.useCaseInputForm(ucCode);
        await context.sendActivity({ attachments: [card] });
      } else if (text === 'ticket' || text === 'snow') {
        const card = CardBuilder.ticketFormCard();
        await context.sendActivity({ attachments: [card] });
      } else if (text === 'escalate' || text === 'human' || text === 'agent') {
        const card = CardBuilder.escalationFormCard();
        await context.sendActivity({ attachments: [card] });
      } else {
        // All responses MUST be in adaptive cards
        const defaultCard = CardBuilder.welcomeCard(userName);
        await context.sendActivity({ attachments: [defaultCard] });
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
        await context.sendActivity({ attachments: [M365CardBuilder.m365SubmenuCard(activity.value.category)] });
        break;

      case 'm365_form':
        await context.sendActivity({ attachments: [M365CardBuilder.useCaseInputForm(activity.value.uc)] });
        break;

      case 'm365_run_direct':
        await this.executeM365UseCase(context, activity.value.uc, {}, false);
        break;

      case 'm365_execute':
        await this.handleM365ExecutionRequest(context);
        break;

      case 'm365_execute_confirmed':
        await this.executeM365UseCase(context, activity.value.uc, activity.value, true);
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
  private async initiateHandoff(context: TurnContext): Promise<void> {
    const activity = context.activity;
    const userId = activity.from.id;
    const userName = activity.from.name || 'User';
    const escalationDetails = activity.value.escalationDetails || 'No details provided';

    // 1. Create in-memory session mapping
    const userConversationRef = TurnContext.getConversationReference(activity);
    HandoffService.createSession(userId, userName, userConversationRef as ConversationReference, escalationDetails);

    // 2. Notify the user they are placed in the queue
    const userCard = CardBuilder.handoffStatusCard('waiting');
    await context.sendActivity({ attachments: [userCard] });

    // 3. Post a request card to the Support Agent Channel
    const supportChannelId = config.supportChannelId;
    const agentCard = CardBuilder.agentChannelHandoffCard(userName, userId, escalationDetails);
    const channelMessage = MessageFactory.attachment(agentCard);
    
    // Ensure the message goes to the correct Teams Channel
    channelMessage.channelData = {
      teamsChannelId: supportChannelId
    };

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
      const errCard = CardBuilder.textResponseCard(
        'Escalation Error',
        `We were unable to contact the support channel: ${err.message}. Please try again later.`,
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
   * Intercepts execution requests to verify if confirmation is required
   */
  private async handleM365ExecutionRequest(context: TurnContext): Promise<void> {
    const vals = context.activity.value;
    const uc = vals.uc;

    // List of risky actions requiring confirmation
    const riskyActions = ['UC010', 'UC012', 'UC030'];
    const isRisky = riskyActions.includes(uc);

    if (isRisky) {
      const target = vals.userUpn || vals.mailboxUpn || 'Unknown Target';
      const card = M365CardBuilder.useCaseConfirmationCard(uc, vals, target);
      await context.sendActivity({ attachments: [card] });
    } else {
      await this.executeM365UseCase(context, uc, vals, false);
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
      let summaryText = '';
      const resultDetails: { title: string; facts: { title: string; value: string }[] }[] = [];
      let rollbackAction: any = undefined;

      switch (ucCode) {
        // UC001 - Create User
        case 'UC001': {
          const { user, tempPassword } = await GraphService.createUser(
            inputs.firstName,
            inputs.lastName,
            inputs.userUpn,
            inputs.department || '',
            inputs.jobTitle || '',
            inputs.licenseType || ''
          );
          summaryText = `Successfully created user **${user.displayName}** and assigned licenses.`;
          resultDetails.push({
            title: 'Created Account Credentials',
            facts: [
              { title: 'Display Name:', value: user.displayName },
              { title: 'UPN / Username:', value: user.userPrincipalName },
              { title: 'Temporary Password:', value: tempPassword },
              { title: 'Status:', value: 'Account Enabled' }
            ]
          });
          break;
        }

        // UC002 - Update Display Name
        case 'UC002': {
          const res = await GraphService.updateUserField(inputs.userUpn, 'displayName', inputs.displayName);
          summaryText = `Successfully updated display name for **${inputs.userUpn}**.`;
          resultDetails.push({
            title: 'Display Name Comparison',
            facts: [
              { title: 'Before:', value: res.before || 'Empty' },
              { title: 'After:', value: res.after }
            ]
          });
          rollbackAction = { action: 'm365_execute', uc: 'UC002', userUpn: inputs.userUpn, displayName: res.before };
          break;
        }

        // UC003 - Update Job Title
        case 'UC003': {
          const res = await GraphService.updateUserField(inputs.userUpn, 'jobTitle', inputs.jobTitle);
          summaryText = `Successfully updated job title for **${inputs.userUpn}**.`;
          resultDetails.push({
            title: 'Job Title Update',
            facts: [
              { title: 'Old Title:', value: res.before || 'None' },
              { title: 'New Title:', value: res.after }
            ]
          });
          rollbackAction = { action: 'm365_execute', uc: 'UC003', userUpn: inputs.userUpn, jobTitle: res.before };
          break;
        }

        // UC004 - Update Department
        case 'UC004': {
          const res = await GraphService.updateUserField(inputs.userUpn, 'department', inputs.department);
          summaryText = `Successfully updated department for **${inputs.userUpn}**.`;
          resultDetails.push({
            title: 'Department Update',
            facts: [
              { title: 'Old Department:', value: res.before || 'None' },
              { title: 'New Department:', value: res.after }
            ]
          });
          rollbackAction = { action: 'm365_execute', uc: 'UC004', userUpn: inputs.userUpn, department: res.before };
          break;
        }

        // UC005 - Update Manager
        case 'UC005': {
          const res = await GraphService.updateManager(inputs.userUpn, inputs.managerUpn);
          summaryText = `Successfully updated manager for **${inputs.userUpn}**.`;
          resultDetails.push({
            title: 'Manager Relationship',
            facts: [
              { title: 'Previous Manager:', value: res.before },
              { title: 'New Manager:', value: res.after }
            ]
          });
          rollbackAction = { action: 'm365_execute', uc: 'UC005', userUpn: inputs.userUpn, managerUpn: res.before };
          break;
        }

        // UC008 - Reset Password
        case 'UC008': {
          const force = inputs.forceChange === 'true';
          const tempPass = await GraphService.resetPassword(inputs.userUpn, force);
          summaryText = `Successfully reset password for **${inputs.userUpn}**.`;
          resultDetails.push({
            title: 'New Account Password',
            facts: [
              { title: 'Account UPN:', value: inputs.userUpn },
              { title: 'Temporary Password:', value: tempPass },
              { title: 'Force Password Change:', value: force ? 'Yes' : 'No' }
            ]
          });
          break;
        }

        // UC010 - Block Sign-in
        case 'UC010': {
          await GraphService.setSignInBlocked(inputs.userUpn, true);
          summaryText = `Account status updated: **Sign-in blocked** for user **${inputs.userUpn}**.`;
          rollbackAction = { action: 'm365_execute', uc: 'UC011', userUpn: inputs.userUpn };
          break;
        }

        // UC011 - Unblock Sign-in
        case 'UC011': {
          await GraphService.setSignInBlocked(inputs.userUpn, false);
          summaryText = `Account status updated: **Sign-in allowed** for user **${inputs.userUpn}**.`;
          rollbackAction = { action: 'm365_execute_confirmed', uc: 'UC010', userUpn: inputs.userUpn };
          break;
        }

        // UC012 - Delete User
        case 'UC012': {
          await GraphService.deleteUser(inputs.userUpn);
          summaryText = `Successfully deleted user account **${inputs.userUpn}** from Microsoft Entra directory.`;
          break;
        }

        // UC013 - Assign License
        case 'UC013': {
          await GraphService.assignLicense(inputs.userUpn, inputs.skuId);
          summaryText = `Successfully assigned license SKU **${inputs.skuId}** to **${inputs.userUpn}**.`;
          rollbackAction = { action: 'm365_execute', uc: 'UC014', userUpn: inputs.userUpn, skuId: inputs.skuId };
          break;
        }

        // UC014 - Remove License
        case 'UC014': {
          await GraphService.removeLicense(inputs.userUpn, inputs.skuId);
          summaryText = `Successfully removed license SKU **${inputs.skuId}** from **${inputs.userUpn}**.`;
          rollbackAction = { action: 'm365_execute', uc: 'UC013', userUpn: inputs.userUpn, skuId: inputs.skuId };
          break;
        }

        // UC015 - Check Licenses
        case 'UC015': {
          const user = await GraphService.getUser(inputs.userUpn);
          if (!user) throw new Error(`User not found: ${inputs.userUpn}`);
          summaryText = `Retrieved licenses for user **${user.displayName}**.`;
          resultDetails.push({
            title: 'Assigned Licenses',
            facts: user.assignedLicenses.length > 0
              ? user.assignedLicenses.map((lic, index) => ({ title: `License ${index + 1}:`, value: lic }))
              : [{ title: 'Licensing:', value: 'No licenses assigned (Unlicensed Account)' }]
          });
          break;
        }

        // UC016 - Check Available Licenses
        case 'UC016': {
          const skus = await GraphService.checkAvailableLicenses();
          summaryText = 'Subscribed SKU License Matrix:';
          resultDetails.push({
            title: 'Tenant Licensing Pool',
            facts: skus.map(s => ({
              title: s.skuPartNumber,
              value: `Available: ${s.totalUnits - s.consumedUnits} / Total: ${s.totalUnits} (Consumed: ${s.consumedUnits})`
            }))
          });
          break;
        }

        // UC020 - Find Unlicensed Users
        case 'UC020': {
          const unlicensed = await GraphService.findUnlicensedUsers();
          summaryText = `Identified **${unlicensed.length}** unlicensed user accounts in the tenant.`;
          resultDetails.push({
            title: 'Unlicensed Users List',
            facts: unlicensed.slice(0, 10).map((u, i) => ({ title: `${i + 1}. UPN:`, value: `${u.displayName} (${u.userPrincipalName})` }))
          });
          break;
        }

        // UC021 - Create Security Group
        case 'UC021': {
          const grp = await GraphService.createGroup(inputs.displayName, inputs.description || '', false);
          summaryText = `Created security group **${grp.displayName}** successfully.`;
          resultDetails.push({
            title: 'Group Details',
            facts: [
              { title: 'Display Name:', value: grp.displayName },
              { title: 'Group ID:', value: grp.id },
              { title: 'Security Enabled:', value: 'Yes' }
            ]
          });
          break;
        }

        // UC022 - Create M365 Group
        case 'UC022': {
          const grp = await GraphService.createGroup(inputs.displayName, inputs.description || '', true);
          summaryText = `Created Microsoft 365 group **${grp.displayName}** successfully.`;
          resultDetails.push({
            title: 'Unified Group Details',
            facts: [
              { title: 'Display Name:', value: grp.displayName },
              { title: 'Group ID:', value: grp.id },
              { title: 'Unified Mailbox:', value: 'Enabled' }
            ]
          });
          break;
        }

        // UC023 - Add Group Member
        case 'UC023': {
          await GraphService.manageGroupMember(inputs.groupSearch, inputs.userUpn, 'add');
          summaryText = `Added user **${inputs.userUpn}** to group **${inputs.groupSearch}**.`;
          rollbackAction = { action: 'm365_execute', uc: 'UC024', groupSearch: inputs.groupSearch, userUpn: inputs.userUpn };
          break;
        }

        // UC024 - Remove Group Member
        case 'UC024': {
          await GraphService.manageGroupMember(inputs.groupSearch, inputs.userUpn, 'remove');
          summaryText = `Removed user **${inputs.userUpn}** from group **${inputs.groupSearch}**.`;
          rollbackAction = { action: 'm365_execute', uc: 'UC023', groupSearch: inputs.groupSearch, userUpn: inputs.userUpn };
          break;
        }

        // UC025 - View Group Members
        case 'UC025': {
          const res = await GraphService.getGroupMembers(inputs.groupSearch);
          summaryText = `Members list for group **${res.group.displayName}**.`;
          resultDetails.push({
            title: 'Group Members',
            facts: res.members.length > 0
              ? res.members.map((m, i) => ({ title: `Member ${i + 1}:`, value: m }))
              : [{ title: 'Members:', value: 'No members in this group.' }]
          });
          break;
        }

        // UC026 - Update Group Owner
        case 'UC026': {
          await GraphService.updateGroupOwner(inputs.groupSearch, inputs.userUpn);
          summaryText = `Assigned user **${inputs.userUpn}** as owner of **${inputs.groupSearch}**.`;
          break;
        }

        // UC027 - Hide Group from GAL
        case 'UC027': {
          const hide = inputs.hide === 'true';
          await GraphService.setGroupVisibility(inputs.groupSearch, !hide);
          summaryText = `Updated GAL visibility for group **${inputs.groupSearch}** to: **${hide ? 'Hidden' : 'Visible'}**.`;
          rollbackAction = { action: 'm365_execute', uc: 'UC027', groupSearch: inputs.groupSearch, hide: hide ? 'false' : 'true' };
          break;
        }

        // UC028 - Rename Group
        case 'UC028': {
          const res = await GraphService.renameGroup(inputs.groupSearch, inputs.newName);
          summaryText = `Successfully renamed group **${res.before}** to **${res.after}**.`;
          rollbackAction = { action: 'm365_execute', uc: 'UC028', groupSearch: inputs.groupSearch, newName: res.before };
          break;
        }

        // UC029 - Create Shared Mailbox
        case 'UC029': {
          const mbox = await ExchangeService.createSharedMailbox(inputs.displayName, inputs.userUpn);
          summaryText = `Shared Mailbox **${mbox.displayName}** created successfully.`;
          resultDetails.push({
            title: 'Mailbox Configuration',
            facts: [
              { title: 'Email Address:', value: mbox.userPrincipalName },
              { title: 'Quota Size:', value: `${mbox.maxSizeGb} GB` }
            ]
          });
          rollbackAction = { action: 'm365_execute_confirmed', uc: 'UC030', userUpn: mbox.userPrincipalName };
          break;
        }

        // UC030 - Delete Shared Mailbox
        case 'UC030': {
          await ExchangeService.deleteSharedMailbox(inputs.userUpn);
          summaryText = `Successfully deleted shared mailbox **${inputs.userUpn}**.`;
          break;
        }

        // UC031 - Add Mailbox Delegate
        case 'UC031': {
          await ExchangeService.grantMailboxPermission(inputs.mailboxUpn, inputs.delegateUpn, inputs.permission);
          summaryText = `Granted permission **${inputs.permission}** on mailbox **${inputs.mailboxUpn}** to delegate **${inputs.delegateUpn}**.`;
          rollbackAction = {
            action: 'm365_execute',
            uc: 'UC032',
            mailboxUpn: inputs.mailboxUpn,
            delegateUpn: inputs.delegateUpn,
            permission: inputs.permission
          };
          break;
        }

        // UC032 - Remove Mailbox Delegate
        case 'UC032': {
          await ExchangeService.removeMailboxPermission(inputs.mailboxUpn, inputs.delegateUpn, inputs.permission);
          summaryText = `Removed permission **${inputs.permission}** on mailbox **${inputs.mailboxUpn}** for delegate **${inputs.delegateUpn}**.`;
          rollbackAction = {
            action: 'm365_execute',
            uc: 'UC031',
            mailboxUpn: inputs.mailboxUpn,
            delegateUpn: inputs.delegateUpn,
            permission: inputs.permission
          };
          break;
        }

        // UC036 - Check Mailbox Permissions
        case 'UC036': {
          const mbox = await ExchangeService.getMailboxPermissions(inputs.userUpn);
          summaryText = `Permissions matrix for shared mailbox **${mbox.displayName}**.`;
          resultDetails.push({
            title: 'Access Delegation Rights',
            facts: mbox.delegates.length > 0
              ? mbox.delegates.map(d => ({ title: `${d.permission}:`, value: d.userUpn }))
              : [{ title: 'Delegates:', value: 'No active delegates assigned' }]
          });
          break;
        }

        // UC037 - Enable Forwarding
        case 'UC037': {
          await ExchangeService.setMailForwarding(inputs.userUpn, inputs.forwardAddress);
          summaryText = `Mail forwarding enabled for user **${inputs.userUpn}** -> **${inputs.forwardAddress}**.`;
          rollbackAction = { action: 'm365_execute', uc: 'UC038', userUpn: inputs.userUpn };
          break;
        }

        // UC038 - Disable Forwarding
        case 'UC038': {
          await ExchangeService.setMailForwarding(inputs.userUpn, null);
          summaryText = `Mail forwarding disabled for user **${inputs.userUpn}**.`;
          break;
        }

        // UC039 - Set Automatic Reply
        case 'UC039': {
          await ExchangeService.setAutomaticReplies(inputs.userUpn, true, inputs.message);
          summaryText = `Out-of-office automatic replies enabled on mailbox **${inputs.userUpn}**.`;
          resultDetails.push({
            title: 'Configured Message Text',
            facts: [{ title: 'Auto-Reply Body:', value: inputs.message }]
          });
          rollbackAction = { action: 'm365_execute', uc: 'UC040', userUpn: inputs.userUpn };
          break;
        }

        // UC040 - Disable Automatic Reply
        case 'UC040': {
          await ExchangeService.setAutomaticReplies(inputs.userUpn, false, '');
          summaryText = `Out-of-office automatic replies disabled on mailbox **${inputs.userUpn}**.`;
          break;
        }

        // UC041 - Increase Quota
        case 'UC041': {
          const quota = parseFloat(inputs.quotaGb);
          const oldQuota = await ExchangeService.getMailboxSize(inputs.userUpn);
          await ExchangeService.increaseMailboxQuota(inputs.userUpn, quota);
          summaryText = `Successfully updated storage size limit for **${inputs.userUpn}** to **${quota} GB**.`;
          resultDetails.push({
            title: 'Quota Comparison',
            facts: [
              { title: 'Previous Quota Limit:', value: `${oldQuota.maxSizeGb} GB` },
              { title: 'New Quota Limit:', value: `${quota} GB` }
            ]
          });
          rollbackAction = { action: 'm365_execute', uc: 'UC041', userUpn: inputs.userUpn, quotaGb: oldQuota.maxSizeGb };
          break;
        }

        // UC042 - Check Mailbox Size
        case 'UC042': {
          const stats = await ExchangeService.getMailboxSize(inputs.userUpn);
          summaryText = `Mailbox storage sizing diagnostics for **${inputs.userUpn}**.`;
          resultDetails.push({
            title: 'Storage Consumption',
            facts: [
              { title: 'Used Space:', value: `${stats.sizeGb} GB` },
              { title: 'Maximum Allotted:', value: `${stats.maxSizeGb} GB` },
              { title: 'Percentage Consumed:', value: `${stats.percentUsed}%` }
            ]
          });
          break;
        }

        // UC043 - Convert User Mailbox to Shared Mailbox
        case 'UC043': {
          await ExchangeService.convertMailboxToShared(inputs.userUpn);
          summaryText = `Successfully converted personal user mailbox **${inputs.userUpn}** to shared mailbox.`;
          break;
        }

        // UC044 - Check OneDrive Storage
        case 'UC044': {
          const stats = await ExchangeService.getOneDriveStorage(inputs.userUpn);
          summaryText = `OneDrive storage diagnostics for user **${inputs.userUpn}**.`;
          resultDetails.push({
            title: 'OneDrive Storage Allocations',
            facts: [
              { title: 'Allotted Pool:', value: `${stats.totalGb} GB` },
              { title: 'Used Capacity:', value: `${stats.usedGb} GB` },
              { title: 'Remaining Available:', value: `${stats.remainingGb} GB` }
            ]
          });
          break;
        }

        // UC045 - Grant OneDrive Access
        case 'UC045': {
          const link = await ExchangeService.grantOneDriveAccess(inputs.userUpn, inputs.targetUserUpn);
          summaryText = `Granted OneDrive file access rights for user **${inputs.userUpn}** to delegate **${inputs.targetUserUpn}**.`;
          resultDetails.push({
            title: 'Access Details',
            facts: [{ title: 'Direct Access Link:', value: link }]
          });
          break;
        }

        // UC046 - Restore OneDrive Files
        case 'UC046': {
          const days = parseInt(inputs.daysAgo);
          const res = await ExchangeService.restoreOneDriveFiles(inputs.userUpn, days);
          summaryText = `Successfully completed OneDrive rollback for **${inputs.userUpn}**. Restored **${res.restoredCount}** files to state from ${days} days ago.`;
          break;
        }

        // UC047 - Generate Sharing Report
        case 'UC047': {
          const res = await ExchangeService.generateSharingReport(inputs.userUpn);
          summaryText = `OneDrive Sharing & Security Report for **${inputs.userUpn}**.`;
          resultDetails.push({
            title: 'Sharing Metrics',
            facts: [
              { title: 'Total Shared Links:', value: `${res.totalSharedLinks} links` },
              { title: 'External Organization Guest Access:', value: `${res.externalAccessCount} external users` }
            ]
          });
          break;
        }

        // UC048 - Create SharePoint Site
        case 'UC048': {
          const site = await ExchangeService.createSharePointSite(inputs.displayName, inputs.alias);
          summaryText = `Modern SharePoint Communication Site created successfully.`;
          resultDetails.push({
            title: 'SharePoint Site Properties',
            facts: [
              { title: 'Display Title:', value: site.displayName },
              { title: 'Site URL:', value: site.url },
              { title: 'Site ID:', value: site.id }
            ]
          });
          break;
        }

        // UC049 - Add User to SharePoint Site
        case 'UC049': {
          await ExchangeService.addUserToSharePointSite(inputs.siteSearch, inputs.userUpn, inputs.role);
          summaryText = `Successfully added user **${inputs.userUpn}** to SharePoint site **${inputs.siteSearch}** as role: **${inputs.role}**.`;
          break;
        }

        // UC050 - Check SharePoint Permissions
        case 'UC050': {
          const site = await ExchangeService.checkSharePointPermissions(inputs.siteSearch);
          summaryText = `Permissions directory listing for site **${site.displayName}**.`;
          resultDetails.push({
            title: 'Granted Users & Roles',
            facts: site.permissions.length > 0
              ? site.permissions.map(p => ({ title: `${p.role.toUpperCase()}:`, value: p.userUpn }))
              : [{ title: 'Permissions:', value: 'No custom permissions assigned' }]
          });
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
