export interface UseCaseDefinition {
  id: string;
  name: string;
  description: string;
  actor: 'User' | 'Helpdesk';
  approvalRequired: boolean;
  category: string;
}

export const supportUseCases: UseCaseDefinition[] = [
  { id: 'SUC001', name: 'Reset My Password', description: 'Allows users to reset their password securely', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC002', name: 'Unlock My Account', description: 'Unlocks the user account after lockout', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC003', name: 'Force Password Change Next Login', description: 'Forces password change during next login', actor: 'Helpdesk', approvalRequired: false, category: 'Entra' },
  { id: 'SUC004', name: 'Check Password Expiry Status', description: 'Shows password expiry details', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC005', name: 'Check Last Password Change Date', description: 'Displays when password was last changed', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC006', name: 'Reset SSPR Registration', description: 'Resets self-service password reset registration', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC007', name: 'Check SSPR Enrollment Status', description: 'Checks whether SSPR is configured', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC008', name: 'Reset My MFA Methods', description: 'Clears all MFA methods for fresh setup', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC009', name: 'Force MFA Re-registration', description: 'Forces user to register MFA again', actor: 'Helpdesk', approvalRequired: false, category: 'Entra' },
  { id: 'SUC010', name: 'Check MFA Enrollment Status', description: 'Shows whether MFA is enabled and configured', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC011', name: 'View Registered MFA Methods', description: 'Lists registered authentication methods', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC012', name: 'Remove Old Authenticator Device', description: 'Removes old Microsoft Authenticator device', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC013', name: 'Remove Old Phone Number', description: 'Removes outdated MFA phone number', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC014', name: 'Generate Temporary Access Pass', description: 'Creates a temporary access pass for login recovery', actor: 'Helpdesk', approvalRequired: true, category: 'Entra' },
  { id: 'SUC015', name: 'Check Temporary Access Pass Validity', description: 'Shows TAP expiry and status', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC016', name: 'Remove Email Auth Method', description: 'Removes email as authentication method', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC017', name: 'Revoke Passwordless Login', description: 'Disables passwordless authentication', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC018', name: 'View My Profile', description: 'Displays full user profile details', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC019', name: 'Update Mobile Number', description: 'Updates mobile number in Entra ID', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC020', name: 'Update Alternate Email', description: 'Updates alternate email address', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC021', name: 'Update Office Location', description: 'Updates office location details', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC022', name: 'Update Preferred Language', description: 'Updates language preference', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC023', name: 'Update Emergency Contact', description: 'Updates emergency contact details', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC024', name: 'Check My Manager', description: 'Shows assigned manager details', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC025', name: 'View My Team Structure', description: 'Shows reporting team hierarchy', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC026', name: 'Sign Me Out Everywhere', description: 'Signs out user from all active sessions', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC027', name: 'Revoke My Active Sessions', description: 'Revokes all active authentication tokens', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC028', name: 'View My Active Sessions', description: 'Lists active login sessions', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC029', name: 'Terminate Specific Session', description: 'Terminates selected active session', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC030', name: 'View My Sign-in History', description: 'Shows recent sign-in history', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC031', name: 'View Failed Sign-ins', description: 'Displays failed login attempts', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC032', name: 'View Sign-in Locations', description: 'Shows login locations and IP history', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC033', name: 'Report Suspicious Login', description: 'Allows reporting suspicious login activity', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC034', name: 'Confirm Safe Login', description: 'Allows user to confirm legitimate login activity', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC035', name: 'View My Registered Devices', description: 'Lists all devices linked to account', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC036', name: 'Remove Old Device from Account', description: 'Removes stale or unused devices', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC037', name: 'Mark Device Lost', description: 'Marks a registered device as lost', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC038', name: 'Check Device Compliance Status', description: 'Displays device compliance details', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC039', name: 'Request Group Access', description: 'Requests access to a security or M365 group', actor: 'User', approvalRequired: true, category: 'Entra' },
  { id: 'SUC040', name: 'Request Application Access', description: 'Requests access to enterprise applications', actor: 'User', approvalRequired: true, category: 'Entra' },
  { id: 'SUC041', name: 'Request Shared Mailbox Access', description: 'Requests access to a shared mailbox', actor: 'User', approvalRequired: true, category: 'Entra' },
  { id: 'SUC042', name: 'Request Distribution List Access', description: 'Requests membership in a distribution list', actor: 'User', approvalRequired: true, category: 'Entra' },
  { id: 'SUC043', name: 'Request Role Elevation (Temporary)', description: 'Requests temporary admin privilege elevation', actor: 'User', approvalRequired: true, category: 'Entra' },
  { id: 'SUC044', name: 'Request Guest Invitation', description: 'Requests guest account invitation', actor: 'User', approvalRequired: true, category: 'Entra' },
  { id: 'SUC045', name: 'Check My Account Status', description: 'Displays active/block status of account', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC046', name: 'Check If My Account Is Blocked', description: 'Confirms if account is blocked from sign-in', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC047', name: 'View My Assigned Roles', description: 'Shows assigned Entra roles', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC048', name: 'View My Assigned Licenses', description: 'Lists active licenses assigned', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC049', name: 'Check License Expiry', description: 'Shows expiry or renewal details for licenses', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC050', name: 'View My Access Summary', description: 'Summarizes all access rights and roles', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC051', name: 'Check If My Account Is Risky', description: 'Shows if account has any risk alerts', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC052', name: 'Acknowledge Risk Alert', description: 'Confirms risk alert acknowledgement', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC053', name: 'Request Account Recovery', description: 'Initiates recovery workflow for compromised account', actor: 'User', approvalRequired: true, category: 'Entra' },
  { id: 'SUC054', name: 'Report Compromised Account', description: 'Flags account as compromised for investigation', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC055', name: 'Check Recovery Status', description: 'Tracks current recovery request progress', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC056', name: 'Find My Manager Contact', description: 'Retrieves manager contact details', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC057', name: 'Find My Team Members', description: 'Lists team members under same manager', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC058', name: 'Find My Department Members', description: 'Lists members in same department', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC059', name: 'View My Reporting Chain', description: 'Shows reporting hierarchy upwards', actor: 'User', approvalRequired: false, category: 'Entra' },
  { id: 'SUC060', name: 'Find Internal Contact', description: 'Searches internal employee directory', actor: 'User', approvalRequired: false, category: 'Entra' }
,
  {
    id: 'EXC021',
    name: 'Enable Mail Forwarding',
    description: 'Enable Mail Forwarding',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC022',
    name: 'Disable Mail Forwarding',
    description: 'Disable Mail Forwarding',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC023',
    name: 'Update Forwarding Address',
    description: 'Update Forwarding Address',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC037',
    name: 'Check Mailbox Size',
    description: 'Check Mailbox Size',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC038',
    name: 'Check Mailbox Quota',
    description: 'Check Mailbox Quota',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC027',
    name: 'Create Inbox Rule',
    description: 'Create Inbox Rule',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC028',
    name: 'Delete Inbox Rule',
    description: 'Delete Inbox Rule',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC029',
    name: 'View Inbox Rules',
    description: 'View Inbox Rules',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC030',
    name: 'Disable Inbox Rule',
    description: 'Disable Inbox Rule',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC031',
    name: 'Enable Out of Office',
    description: 'Enable Out of Office',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC032',
    name: 'Disable Out of Office',
    description: 'Disable Out of Office',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC033',
    name: 'Update OOF Message',
    description: 'Update OOF Message',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC034',
    name: 'Configure Internal OOF',
    description: 'Configure Internal OOF',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC035',
    name: 'Configure External OOF',
    description: 'Configure External OOF',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC036',
    name: 'View Automatic Reply Status',
    description: 'View Automatic Reply Status',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC096',
    name: 'Release Quarantined Email',
    description: 'Release Quarantined Email',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC097',
    name: 'View Quarantine',
    description: 'View Quarantine',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC098',
    name: 'Block Sender',
    description: 'Block Sender',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC099',
    name: 'Allow Sender',
    description: 'Allow Sender',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC100',
    name: 'Block Domain',
    description: 'Block Domain',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC101',
    name: 'Allow Domain',
    description: 'Allow Domain',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC103',
    name: 'Update Safe Senders',
    description: 'Update Safe Senders',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC104',
    name: 'Update Safe Recipients',
    description: 'Update Safe Recipients',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC071',
    name: 'Book Room Calendar',
    description: 'Book Room Calendar',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC072',
    name: 'View Room Availability',
    description: 'View Room Availability',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC121',
    name: 'View Calendar Permissions',
    description: 'View Calendar Permissions',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC122',
    name: 'Grant Calendar Access',
    description: 'Grant Calendar Access',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC123',
    name: 'Remove Calendar Access',
    description: 'Remove Calendar Access',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC124',
    name: 'Share Calendar',
    description: 'Share Calendar',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC125',
    name: 'Stop Calendar Sharing',
    description: 'Stop Calendar Sharing',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC126',
    name: 'Check Free/Busy Settings',
    description: 'Check Free/Busy Settings',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC127',
    name: 'Reset Calendar Permissions',
    description: 'Reset Calendar Permissions',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC049',
    name: 'Add Member DL',
    description: 'Add Member DL',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC050',
    name: 'Remove Member DL',
    description: 'Remove Member DL',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC051',
    name: 'View Members DL',
    description: 'View Members DL',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC063',
    name: 'Add Member Group',
    description: 'Add Member Group',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC064',
    name: 'Remove Member Group',
    description: 'Remove Member Group',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC069',
    name: 'View Members Group',
    description: 'View Members Group',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC070',
    name: 'View Owners Group',
    description: 'View Owners Group',
    actor: 'User',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC001',
    name: 'Create Shared Mailbox',
    description: 'Create Shared Mailbox',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC002',
    name: 'Delete Shared Mailbox',
    description: 'Delete Shared Mailbox',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC003',
    name: 'Convert User Mailbox to Shared',
    description: 'Convert User Mailbox to Shared',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC004',
    name: 'Convert Shared Mailbox to User',
    description: 'Convert Shared Mailbox to User',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC005',
    name: 'Create Room Mailbox',
    description: 'Create Room Mailbox',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC006',
    name: 'Create Equipment Mailbox',
    description: 'Create Equipment Mailbox',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC007',
    name: 'Rename Mailbox',
    description: 'Rename Mailbox',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC008',
    name: 'Hide Mailbox from GAL',
    description: 'Hide Mailbox from GAL',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC009',
    name: 'Unhide Mailbox from GAL',
    description: 'Unhide Mailbox from GAL',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC010',
    name: 'Check Mailbox Properties',
    description: 'Check Mailbox Properties',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC011',
    name: 'Grant Full Access',
    description: 'Grant Full Access',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC012',
    name: 'Remove Full Access',
    description: 'Remove Full Access',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC013',
    name: 'Grant Send As',
    description: 'Grant Send As',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC014',
    name: 'Remove Send As',
    description: 'Remove Send As',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC015',
    name: 'Grant Send on Behalf',
    description: 'Grant Send on Behalf',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC016',
    name: 'Remove Send on Behalf',
    description: 'Remove Send on Behalf',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC017',
    name: 'View Mailbox Permissions',
    description: 'View Mailbox Permissions',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC018',
    name: 'View Delegates',
    description: 'View Delegates',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC019',
    name: 'Remove All Delegates',
    description: 'Remove All Delegates',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC020',
    name: 'Copy Permissions Between Mailboxes',
    description: 'Copy Permissions Between Mailboxes',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC024',
    name: 'Enable External Forwarding',
    description: 'Enable External Forwarding',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC025',
    name: 'Disable External Forwarding',
    description: 'Disable External Forwarding',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC026',
    name: 'View Forwarding Settings',
    description: 'View Forwarding Settings',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC039',
    name: 'Increase Mailbox Quota',
    description: 'Increase Mailbox Quota',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC040',
    name: 'Reduce Mailbox Quota',
    description: 'Reduce Mailbox Quota',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC041',
    name: 'Enable Online Archive',
    description: 'Enable Online Archive',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC042',
    name: 'Disable Online Archive',
    description: 'Disable Online Archive',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC043',
    name: 'Check Archive Size',
    description: 'Check Archive Size',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC044',
    name: 'Enable Auto Expanding Archive',
    description: 'Enable Auto Expanding Archive',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC045',
    name: 'View Archive Status',
    description: 'View Archive Status',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC079',
    name: 'Enable Litigation Hold',
    description: 'Enable Litigation Hold',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC080',
    name: 'Disable Litigation Hold',
    description: 'Disable Litigation Hold',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC081',
    name: 'Configure Retention Policy',
    description: 'Configure Retention Policy',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC082',
    name: 'Remove Retention Policy',
    description: 'Remove Retention Policy',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC083',
    name: 'View Retention Settings',
    description: 'View Retention Settings',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC084',
    name: 'Enable Archive Policy',
    description: 'Enable Archive Policy',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC085',
    name: 'Disable Archive Policy',
    description: 'Disable Archive Policy',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC086',
    name: 'Apply Retention Tag',
    description: 'Apply Retention Tag',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC087',
    name: 'View Retention Tags',
    description: 'View Retention Tags',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC088',
    name: 'Run Message Trace',
    description: 'Run Message Trace',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC089',
    name: 'Search Email Delivery',
    description: 'Search Email Delivery',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC090',
    name: 'Check Mail Delay',
    description: 'Check Mail Delay',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC091',
    name: 'View Failed Deliveries',
    description: 'View Failed Deliveries',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC092',
    name: 'Export Message Trace',
    description: 'Export Message Trace',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC093',
    name: 'Search By Message ID',
    description: 'Search By Message ID',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC094',
    name: 'Search by Sender',
    description: 'Search by Sender',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC095',
    name: 'Search by Recipient',
    description: 'Search by Recipient',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC102',
    name: 'View Anti-Spam Policy',
    description: 'View Anti-Spam Policy',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC133',
    name: 'Create Mail Flow Rule',
    description: 'Create Mail Flow Rule',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC134',
    name: 'Disable Mail Flow Rule',
    description: 'Disable Mail Flow Rule',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC135',
    name: 'Enable Mail Flow Rule',
    description: 'Enable Mail Flow Rule',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC136',
    name: 'Delete Mail Flow Rule',
    description: 'Delete Mail Flow Rule',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC137',
    name: 'View Transport Rules',
    description: 'View Transport Rules',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC138',
    name: 'View Mailbox Audit Logs',
    description: 'View Mailbox Audit Logs',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC139',
    name: 'Enable Mailbox Auditing',
    description: 'Enable Mailbox Auditing',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC140',
    name: 'Disable Mailbox Auditing',
    description: 'Disable Mailbox Auditing',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC141',
    name: 'Search Mailbox Audit Events',
    description: 'Search Mailbox Audit Events',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC142',
    name: 'Export Audit Logs',
    description: 'Export Audit Logs',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC046',
    name: 'Create Distribution List',
    description: 'Create Distribution List',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC047',
    name: 'Delete Distribution List',
    description: 'Delete Distribution List',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC048',
    name: 'Rename Distribution List',
    description: 'Rename Distribution List',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC052',
    name: 'Update Owner DL',
    description: 'Update Owner DL',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC053',
    name: 'Hide DL from GAL',
    description: 'Hide DL from GAL',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC054',
    name: 'Unhide DL from GAL',
    description: 'Unhide DL from GAL',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC055',
    name: 'View Distribution List Settings',
    description: 'View Distribution List Settings',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC056',
    name: 'Create Dynamic Distribution Group',
    description: 'Create Dynamic Distribution Group',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC057',
    name: 'Delete Dynamic Distribution Group',
    description: 'Delete Dynamic Distribution Group',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC058',
    name: 'Update Membership Rule',
    description: 'Update Membership Rule',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC059',
    name: 'View Membership Preview',
    description: 'View Membership Preview',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC060',
    name: 'Restore Dynamic Group',
    description: 'Restore Dynamic Group',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC061',
    name: 'Create M365 Group',
    description: 'Create M365 Group',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC062',
    name: 'Delete M365 Group',
    description: 'Delete M365 Group',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC065',
    name: 'Add Owner Group',
    description: 'Add Owner Group',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC066',
    name: 'Remove Owner Group',
    description: 'Remove Owner Group',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC067',
    name: 'Hide Group',
    description: 'Hide Group',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC068',
    name: 'Unhide Group',
    description: 'Unhide Group',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC073',
    name: 'Update Booking Policy',
    description: 'Update Booking Policy',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC074',
    name: 'Enable Auto Accept',
    description: 'Enable Auto Accept',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC075',
    name: 'Disable Auto Accept',
    description: 'Disable Auto Accept',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC076',
    name: 'Add Booking Delegate',
    description: 'Add Booking Delegate',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC077',
    name: 'Remove Booking Delegate',
    description: 'Remove Booking Delegate',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC078',
    name: 'View Booking Settings',
    description: 'View Booking Settings',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC105',
    name: 'Create Mail Contact',
    description: 'Create Mail Contact',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC106',
    name: 'Delete Mail Contact',
    description: 'Delete Mail Contact',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC107',
    name: 'Update Mail Contact',
    description: 'Update Mail Contact',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC108',
    name: 'View Mail Contacts',
    description: 'View Mail Contacts',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC109',
    name: 'Hide Contact from GAL',
    description: 'Hide Contact from GAL',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC110',
    name: 'Create Mail User',
    description: 'Create Mail User',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC111',
    name: 'Delete Mail User',
    description: 'Delete Mail User',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC112',
    name: 'Update Mail User',
    description: 'Update Mail User',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC113',
    name: 'View Mail User',
    description: 'View Mail User',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC114',
    name: 'Convert Mail User',
    description: 'Convert Mail User',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC128',
    name: 'Add SMTP Alias',
    description: 'Add SMTP Alias',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC129',
    name: 'Remove SMTP Alias',
    description: 'Remove SMTP Alias',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC130',
    name: 'Set Primary SMTP',
    description: 'Set Primary SMTP',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC131',
    name: 'View Email Aliases',
    description: 'View Email Aliases',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC115',
    name: 'Check Mailbox Health',
    description: 'Check Mailbox Health',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC116',
    name: 'Check Mailbox Connectivity',
    description: 'Check Mailbox Connectivity',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC117',
    name: 'Verify Mailbox Status',
    description: 'Verify Mailbox Status',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC118',
    name: 'Check Mail Flow Status',
    description: 'Check Mail Flow Status',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC119',
    name: 'Validate SMTP Address',
    description: 'Validate SMTP Address',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC120',
    name: 'View Mailbox Statistics',
    description: 'View Mailbox Statistics',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC132',
    name: 'Validate Email Address',
    description: 'Validate Email Address',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC143',
    name: 'Check Hybrid Mailbox Status',
    description: 'Check Hybrid Mailbox Status',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC144',
    name: 'Validate Hybrid Mail Flow',
    description: 'Validate Hybrid Mail Flow',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC145',
    name: 'Verify Exchange Hybrid Configuration',
    description: 'Verify Exchange Hybrid Configuration',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC146',
    name: 'Mailbox Inventory Report',
    description: 'Mailbox Inventory Report',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC147',
    name: 'Shared Mailbox Report',
    description: 'Shared Mailbox Report',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC148',
    name: 'Mailbox Size Report',
    description: 'Mailbox Size Report',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC149',
    name: 'Distribution List Report',
    description: 'Distribution List Report',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  },
  {
    id: 'EXC150',
    name: 'Exchange Health Dashboard',
    description: 'Exchange Health Dashboard',
    actor: 'Helpdesk',
    approvalRequired: false,
    category: 'EXO'
  }
];
