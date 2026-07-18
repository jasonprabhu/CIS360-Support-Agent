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
          text: 'The visual form menu has been deprecated. CIS Support Agent is now entirely conversational!',
          weight: 'Bolder',
          wrap: true,
          spacing: 'Medium'
        },
        {
          type: 'TextBlock',
          text: 'Simply tell me what you need in natural language. For example:\n- "Reset my password"\n- "Unlock my account"\n- "Show me my sign-in history"\n- "Check my MFA status"',
          wrap: true,
          spacing: 'Medium'
        }
      ]
    };
    return this.toAttachment(card);
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

  // ==========================================
  // EXCHANGE ONLINE CARDS
  // ==========================================

  public static mailboxSizeCard(upn: string, sizeGb: number, maxSizeGb: number, percentUsed: number): Attachment {
    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.5',
      body: [
        {
          type: 'Container',
          style: percentUsed > 90 ? 'attention' : 'good',
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: '📊 Mailbox Storage Report',
              weight: 'Bolder',
              size: 'Medium'
            }
          ]
        },
        {
          type: 'FactSet',
          facts: [
            { title: 'User:', value: upn },
            { title: 'Used Space:', value: `${sizeGb.toFixed(2)} GB` },
            { title: 'Quota limit:', value: `${maxSizeGb.toFixed(2)} GB` },
            { title: 'Utilization:', value: `${Math.round(percentUsed)}%` }
          ]
        }
      ]
    };
    return this.toAttachment(card);
  }

  public static autoReplyStatusCard(upn: string, isEnabled: boolean, message: string): Attachment {
    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.5',
      body: [
        {
          type: 'Container',
          style: isEnabled ? 'warning' : 'good',
          bleed: true,
          items: [
            {
              type: 'TextBlock',
              text: '🏖️ Out of Office (OOF) Status',
              weight: 'Bolder',
              size: 'Medium'
            }
          ]
        },
        {
          type: 'FactSet',
          facts: [
            { title: 'User:', value: upn },
            { title: 'Status:', value: isEnabled ? 'Active' : 'Disabled' }
          ]
        },
        ...(isEnabled && message ? [{
          type: 'TextBlock',
          text: '**Message:**\n\n' + message,
          wrap: true,
          spacing: 'Medium'
        }] : [])
      ]
    };
    return this.toAttachment(card);
  }

  public static freeBusyStatusCard(upn: string, sharingEnabled: boolean, defaultPermission: string): Attachment {
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
              text: '📅 Calendar Free/Busy Settings',
              weight: 'Bolder',
              size: 'Medium'
            }
          ]
        },
        {
          type: 'FactSet',
          facts: [
            { title: 'User:', value: upn },
            { title: 'Sharing Enabled:', value: sharingEnabled ? 'Yes' : 'No' },
            { title: 'Default Permission:', value: defaultPermission }
          ]
        }
      ]
    };
    return this.toAttachment(card);
  }
}
