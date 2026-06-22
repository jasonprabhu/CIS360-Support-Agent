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
    let ucName = '';
    const inputs: any[] = [];
    const actions: any[] = [];

    // Helper builders
    const addUpnInput = (label = 'User Principal Name (UPN)', id = 'userUpn') => {
      inputs.push({
        type: 'Input.Text',
        id: id,
        label: label,
        placeholder: 'e.g. adele.vance@tenant.onmicrosoft.com',
        isRequired: true,
        errorMessage: 'Valid UPN is required'
      });
    };

    switch (ucCode) {
      case 'UC001':
        ucName = 'Create M365 User';
        inputs.push(
          { type: 'Input.Text', id: 'firstName', label: 'First Name', placeholder: 'Given name', isRequired: true, errorMessage: 'First Name is required' },
          { type: 'Input.Text', id: 'lastName', label: 'Last Name', placeholder: 'Surname', isRequired: true, errorMessage: 'Last Name is required' },
          { type: 'Input.Text', id: 'userUpn', label: 'UPN Address', placeholder: 'user@tenant.onmicrosoft.com', isRequired: true, errorMessage: 'UPN is required' },
          { type: 'Input.Text', id: 'department', label: 'Department', placeholder: 'e.g. Sales, Marketing', isRequired: false },
          { type: 'Input.Text', id: 'jobTitle', label: 'Job Title', placeholder: 'e.g. Analyst', isRequired: false },
          {
            type: 'Input.ChoiceSet',
            id: 'licenseType',
            label: 'License Assignment Sku',
            value: 'SPE_E5',
            style: 'compact',
            choices: [
              { title: 'Microsoft 365 E5 (Developer)', value: 'SPE_E5' },
              { title: 'Microsoft 365 E3', value: 'SPE_E3' },
              { title: 'Enterprise Mobility + Security E5', value: 'EMSPREMIUM' },
              { title: 'None (Unlicensed Account)', value: '' }
            ]
          }
        );
        break;

      case 'UC002':
        ucName = 'Update Display Name';
        addUpnInput();
        inputs.push({
          type: 'Input.Text',
          id: 'displayName',
          label: 'New Display Name',
          placeholder: 'e.g. Adele R. Vance',
          isRequired: true,
          errorMessage: 'Display name is required'
        });
        break;

      case 'UC003':
        ucName = 'Update Job Title';
        addUpnInput();
        inputs.push({
          type: 'Input.Text',
          id: 'jobTitle',
          label: 'New Job Title',
          placeholder: 'e.g. Senior Cloud Architect',
          isRequired: true,
          errorMessage: 'Job Title is required'
        });
        break;

      case 'UC004':
        ucName = 'Update Department';
        addUpnInput();
        inputs.push({
          type: 'Input.Text',
          id: 'department',
          label: 'New Department',
          placeholder: 'e.g. Cloud Security Team',
          isRequired: true,
          errorMessage: 'Department is required'
        });
        break;

      case 'UC005':
        ucName = 'Update Manager';
        addUpnInput();
        addUpnInput('Manager UPN', 'managerUpn');
        break;

      case 'UC008':
        ucName = 'Reset Password';
        addUpnInput();
        inputs.push({
          type: 'Input.ChoiceSet',
          id: 'forceChange',
          label: 'Require Password Change on Next Sign-in',
          value: 'true',
          style: 'expanded',
          choices: [
            { title: 'Yes (Highly Recommended)', value: 'true' },
            { title: 'No', value: 'false' }
          ]
        });
        break;

      case 'UC010':
        ucName = 'Block User Sign-in';
        addUpnInput();
        break;

      case 'UC011':
        ucName = 'Unblock User Sign-in';
        addUpnInput();
        break;

      case 'UC012':
        ucName = 'Delete M365 User Account';
        addUpnInput();
        break;

      case 'UC013':
        ucName = 'Assign License SKU';
        addUpnInput();
        inputs.push({
          type: 'Input.ChoiceSet',
          id: 'skuId',
          label: 'License SKU',
          value: 'sku-e5',
          choices: [
            { title: 'Microsoft 365 E5 (SPE_E5)', value: 'sku-e5' },
            { title: 'Microsoft 365 E3 (SPE_E3)', value: 'sku-e3' },
            { title: 'Enterprise Mobility + Security E5', value: 'sku-ems5' }
          ]
        });
        break;

      case 'UC014':
        ucName = 'Remove License SKU';
        addUpnInput();
        inputs.push({
          type: 'Input.ChoiceSet',
          id: 'skuId',
          label: 'License SKU to Remove',
          value: 'sku-e5',
          choices: [
            { title: 'Microsoft 365 E5 (SPE_E5)', value: 'sku-e5' },
            { title: 'Microsoft 365 E3 (SPE_E3)', value: 'sku-e3' },
            { title: 'Enterprise Mobility + Security E5', value: 'sku-ems5' }
          ]
        });
        break;

      case 'UC015':
        ucName = 'Check User Assigned Licenses';
        addUpnInput();
        break;

      case 'UC021':
        ucName = 'Create Security Group';
        inputs.push(
          { type: 'Input.Text', id: 'displayName', label: 'Group Name', placeholder: 'e.g. Sales Executives', isRequired: true, errorMessage: 'Group name required' },
          { type: 'Input.Text', id: 'description', label: 'Group Description', placeholder: 'Details of group membership', isMultiline: true }
        );
        break;

      case 'UC022':
        ucName = 'Create Microsoft 365 Group';
        inputs.push(
          { type: 'Input.Text', id: 'displayName', label: 'M365 Group Name', placeholder: 'e.g. Global Project Team', isRequired: true, errorMessage: 'Group name required' },
          { type: 'Input.Text', id: 'description', label: 'Group Description', placeholder: 'Unified mailbox and team description', isMultiline: true }
        );
        break;

      case 'UC023':
        ucName = 'Add Member to Group';
        inputs.push({ type: 'Input.Text', id: 'groupSearch', label: 'Group Name or ID', placeholder: 'e.g. IT Admins Security Group', isRequired: true, errorMessage: 'Group reference required' });
        addUpnInput('User UPN to Add');
        break;

      case 'UC024':
        ucName = 'Remove Member from Group';
        inputs.push({ type: 'Input.Text', id: 'groupSearch', label: 'Group Name or ID', placeholder: 'e.g. IT Admins Security Group', isRequired: true, errorMessage: 'Group reference required' });
        addUpnInput('User UPN to Remove');
        break;

      case 'UC025':
        ucName = 'View Group Members';
        inputs.push({ type: 'Input.Text', id: 'groupSearch', label: 'Group Name or ID', placeholder: 'e.g. CIS360 Support M365 Group', isRequired: true });
        break;

      case 'UC026':
        ucName = 'Update Group Owner';
        inputs.push({ type: 'Input.Text', id: 'groupSearch', label: 'Group Name or ID', placeholder: 'e.g. Global Project Team', isRequired: true });
        addUpnInput('New Owner UPN');
        break;

      case 'UC027':
        ucName = 'Hide Group from Global Address List (GAL)';
        inputs.push({ type: 'Input.Text', id: 'groupSearch', label: 'Group Name or ID', placeholder: 'e.g. Global Project Team', isRequired: true });
        inputs.push({
          type: 'Input.ChoiceSet',
          id: 'hide',
          label: 'GAL Visibility Status',
          value: 'true',
          style: 'expanded',
          choices: [
            { title: 'Hide from GAL (Disable Listing)', value: 'true' },
            { title: 'Show in GAL (Enable Listing)', value: 'false' }
          ]
        });
        break;

      case 'UC028':
        ucName = 'Rename Group';
        inputs.push(
          { type: 'Input.Text', id: 'groupSearch', label: 'Current Group Name or ID', placeholder: 'e.g. Projects Team', isRequired: true },
          { type: 'Input.Text', id: 'newName', label: 'New Group Name', placeholder: 'e.g. Global Projects Group', isRequired: true }
        );
        break;

      case 'UC029':
        ucName = 'Create Shared Mailbox';
        inputs.push(
          { type: 'Input.Text', id: 'displayName', label: 'Mailbox Display Name', placeholder: 'e.g. Info Mailbox', isRequired: true },
          { type: 'Input.Text', id: 'userUpn', label: 'Mailbox Email Address', placeholder: 'info@tenant.onmicrosoft.com', isRequired: true }
        );
        break;

      case 'UC030':
        ucName = 'Delete Shared Mailbox';
        addUpnInput('Shared Mailbox UPN');
        break;

      case 'UC031':
        ucName = 'Add Mailbox Delegate Permission';
        addUpnInput('Mailbox UPN', 'mailboxUpn');
        addUpnInput('Delegate User UPN', 'delegateUpn');
        inputs.push({
          type: 'Input.ChoiceSet',
          id: 'permission',
          label: 'Access Rights Permission Type',
          value: 'FullAccess',
          choices: [
            { title: 'Full Access (Read and Manage)', value: 'FullAccess' },
            { title: 'Send As', value: 'SendAs' },
            { title: 'Send on Behalf', value: 'SendOnBehalf' }
          ]
        });
        break;

      case 'UC032':
        ucName = 'Remove Mailbox Delegate Permission';
        addUpnInput('Mailbox UPN', 'mailboxUpn');
        addUpnInput('Delegate User UPN', 'delegateUpn');
        inputs.push({
          type: 'Input.ChoiceSet',
          id: 'permission',
          label: 'Access Rights Permission to Remove',
          value: 'FullAccess',
          choices: [
            { title: 'Full Access (Read and Manage)', value: 'FullAccess' },
            { title: 'Send As', value: 'SendAs' },
            { title: 'Send on Behalf', value: 'SendOnBehalf' }
          ]
        });
        break;

      case 'UC036':
        ucName = 'Check Mailbox Permissions Matrix';
        addUpnInput('Mailbox UPN');
        break;

      case 'UC037':
        ucName = 'Enable Mail Forwarding';
        addUpnInput('User Mailbox UPN');
        inputs.push({
          type: 'Input.Text',
          id: 'forwardAddress',
          label: 'Forwarding Target Email Address',
          placeholder: 'e.g. external-inbox@gmail.com',
          isRequired: true,
          errorMessage: 'Forwarding address is required'
        });
        break;

      case 'UC038':
        ucName = 'Disable Mail Forwarding';
        addUpnInput('User Mailbox UPN');
        break;

      case 'UC039':
        ucName = 'Set Automatic Out-of-Office Replies';
        addUpnInput('User Mailbox UPN');
        inputs.push({
          type: 'Input.Text',
          id: 'message',
          label: 'Automatic Reply Message Body',
          placeholder: 'e.g. I am currently out of the office and will return next week...',
          isMultiline: true,
          isRequired: true,
          errorMessage: 'Reply message is required'
        });
        break;

      case 'UC040':
        ucName = 'Disable Automatic Replies';
        addUpnInput('User Mailbox UPN');
        break;

      case 'UC041':
        ucName = 'Increase Mailbox Quota Limit';
        addUpnInput('Mailbox UPN');
        inputs.push({
          type: 'Input.Number',
          id: 'quotaGb',
          label: 'New ProhibitSend Storage Quota (GB)',
          value: 99,
          min: 1,
          max: 100,
          isRequired: true
        });
        break;

      case 'UC042':
        ucName = 'Check Mailbox Size & Storage';
        addUpnInput('Mailbox UPN');
        break;

      case 'UC043':
        ucName = 'Convert User Mailbox to Shared Mailbox';
        addUpnInput('User Mailbox UPN');
        break;

      case 'UC044':
        ucName = 'Check OneDrive Storage';
        addUpnInput('User UPN');
        break;

      case 'UC045':
        ucName = 'Grant OneDrive Access delegation';
        addUpnInput('OneDrive Owner UPN', 'userUpn');
        addUpnInput('Delegate Admin UPN', 'targetUserUpn');
        break;

      case 'UC046':
        ucName = 'Restore OneDrive Deleted Files';
        addUpnInput('User UPN');
        inputs.push({
          type: 'Input.Number',
          id: 'daysAgo',
          label: 'Restore point (Days Ago)',
          value: 7,
          min: 1,
          max: 30,
          isRequired: true
        });
        break;

      case 'UC047':
        ucName = 'Generate OneDrive Sharing Link Report';
        addUpnInput('User UPN');
        break;

      case 'UC048':
        ucName = 'Create SharePoint Site';
        inputs.push(
          { type: 'Input.Text', id: 'displayName', label: 'SharePoint Site Title', placeholder: 'e.g. HR Benefits Portal', isRequired: true },
          { type: 'Input.Text', id: 'alias', label: 'Site URL Directory Path Alias', placeholder: 'e.g. hrbenefits', isRequired: true }
        );
        break;

      case 'UC049':
        ucName = 'Add User to SharePoint Site';
        inputs.push({ type: 'Input.Text', id: 'siteSearch', label: 'Site Title or Alias', placeholder: 'e.g. hrbenefits', isRequired: true });
        addUpnInput('User UPN to Add');
        inputs.push({
          type: 'Input.ChoiceSet',
          id: 'role',
          label: 'Access Role',
          value: 'read',
          choices: [
            { title: 'Owner (Full Control)', value: 'owner' },
            { title: 'Write (Contributor)', value: 'write' },
            { title: 'Read (Visitor)', value: 'read' }
          ]
        });
        break;

      case 'UC050':
        ucName = 'Check SharePoint Site Permissions Matrix';
        inputs.push({ type: 'Input.Text', id: 'siteSearch', label: 'Site Title, Alias or URL', placeholder: 'e.g. hrbenefits', isRequired: true });
        break;

      default:
        ucName = `M365 Admin Task (${ucCode})`;
        inputs.push({ type: 'TextBlock', text: 'This use case does not require input forms.' });
    }

    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.5',
      body: [
        {
          type: 'TextBlock',
          text: `🔧 ${ucName}`,
          weight: 'Bolder',
          size: 'Medium',
          color: 'Accent'
        },
        {
          type: 'TextBlock',
          text: `Use case code: **${ucCode}**`,
          size: 'Small',
          isSubtle: true
        },
        {
          type: 'Container',
          spacing: 'Medium',
          items: inputs
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: 'Execute Task',
          data: {
            action: 'm365_execute',
            uc: ucCode
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
   * Risk confirmation card for sensitive tasks (Delete, Block)
   */
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
    switch (ucCode) {
      case 'UC001': return 'Create User';
      case 'UC002': return 'Update Display Name';
      case 'UC003': return 'Update Job Title';
      case 'UC004': return 'Update Department';
      case 'UC005': return 'Update Manager';
      case 'UC008': return 'Reset Password';
      case 'UC010': return 'Block Sign-in';
      case 'UC011': return 'Unblock Sign-in';
      case 'UC012': return 'Delete User';
      case 'UC013': return 'Assign License';
      case 'UC014': return 'Remove License';
      case 'UC015': return 'Check User License';
      case 'UC016': return 'Check Available Licenses';
      case 'UC020': return 'Find Unlicensed Users';
      case 'UC021': return 'Create Security Group';
      case 'UC022': return 'Create M365 Group';
      case 'UC023': return 'Add Member to Group';
      case 'UC024': return 'Remove Member from Group';
      case 'UC025': return 'View Group Members';
      case 'UC026': return 'Update Group Owner';
      case 'UC027': return 'Hide Group from GAL';
      case 'UC028': return 'Rename Group';
      case 'UC029': return 'Create Shared Mailbox';
      case 'UC030': return 'Delete Shared Mailbox';
      case 'UC031': return 'Add Mailbox Delegate';
      case 'UC032': return 'Remove Mailbox Delegate';
      case 'UC036': return 'Check Mailbox Permissions';
      case 'UC037': return 'Enable Mail Forwarding';
      case 'UC038': return 'Disable Mail Forwarding';
      case 'UC039': return 'Set Automatic Reply';
      case 'UC040': return 'Disable Automatic Reply';
      case 'UC041': return 'Increase Mailbox Quota';
      case 'UC042': return 'Check Mailbox Size';
      case 'UC043': return 'Convert Mailbox to Shared';
      case 'UC044': return 'Check OneDrive Storage';
      case 'UC045': return 'Grant OneDrive Access';
      case 'UC046': return 'Restore OneDrive Files';
      case 'UC047': return 'Generate Sharing Report';
      case 'UC048': return 'Create SharePoint Site';
      case 'UC049': return 'Add User to SharePoint Site';
      case 'UC050': return 'Check SharePoint Permissions';
      default: return `M365 Task (${ucCode})`;
    }
  }

  /**
   * Generates the Review & Confirm card for the user
   */
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
