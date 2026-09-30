export interface LicenseComponentUsage {
  copilot: {
    assigned: boolean;
    promptsThisMonth: number;
    lastPromptDate: string;
    status: 'Active' | 'Low Usage' | 'Dormant' | 'Not Assigned';
  };
  officeApps: {
    desktopLaunches30d: number;
    webAppSessions30d: number;
    lastDesktopLaunch: string;
    mode: 'Desktop + Web' | 'Web Only' | 'Inactive';
  };
  teams: {
    chatsSent30d: number;
    callsAttended30d: number;
    activeDays30d: number;
    lastActiveDate: string;
    status: 'High Activity' | 'Moderate' | 'Inactive';
  };
  exchange: {
    emailsSent30d: number;
    emailsReceived30d: number;
    mailboxUsedGb: number;
    lastMailDate: string;
    status: 'Active' | 'Inactive Mailbox';
  };
  oneDrive: {
    filesSynced30d: number;
    storageUsedGb: number;
    lastSyncDate: string;
  };
}

export interface LicenseUser {
  id: string;
  name: string;
  email: string;
  department: string;
  country: string;
  businessUnit: string;
  costCenter: string;
  manager: string;
  jobRole: string;
  userType: 'Employee' | 'Guest' | 'Shared Mailbox' | 'Service Account';
  status: 'Active' | 'Disabled';
  assignedLicenses: string[];
  lastLogin: string; // ISO date
  lastActivity: string; // ISO date
  utilizationScore: number; // 0-100
  monthlyCost: number;
  workloads?: {
    Exchange: number;
    Teams: number;
    SharePoint: number;
    Copilot: number;
  };
  components: LicenseComponentUsage;
  optimizationRecommendation?: {
    action: 'Reclaim Copilot' | 'Downgrade to E3' | 'Downgrade to F3' | 'Reclaim All (Dormant)' | 'Optimal';
    monthlySavings: number;
    rationale: string;
  };
}

export const SKUS = [
  { id: 'E5', name: 'Microsoft 365 E5', cost: 38.00 },
  { id: 'E3', name: 'Microsoft 365 E3', cost: 23.00 },
  { id: 'F3', name: 'Microsoft 365 F3', cost: 8.00 },
  { id: 'COPILOT', name: 'Microsoft 365 Copilot', cost: 30.00 },
  { id: 'VISIO', name: 'Visio Plan 2', cost: 15.00 },
  { id: 'PROJECT', name: 'Project Plan 3', cost: 30.00 },
];

export const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'IT', 'Executive'];
export const COUNTRIES = ['United States', 'United Kingdom', 'India', 'Germany', 'Australia', 'Japan'];

function generateMockUsers(count: number): LicenseUser[] {
  const users: LicenseUser[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const isGuest = Math.random() > 0.95;
    const isDisabled = Math.random() > 0.95;
    const isShared = Math.random() > 0.98;
    
    let userType: LicenseUser['userType'] = 'Employee';
    if (isGuest) userType = 'Guest';
    if (isShared) userType = 'Shared Mailbox';

    // Assign licenses
    const assignedLicenses: string[] = [];
    let monthlyCost = 0;
    
    if (userType === 'Employee') {
      if (Math.random() > 0.45) {
        assignedLicenses.push('E5');
        monthlyCost += 38.00;
      } else {
        assignedLicenses.push('E3');
        monthlyCost += 23.00;
      }
      
      // 35% of users have Copilot add-on
      if (Math.random() > 0.65) {
        assignedLicenses.push('COPILOT');
        monthlyCost += 30.00;
      }

      if (Math.random() > 0.85) {
        assignedLicenses.push('VISIO');
        monthlyCost += 15.00;
      }
    } else if (userType === 'Guest') {
      if (Math.random() > 0.5) {
        assignedLicenses.push('E3');
        monthlyCost += 23.00;
      }
    } else if (userType === 'Shared Mailbox') {
      if (Math.random() > 0.5) {
        assignedLicenses.push('E3');
        monthlyCost += 23.00;
      }
    }

    // Activity Timestamps
    const daysSinceLogin = Math.floor(Math.random() * 120);
    const lastLogin = new Date(now.getTime() - daysSinceLogin * 24 * 60 * 60 * 1000).toISOString();
    
    const daysSinceActivity = daysSinceLogin + Math.floor(Math.random() * 10);
    const lastActivity = new Date(now.getTime() - daysSinceActivity * 24 * 60 * 60 * 1000).toISOString();

    const isDormant = daysSinceActivity > 90;
    const hasCopilot = assignedLicenses.includes('COPILOT');
    
    // Detailed Component Breakdown Simulation
    const copilotPrompts = hasCopilot ? (Math.random() > 0.55 ? 0 : Math.floor(Math.random() * 85)) : 0;
    const copilotStatus = !hasCopilot ? 'Not Assigned' : (copilotPrompts === 0 ? 'Dormant' : copilotPrompts < 10 ? 'Low Usage' : 'Active');

    const desktopLaunches = isDormant ? 0 : (Math.random() > 0.4 ? 0 : Math.floor(Math.random() * 60) + 5);
    const webSessions = isDormant ? 0 : Math.floor(Math.random() * 90) + 10;
    const officeMode = desktopLaunches > 0 ? 'Desktop + Web' : (webSessions > 0 ? 'Web Only' : 'Inactive');

    const teamsCalls = isDormant ? 0 : Math.floor(Math.random() * 35);
    const teamsChats = isDormant ? 0 : Math.floor(Math.random() * 300);
    const teamsActiveDays = isDormant ? 0 : Math.floor(Math.random() * 22);
    const teamsStatus = teamsActiveDays > 10 ? 'High Activity' : (teamsActiveDays > 0 ? 'Moderate' : 'Inactive');

    const emailsSent = isDormant ? 0 : Math.floor(Math.random() * 150);
    const emailsReceived = isDormant ? 0 : Math.floor(Math.random() * 400) + 20;
    const mailboxUsedGb = parseFloat((Math.random() * 25 + 0.5).toFixed(1));
    const exchangeStatus = (emailsSent + emailsReceived > 0) ? 'Active' : 'Inactive Mailbox';

    const components: LicenseComponentUsage = {
      copilot: {
        assigned: hasCopilot,
        promptsThisMonth: copilotPrompts,
        lastPromptDate: copilotPrompts > 0 ? new Date(now.getTime() - Math.floor(Math.random() * 14) * 86400000).toISOString() : 'Never / 30+ Days',
        status: copilotStatus
      },
      officeApps: {
        desktopLaunches30d: desktopLaunches,
        webAppSessions30d: webSessions,
        lastDesktopLaunch: desktopLaunches > 0 ? new Date(now.getTime() - Math.floor(Math.random() * 7) * 86400000).toISOString() : '0 in last 45 days',
        mode: officeMode
      },
      teams: {
        chatsSent30d: teamsChats,
        callsAttended30d: teamsCalls,
        activeDays30d: teamsActiveDays,
        lastActiveDate: teamsActiveDays > 0 ? new Date(now.getTime() - Math.floor(Math.random() * 5) * 86400000).toISOString() : '30+ days ago',
        status: teamsStatus
      },
      exchange: {
        emailsSent30d: emailsSent,
        emailsReceived30d: emailsReceived,
        mailboxUsedGb: mailboxUsedGb,
        lastMailDate: emailsSent > 0 ? new Date(now.getTime() - Math.floor(Math.random() * 4) * 86400000).toISOString() : '60+ days ago',
        status: exchangeStatus
      },
      oneDrive: {
        filesSynced30d: isDormant ? 0 : Math.floor(Math.random() * 120) + 5,
        storageUsedGb: parseFloat((Math.random() * 120 + 2.0).toFixed(1)),
        lastSyncDate: isDormant ? '90+ days ago' : new Date(now.getTime() - Math.floor(Math.random() * 2) * 86400000).toISOString()
      }
    };

    // Calculate intelligent utilization score
    let score = 0;
    if (components.exchange.status === 'Active') score += 25;
    if (components.teams.status === 'High Activity') score += 30;
    else if (components.teams.status === 'Moderate') score += 15;
    if (components.officeApps.mode === 'Desktop + Web') score += 25;
    else if (components.officeApps.mode === 'Web Only') score += 15;
    if (hasCopilot) {
      if (copilotStatus === 'Active') score += 20;
      else if (copilotStatus === 'Low Usage') score += 10;
    } else {
      score = Math.min(100, Math.round(score * 1.25));
    }
    const utilizationScore = isDormant ? 0 : Math.min(100, Math.max(5, score));

    // Calculate AI Optimization Recommendation
    let optimizationRecommendation: LicenseUser['optimizationRecommendation'] = {
      action: 'Optimal',
      monthlySavings: 0,
      rationale: 'Active utilization across all provisioned M365 workloads.'
    };

    if (isDormant || isDisabled) {
      optimizationRecommendation = {
        action: 'Reclaim All (Dormant)',
        monthlySavings: monthlyCost,
        rationale: 'Zero user activity in 90+ days. Fully de-provision and reclaim licenses.'
      };
    } else if (hasCopilot && copilotPrompts === 0) {
      optimizationRecommendation = {
        action: 'Reclaim Copilot',
        monthlySavings: 30.00,
        rationale: 'Assigned M365 Copilot but has 0 prompts in last 30 days.'
      };
    } else if (assignedLicenses.includes('E5') && desktopLaunches === 0 && webSessions > 0) {
      optimizationRecommendation = {
        action: 'Downgrade to F3',
        monthlySavings: 30.00, // E5 ($38) -> F3 ($8)
        rationale: 'Exclusively uses Web/Mobile apps with zero desktop suite launches.'
      };
    } else if (assignedLicenses.includes('E5') && utilizationScore < 45) {
      optimizationRecommendation = {
        action: 'Downgrade to E3',
        monthlySavings: 15.00, // E5 ($38) -> E3 ($23)
        rationale: 'Low advanced security/analytics workload utilization. Safe candidate for E3.'
      };
    }

    users.push({
      id: `usr-${i}`,
      name: `User ${i}`,
      email: `user${i}@company.com`,
      department: dept,
      country: country,
      businessUnit: 'Core',
      costCenter: `CC-${Math.floor(Math.random() * 100)}`,
      manager: `Manager ${Math.floor(Math.random() * 10)}`,
      jobRole: 'Staff',
      userType,
      status: isDisabled ? 'Disabled' : 'Active',
      assignedLicenses,
      lastLogin,
      lastActivity,
      utilizationScore,
      monthlyCost,
      workloads: {
        Exchange: components.exchange.status === 'Active' ? 85 : 10,
        Teams: components.teams.activeDays30d * 4,
        SharePoint: components.oneDrive.filesSynced30d > 10 ? 80 : 20,
        Copilot: copilotPrompts
      },
      components,
      optimizationRecommendation
    });
  }
  return users;
}

export const mockUsers = generateMockUsers(500);

export const mockInsights = [
  { id: '1', title: 'Dormant E5 Users', description: 'Users with E5 licenses showing no activity in 90+ days.', count: mockUsers.filter(u => u.assignedLicenses.includes('E5') && new Date(u.lastActivity).getTime() < Date.now() - 90 * 24 * 60 * 60 * 1000).length, savings: 3800, action: 'Reclaim' },
  { id: '2', title: 'Zero-Prompt Copilot Seats', description: 'Users assigned Microsoft 365 Copilot with 0 prompts sent in the last 30 days.', count: mockUsers.filter(u => u.assignedLicenses.includes('COPILOT') && u.components.copilot.promptsThisMonth === 0).length, savings: mockUsers.filter(u => u.assignedLicenses.includes('COPILOT') && u.components.copilot.promptsThisMonth === 0).length * 30, action: 'Reclaim' },
  { id: '3', title: 'Web-Only Users on E5 (F3 Candidates)', description: 'Users who never launch desktop Office apps and only use web/mobile.', count: mockUsers.filter(u => u.assignedLicenses.includes('E5') && u.components.officeApps.mode === 'Web Only').length, savings: mockUsers.filter(u => u.assignedLicenses.includes('E5') && u.components.officeApps.mode === 'Web Only').length * 30, action: 'Downgrade' },
  { id: '4', title: 'Disabled Accounts with Licenses', description: 'Accounts marked as disabled in Entra ID but still holding active paid licenses.', count: mockUsers.filter(u => u.status === 'Disabled' && u.assignedLicenses.length > 0).length, savings: 1250, action: 'Reclaim' },
];

