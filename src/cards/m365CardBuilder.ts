import { Attachment, CardFactory } from 'botbuilder';

export interface AuditTrail {
  requestId: string;
  timestamp: string;
  initiatedBy: string;
  task: string;
  target: string;
  status: 'Success' | 'Failed';
  approvalRequired: 'Yes' | 'No';
}

export class M365CardBuilder {
  private static toAttachment(cardPayload: object): Attachment {
    return CardFactory.adaptiveCard(cardPayload);
  }

  /**
   * Generates a standard GUID for Request IDs
   */
  public static generateGuid(): string {
    return 'req-' + Math.random().toString(36).substring(2, 15) + '-' + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Main Menu Card listing categories of M365 use cases
   */
  public static m365MenuCard(): Attachment {
    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.5',
      body: [
        {
          type: 'Container',
          style: 'accent',
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: 'CIS Support Agent',
              weight: 'Bolder',
              size: 'Large'
            },
            {
              type: 'TextBlock',
              text: 'Level 1 Microsoft 365 Administrative Assistant',
              size: 'Small',
              isSubtle: true,
              spacing: 'None'
            }
          ]
        },
        {
          type: 'TextBlock',
          text: 'Select an administrative task category below to open the corresponding options form:',
          wrap: true,
          spacing: 'Medium'
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: '👤 User Lifecycle (UC001-UC012)',
          data: { action: 'm365_submenu', category: 'user_lifecycle' }
        },
        {
          type: 'Action.Submit',
          title: '💳 License Management (UC013-UC020)',
          data: { action: 'm365_submenu', category: 'licensing' }
        },
        {
          type: 'Action.Submit',
          title: '👥 Group Management (UC021-UC028)',
          data: { action: 'm365_submenu', category: 'groups' }
        },
        {
          type: 'Action.Submit',
          title: '📬 Mailbox & Exchange (UC029-UC043)',
          data: { action: 'm365_submenu', category: 'mailboxes' }
        },
        {
          type: 'Action.Submit',
          title: '📁 OneDrive & SharePoint (UC044-UC050)',
          data: { action: 'm365_submenu', category: 'collaboration' }
        }
      ]
    };
    return this.toAttachment(card);
  }

  /**
   * Submenu listing specific use cases
   */
  public static m365SubmenuCard(category: 'user_lifecycle' | 'licensing' | 'groups' | 'mailboxes' | 'collaboration'): Attachment {
    let title = '';
    const actions: any[] = [];

    if (category === 'user_lifecycle') {
      title = '👤 User Lifecycle Management';
      actions.push(
        { type: 'Action.Submit', title: 'UC001 - Create User', data: { action: 'm365_form', uc: 'UC001' } },
        { type: 'Action.Submit', title: 'UC002 - Update Display Name', data: { action: 'm365_form', uc: 'UC002' } },
        { type: 'Action.Submit', title: 'UC003 - Update Job Title', data: { action: 'm365_form', uc: 'UC003' } },
        { type: 'Action.Submit', title: 'UC004 - Update Department', data: { action: 'm365_form', uc: 'UC004' } },
        { type: 'Action.Submit', title: 'UC005 - Update Manager', data: { action: 'm365_form', uc: 'UC005' } },
        { type: 'Action.Submit', title: 'UC008 - Reset Password', data: { action: 'm365_form', uc: 'UC008' } },
        { type: 'Action.Submit', title: 'UC010 - Block Sign-in', data: { action: 'm365_form', uc: 'UC010' } },
        { type: 'Action.Submit', title: 'UC011 - Unblock Sign-in', data: { action: 'm365_form', uc: 'UC011' } },
        { type: 'Action.Submit', title: 'UC012 - Delete User', data: { action: 'm365_form', uc: 'UC012' } }
      );
    } else if (category === 'licensing') {
      title = '💳 License Management';
      actions.push(
        { type: 'Action.Submit', title: 'UC013 - Assign License', data: { action: 'm365_form', uc: 'UC013' } },
        { type: 'Action.Submit', title: 'UC014 - Remove License', data: { action: 'm365_form', uc: 'UC014' } },
        { type: 'Action.Submit', title: 'UC015 - Check User Licenses', data: { action: 'm365_form', uc: 'UC015' } },
        { type: 'Action.Submit', title: 'UC016 - Check Available Licenses', data: { action: 'm365_run_direct', uc: 'UC016' } },
        { type: 'Action.Submit', title: 'UC020 - Find Unlicensed Users', data: { action: 'm365_run_direct', uc: 'UC020' } }
      );
    } else if (category === 'groups') {
      title = '👥 Group Management';
      actions.push(
        { type: 'Action.Submit', title: 'UC021 - Create Security Group', data: { action: 'm365_form', uc: 'UC021' } },
        { type: 'Action.Submit', title: 'UC022 - Create M365 Group', data: { action: 'm365_form', uc: 'UC022' } },
        { type: 'Action.Submit', title: 'UC023 - Add Group Member', data: { action: 'm365_form', uc: 'UC023' } },
        { type: 'Action.Submit', title: 'UC024 - Remove Group Member', data: { action: 'm365_form', uc: 'UC024' } },
        { type: 'Action.Submit', title: 'UC025 - View Group Members', data: { action: 'm365_form', uc: 'UC025' } },
        { type: 'Action.Submit', title: 'UC026 - Update Group Owner', data: { action: 'm365_form', uc: 'UC026' } },
        { type: 'Action.Submit', title: 'UC027 - Hide Group from GAL', data: { action: 'm365_form', uc: 'UC027' } },
        { type: 'Action.Submit', title: 'UC028 - Rename Group', data: { action: 'm365_form', uc: 'UC028' } }
      );
    } else if (category === 'mailboxes') {
      title = '📬 Mailbox & Exchange Online';
      actions.push(
        { type: 'Action.Submit', title: 'UC029 - Create Shared Mailbox', data: { action: 'm365_form', uc: 'UC029' } },
        { type: 'Action.Submit', title: 'UC030 - Delete Shared Mailbox', data: { action: 'm365_form', uc: 'UC030' } },
        { type: 'Action.Submit', title: 'UC031 - Add Mailbox Delegate', data: { action: 'm365_form', uc: 'UC031' } },
        { type: 'Action.Submit', title: 'UC032 - Remove Mailbox Delegate', data: { action: 'm365_form', uc: 'UC032' } },
        { type: 'Action.Submit', title: 'UC036 - Check Mailbox Permissions', data: { action: 'm365_form', uc: 'UC036' } },
        { type: 'Action.Submit', title: 'UC037 - Enable Mail Forwarding', data: { action: 'm365_form', uc: 'UC037' } },
        { type: 'Action.Submit', title: 'UC038 - Disable Mail Forwarding', data: { action: 'm365_form', uc: 'UC038' } },
        { type: 'Action.Submit', title: 'UC039 - Set Automatic Reply', data: { action: 'm365_form', uc: 'UC039' } },
        { type: 'Action.Submit', title: 'UC040 - Disable Automatic Reply', data: { action: 'm365_form', uc: 'UC040' } },
        { type: 'Action.Submit', title: 'UC041 - Increase Mailbox Quota', data: { action: 'm365_form', uc: 'UC041' } },
        { type: 'Action.Submit', title: 'UC042 - Check Mailbox Size', data: { action: 'm365_form', uc: 'UC042' } },
        { type: 'Action.Submit', title: 'UC043 - Convert User Mailbox to Shared', data: { action: 'm365_form', uc: 'UC043' } }
      );
    } else {
      title = '📁 OneDrive & SharePoint Portal';
      actions.push(
        { type: 'Action.Submit', title: 'UC044 - Check OneDrive Storage', data: { action: 'm365_form', uc: 'UC044' } },
        { type: 'Action.Submit', title: 'UC045 - Grant OneDrive Access', data: { action: 'm365_form', uc: 'UC045' } },
        { type: 'Action.Submit', title: 'UC046 - Restore OneDrive Files', data: { action: 'm365_form', uc: 'UC046' } },
        { type: 'Action.Submit', title: 'UC047 - Generate Sharing Report', data: { action: 'm365_form', uc: 'UC047' } },
        { type: 'Action.Submit', title: 'UC048 - Create SharePoint Site', data: { action: 'm365_form', uc: 'UC048' } },
        { type: 'Action.Submit', title: 'UC049 - Add User to SharePoint Site', data: { action: 'm365_form', uc: 'UC049' } },
        { type: 'Action.Submit', title: 'UC050 - Check SharePoint Permissions', data: { action: 'm365_form', uc: 'UC050' } }
      );
    }

    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.5',
      body: [
        {
          type: 'TextBlock',
          text: title,
          weight: 'Bolder',
          size: 'Medium',
          color: 'Accent'
        },
        {
          type: 'TextBlock',
          text: 'Select a use case execution form:',
          isSubtle: true,
          spacing: 'Small'
        }
      ],
      actions: [
        ...actions,
        {
          type: 'Action.Submit',
          title: '🏡 Back to Categories',
          data: { action: 'm365_menu' }
        }
      ]
    };

    return this.toAttachment(card);
  }

  /**
   * Generates input forms for all use cases (UC001 - UC050)
   */
  public static useCaseInputForm(ucCode: string): Attachment {
    return {
      contentType: 'application/vnd.microsoft.card.adaptive',
      content: {
        type: 'AdaptiveCard',
        version: '1.4',
        body: [
          { type: 'TextBlock', text: `Please provide details for ${ucCode}`, weight: 'bolder', size: 'medium' },
          { type: 'Input.Text', id: 'userUpn', placeholder: 'Target User UPN' }
        ],
        actions: [
          {
            type: 'Action.Submit',
            title: 'Submit',
            data: { action: 'm365_run_direct', uc: ucCode }
          }
        ]
      }
    };
  }

  public static useCaseConfirmationCard(
    ucCode: string,
    inputs: any,
    targetDesc: string
  ): Attachment {
    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.5',
      body: [
        {
          type: 'Container',
          style: 'attention',
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: '⚠️ Risky Action Approval Required',
              weight: 'Bolder',
              size: 'Medium'
            }
          ]
        },
        {
          type: 'TextBlock',
          text: `You have requested to perform a critical use-case: **${ucCode}**.`,
          wrap: true,
          spacing: 'Medium'
        },
        {
          type: 'TextBlock',
          text: `Target: **${targetDesc}**`,
          weight: 'Bolder',
          color: 'Attention',
          wrap: true
        },
        {
          type: 'TextBlock',
          text: 'This action may be disruptive or result in permanent deletion of tenant data. Please confirm that you want to proceed.',
          wrap: true,
          isSubtle: true,
          spacing: 'Medium'
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: 'Confirm & Execute',
          data: {
            action: 'm365_execute_confirmed',
            uc: ucCode,
            ...inputs
          }
        },
        {
          type: 'Action.Submit',
          title: 'Cancel Request',
          data: {
            action: 'm365_menu'
          }
        }
      ]
    };

    return this.toAttachment(card);
  }

  /**
   * Success result card with the audit trail (FactSet) and Action buttons
   */
  public static useCaseResultCard(
    ucCode: string,
    summaryText: string,
    audit: AuditTrail,
    resultDetails?: { title: string; facts: { title: string; value: string }[] }[],
    rollbackAction?: object
  ): Attachment {
    const cardBody: any[] = [
      {
        type: 'Container',
        style: 'good',
        bleed: true,
        items: [
          {
            type: 'TextBlock',
            text: `✅ Task Completed Successfully`,
            weight: 'Bolder',
            size: 'Medium'
          }
        ]
      },
      {
        type: 'TextBlock',
        text: summaryText,
        wrap: true,
        spacing: 'Medium'
      }
    ];

    // Add result details (e.g. created user credentials or licenses)
    if (resultDetails) {
      for (const section of resultDetails) {
        cardBody.push({
          type: 'TextBlock',
          text: section.title,
          weight: 'Bolder',
          spacing: 'Medium'
        });
        cardBody.push({
          type: 'FactSet',
          facts: section.facts,
          spacing: 'Small'
        });
      }
    }

    // Add Audit Trail Section
    cardBody.push(
      {
        type: 'TextBlock',
        text: '📋 Audit Log Trail',
        weight: 'Bolder',
        spacing: 'Medium',
        separator: true
      },
      {
        type: 'FactSet',
        facts: [
          { title: 'Request ID:', value: audit.requestId },
          { title: 'Timestamp (UTC):', value: audit.timestamp },
          { title: 'Requested By:', value: audit.initiatedBy },
          { title: 'Action:', value: audit.task },
          { title: 'Target:', value: audit.target },
          { title: 'Status:', value: audit.status },
          { title: 'Approval Required:', value: audit.approvalRequired }
        ],
        spacing: 'Small'
      }
    );

    const actions: any[] = [];

    // Add Rollback button if applicable
    if (rollbackAction) {
      actions.push({
        type: 'Action.Submit',
        title: '↩️ Rollback Operation',
        data: rollbackAction
      });
    }

    actions.push(
      {
        type: 'Action.Submit',
        title: 'Escalate to L2 Support',
        data: {
          action: 'show_escalation_form',
          details: `L2 Escalation: Use Case ${ucCode} failed verification or requires L2 review. Request ID: ${audit.requestId}`
        }
      },
      {
        type: 'Action.Submit',
        title: '🏡 Back to Menu',
        data: { action: 'm365_menu' }
      }
    );

    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.5',
      body: cardBody,
      actions: actions
    };

    return this.toAttachment(card);
  }

  /**
   * Error card returned for failed executions
   */
  public static useCaseErrorCard(
    ucCode: string,
    errorCode: string,
    reason: string,
    suggestedFix: string,
    retryData?: object
  ): Attachment {
    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.5',
      body: [
        {
          type: 'Container',
          style: 'attention',
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: '❌ Administrative Task Failed',
              weight: 'Bolder',
              size: 'Medium'
            }
          ]
        },
        {
          type: 'FactSet',
          spacing: 'Medium',
          facts: [
            { title: 'Task Code:', value: ucCode },
            { title: 'Error Code:', value: errorCode },
            { title: 'Reason:', value: reason },
            { title: 'Suggested Fix:', value: suggestedFix }
          ]
        }
      ],
      actions: [
        ...(retryData ? [{
          type: 'Action.Submit',
          title: '🔄 Retry Operation',
          data: retryData
        }] : []),
        {
          type: 'Action.Submit',
          title: 'Escalate to L2',
          data: {
            action: 'show_escalation_form',
            details: `L2 Escalation: M365 Task ${ucCode} failed. Code: ${errorCode}. Reason: ${reason}.`
          }
        },
        {
          type: 'Action.Submit',
          title: '🏡 Main Menu',
          data: { action: 'm365_menu' }
        }
      ]
    };

    return this.toAttachment(card);
  }

  /**
   * Translates a usecase code into its human-readable title
   */
  public static getUseCaseName(ucCode: string): string {
    return `Use Case ${ucCode}`;
  }

  public static reviewAndConfirmCard(ucCode: string, parameters: any): Attachment {
    const ucName = this.getUseCaseName(ucCode);
    const facts = Object.entries(parameters).map(([key, val]) => ({
      title: key.charAt(0).toUpperCase() + key.slice(1) + ':',
      value: String(val)
    }));

    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.5',
      body: [
        {
          type: 'Container',
          style: 'accent',
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: '📋 Review & Confirm',
              weight: 'Bolder',
              size: 'Large'
            },
            {
              type: 'TextBlock',
              text: `Please review the details for **${ucName}** (${ucCode}) below.`,
              size: 'Small',
              isSubtle: true,
              spacing: 'None'
            }
          ]
        },
        {
          type: 'TextBlock',
          text: 'Request Details:',
          weight: 'Bolder',
          spacing: 'Medium'
        },
        {
          type: 'FactSet',
          facts: facts,
          spacing: 'Small'
        },
        {
          type: 'TextBlock',
          text: 'Confirming will initiate execution (or request manager approval if required).',
          wrap: true,
          isSubtle: true,
          size: 'Small',
          spacing: 'Medium'
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: 'Confirm & Proceed',
          data: {
            action: 'm365_confirm_request',
            uc: ucCode,
            ...parameters
          }
        },
        {
          type: 'Action.Submit',
          title: 'Cancel',
          data: {
            action: 'm365_menu'
          }
        }
      ]
    };

    return this.toAttachment(card);
  }

  /**
   * Generates the manager approval request card
   */
  public static managerApprovalRequestCard(
    requestorUpn: string,
    ucCode: string,
    parameters: any,
    requestId: string
  ): Attachment {
    const ucName = this.getUseCaseName(ucCode);
    const facts = Object.entries(parameters).map(([key, val]) => ({
      title: key.charAt(0).toUpperCase() + key.slice(1) + ':',
      value: String(val)
    }));

    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.5',
      body: [
        {
          type: 'Container',
          style: 'warning',
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: '🔐 Manager Approval Request',
              weight: 'Bolder',
              size: 'Medium'
            }
          ]
        },
        {
          type: 'TextBlock',
          text: `**${requestorUpn}** has submitted a request requiring your authorization.`,
          wrap: true,
          spacing: 'Medium'
        },
        {
          type: 'FactSet',
          facts: [
            { title: 'Requested Action:', value: `${ucName} (${ucCode})` },
            ...facts
          ],
          spacing: 'Medium'
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: 'Approve Request',
          data: {
            action: 'm365_manager_decision',
            decision: 'approve',
            requestId: requestId
          }
        },
        {
          type: 'Action.Submit',
          title: 'Reject Request',
          data: {
            action: 'm365_manager_decision',
            decision: 'reject',
            requestId: requestId
          }
        }
      ]
    };

    return this.toAttachment(card);
  }

  /**
   * Updates the manager's card when they approve/reject the request
   */
  public static approvalOutcomeCard(
    status: 'Approved' | 'Rejected',
    requestorUpn: string,
    ucCode: string,
    parameters: any
  ): Attachment {
    const ucName = this.getUseCaseName(ucCode);
    const facts = Object.entries(parameters).map(([key, val]) => ({
      title: key.charAt(0).toUpperCase() + key.slice(1) + ':',
      value: String(val)
    }));

    const style = status === 'Approved' ? 'good' : 'attention';
    const bannerText = status === 'Approved' ? '✅ Request Approved' : '❌ Request Rejected';

    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.5',
      body: [
        {
          type: 'Container',
          style: style,
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: bannerText,
              weight: 'Bolder',
              size: 'Medium'
            }
          ]
        },
        {
          type: 'TextBlock',
          text: `This request from **${requestorUpn}** has been **${status.toLowerCase()}** and processed.`,
          wrap: true,
          spacing: 'Medium'
        },
        {
          type: 'FactSet',
          facts: [
            { title: 'Action:', value: `${ucName} (${ucCode})` },
            ...facts
          ],
          spacing: 'Medium'
        }
      ]
    };

    return this.toAttachment(card);
  }
}
