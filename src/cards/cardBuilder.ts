import { Attachment, CardFactory } from 'botbuilder';
import { SettingsService } from '../services/settingsService';

export class CardBuilder {
  /**
   * Helper to wrap an Adaptive Card JSON into a Bot Framework Attachment
   */
  private static toAttachment(cardPayload: object): Attachment {
    return CardFactory.adaptiveCard(cardPayload);
  }

  /**
   * Welcome Card - shown when user starts conversation or requests it.
   */
  public static welcomeCard(userName: string): Attachment {
    const settings = SettingsService.getSettings();
    const brandName = settings.brandName || 'CIS360 Support';

    const headerItems: any[] = [];
    if (settings.logoUrl) {
      headerItems.push({
        type: 'Image',
        url: settings.logoUrl,
        size: 'Medium',
        horizontalAlignment: 'Center'
      });
    }

    headerItems.push({
      type: 'TextBlock',
      text: brandName,
      weight: 'Bolder',
      size: 'Large',
      horizontalAlignment: 'Center',
      color: 'Default'
    });

    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'Container',
          style: 'default',
          items: headerItems
        },
        {
          type: 'TextBlock',
          text: `Hello **${userName}**! Welcome to the ${brandName} Portal. I am your virtual assistant. How can I help you today?`,
          wrap: true,
          spacing: 'Medium'
        },
        {
          type: 'TextBlock',
          text: 'What would you like to do?',
          weight: 'Bolder',
          spacing: 'Medium'
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: '📝 Create ServiceNow Ticket',
          data: {
            action: 'show_ticket_form'
          }
        },
        {
          type: 'Action.Submit',
          title: '👥 Talk to Human Agent',
          data: {
            action: 'show_escalation_form'
          }
        },
        {
          type: 'Action.Submit',
          title: '❓ View FAQ & Help',
          data: {
            action: 'show_help'
          }
        }
      ]
    };
    return this.toAttachment(card);
  }

  /**
   * Generic text response card to ensure ALL replies are in Adaptive Cards
   */
  public static textResponseCard(title: string, text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): Attachment {
    let style = 'default';
    let icon = 'ℹ️';
    if (type === 'success') {
      style = 'good';
      icon = '✅';
    } else if (type === 'warning') {
      style = 'warning';
      icon = '⚠️';
    } else if (type === 'error') {
      style = 'attention';
      icon = '❌';
    }

    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'Container',
          style: style,
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: `${icon} ${title}`,
              weight: 'Bolder',
              size: 'Medium'
            }
          ]
        },
        {
          type: 'TextBlock',
          text: text,
          wrap: true,
          spacing: 'Medium'
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: '🏡 Back to Menu',
          data: {
            action: 'show_welcome'
          }
        }
      ]
    };
    return this.toAttachment(card);
  }

  /**
   * Help Menu & FAQ Card
   */
  public static helpCard(): Attachment {
    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'TextBlock',
          text: '💡 CIS360 Help Center',
          weight: 'Bolder',
          size: 'Large',
          color: 'Accent'
        },
        {
          type: 'TextBlock',
          text: 'Here are some quick guides and commands you can use:',
          wrap: true,
          isSubtle: true
        },
        {
          type: 'FactSet',
          spacing: 'Medium',
          facts: [
            { title: 'Create Ticket', value: 'Opens the ServiceNow incident creation form.' },
            { title: 'Talk to Human', value: 'Escalates your query directly to our support queue.' },
            { title: 'Cancel Session', value: 'Ends the live support agent conversation.' },
            { title: 'Help / Menu', value: 'Brings up this helper panel.' }
          ]
        },
        {
          type: 'TextBlock',
          text: 'Frequently Asked Questions:',
          weight: 'Bolder',
          spacing: 'Medium'
        },
        {
          type: 'TextBlock',
          text: '• **How do I track my ticket?**\nOnce a ServiceNow ticket is created, you will receive a direct link to view status updates.\n• **When are agents available?**\nHuman support agents are available Mon-Fri 8 AM - 6 PM.',
          wrap: true
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: '📝 Create ServiceNow Ticket',
          data: {
            action: 'show_ticket_form'
          }
        },
        {
          type: 'Action.Submit',
          title: '👥 Talk to Human Agent',
          data: {
            action: 'show_escalation_form'
          }
        }
      ]
    };
    return this.toAttachment(card);
  }

  /**
   * ServiceNow ticket form card
   */
  public static ticketFormCard(): Attachment {
    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'Container',
          style: 'accent',
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: '📝 Create ServiceNow Ticket',
              weight: 'Bolder',
              size: 'Medium'
            }
          ]
        },
        {
          type: 'TextBlock',
          text: 'Please fill out the details below to log a new incident in ServiceNow.',
          wrap: true,
          isSubtle: true,
          spacing: 'Small'
        },
        {
          type: 'Input.Text',
          id: 'shortDescription',
          label: 'Summary / Title',
          placeholder: 'Brief summary of the issue (e.g. Email access blocked)',
          isRequired: true,
          errorMessage: 'Summary is required',
          spacing: 'Medium'
        },
        {
          type: 'Input.Text',
          id: 'description',
          label: 'Details',
          placeholder: 'Provide full description, steps to reproduce, or error messages',
          isMultiline: true,
          isRequired: true,
          errorMessage: 'Details are required',
          spacing: 'Medium'
        },
        {
          type: 'Input.ChoiceSet',
          id: 'severity',
          label: 'Severity Level',
          value: 'Medium',
          style: 'expanded',
          choices: [
            { title: '🟢 Low (Minor disruption)', value: 'Low' },
            { title: '🟡 Medium (Business affected)', value: 'Medium' },
            { title: '🔴 High (Critical issue)', value: 'High' }
          ],
          spacing: 'Medium'
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: 'Create Ticket',
          data: {
            action: 'submit_ticket'
          }
        },
        {
          type: 'Action.Submit',
          title: 'Cancel',
          data: {
            action: 'show_welcome'
          }
        }
      ]
    };
    return this.toAttachment(card);
  }

  /**
   * Ticket creation outcome card
   */
  public static ticketResultCard(
    number: string,
    sysId: string | undefined,
    shortDesc: string,
    state: string,
    instanceUrl: string,
    isMock: boolean
  ): Attachment {
    // Generate incident URL
    let ticketUrl = '#';
    if (!isMock && instanceUrl && sysId) {
      const cleanUrl = instanceUrl.replace(/\/$/, '');
      ticketUrl = `${cleanUrl}/nav_to.do?uri=incident.do?sys_id=${sysId}`;
    }

    const card: any = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'Container',
          style: 'good',
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: '✅ ServiceNow Ticket Created',
              weight: 'Bolder',
              size: 'Medium'
            }
          ]
        },
        {
          type: 'TextBlock',
          text: `Your support incident has been logged in ServiceNow.`,
          wrap: true,
          spacing: 'Medium'
        },
        {
          type: 'FactSet',
          spacing: 'Medium',
          facts: [
            { title: 'Ticket Number:', value: number },
            { title: 'Summary:', value: shortDesc },
            { title: 'State:', value: state },
            { title: 'Environment:', value: isMock ? 'Simulation (Mock)' : 'Production ServiceNow' }
          ]
        }
      ],
      actions: []
    };

    if (!isMock && sysId) {
      card.actions.push({
        type: 'Action.OpenUrl',
        title: '🌐 View in ServiceNow',
        url: ticketUrl
      });
    }

    card.actions.push(
      {
        type: 'Action.Submit',
        title: '👥 Escalate to Live Agent',
        data: {
          action: 'show_escalation_form',
          details: `ServiceNow Ticket: ${number} - ${shortDesc}`
        }
      },
      {
        type: 'Action.Submit',
        title: '🏡 Home',
        data: {
          action: 'show_welcome'
        }
      }
    );

    return this.toAttachment(card);
  }

  /**
   * Form to gather details before Escalating to a human
   */
  public static escalationFormCard(prefilledDetails: string = ''): Attachment {
    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'Container',
          style: 'warning',
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: '👥 Connect to Human Support',
              weight: 'Bolder',
              size: 'Medium'
            }
          ]
        },
        {
          type: 'TextBlock',
          text: 'Please describe the issue you want to escalate to the support agent.',
          wrap: true,
          isSubtle: true,
          spacing: 'Small'
        },
        {
          type: 'Input.Text',
          id: 'escalationDetails',
          label: 'Issue Details / Reason for Escalation',
          value: prefilledDetails,
          placeholder: 'Describe what you need help with...',
          isMultiline: true,
          isRequired: true,
          errorMessage: 'Details are required to routing to an agent',
          spacing: 'Medium'
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: 'Request Support Agent',
          data: {
            action: 'submit_escalation'
          }
        },
        {
          type: 'Action.Submit',
          title: 'Cancel',
          data: {
            action: 'show_welcome'
          }
        }
      ]
    };
    return this.toAttachment(card);
  }

  /**
   * User side handoff status cards
   */
  public static handoffStatusCard(status: 'waiting' | 'active' | 'ended', agentName?: string): Attachment {
    let title = 'Handoff Status';
    let text = '';
    let style = 'default';
    const actions: any[] = [];

    if (status === 'waiting') {
      title = '⏳ Seeking Support Agent';
      text = 'Your conversation is being escalated. We are waiting for an available agent to claim the session. Please hold...';
      style = 'warning';
    } else if (status === 'active') {
      title = '👥 Connected to Live Support';
      text = `Support Agent **${agentName || 'Agent'}** has joined the session. All messages you type now will go directly to the agent.`;
      style = 'good';
      actions.push({
        type: 'Action.Submit',
        title: '🚪 End Session / Disconnect',
        data: {
          action: 'end_handoff_session'
        }
      });
    } else {
      title = '⏹️ Support Session Ended';
      text = 'The live agent chat session has closed. You have been returned to the automated CIS360 bot. How else can I help?';
      style = 'accent';
      actions.push({
        type: 'Action.Submit',
        title: '🏡 Main Menu',
        data: {
          action: 'show_welcome'
        }
      });
    }

    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'Container',
          style: style,
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: title,
              weight: 'Bolder',
              size: 'Medium'
            }
          ]
        },
        {
          type: 'TextBlock',
          text: text,
          wrap: true,
          spacing: 'Medium'
        }
      ],
      actions: actions
    };
    return this.toAttachment(card);
  }

  /**
   * Escalation card posted to the human Agent Support Channel
   */
  public static agentChannelHandoffCard(
    userName: string,
    userId: string,
    details: string
  ): Attachment {
    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'Container',
          style: 'warning',
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: '🚨 New Escalation Request',
              weight: 'Bolder',
              size: 'Medium'
            }
          ]
        },
        {
          type: 'TextBlock',
          text: 'A user is requesting live support assistance.',
          wrap: true,
          isSubtle: true,
          spacing: 'Small'
        },
        {
          type: 'FactSet',
          spacing: 'Medium',
          facts: [
            { title: 'User:', value: userName },
            { title: 'User ID:', value: userId },
            { title: 'Issue/Context:', value: details }
          ]
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: '🙋 Claim Chat Session',
          data: {
            action: 'agent_claim_handoff',
            userId: userId
          }
        }
      ]
    };
    return this.toAttachment(card);
  }

  /**
   * Card for the agent to display inside the claimed session thread to manage it
   */
  public static agentChatConsoleCard(userName: string, userId: string): Attachment {
    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'Container',
          style: 'good',
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: '✅ Session Claimed Successfully',
              weight: 'Bolder',
              size: 'Medium'
            }
          ]
        },
        {
          type: 'TextBlock',
          text: `You are now in a live session with **${userName}**. Any message you reply in this thread will be sent to the user.`,
          wrap: true,
          spacing: 'Medium'
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: '🏁 End Chat Session',
          data: {
            action: 'agent_end_handoff',
            userId: userId
          }
        }
      ]
    };
    return this.toAttachment(card);
  }
}
