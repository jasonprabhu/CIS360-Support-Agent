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
}

export const SKUS = [
  { id: 'E5', name: 'Microsoft 365 E5', cost: 38.00 },
  { id: 'E3', name: 'Microsoft 365 E3', cost: 23.00 },
  { id: 'F3', name: 'Microsoft 365 F3', cost: 8.00 },
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
      if (Math.random() > 0.5) {
        assignedLicenses.push('E5');
        monthlyCost += 38.00;
      } else {
        assignedLicenses.push('E3');
        monthlyCost += 23.00;
      }
      
      if (Math.random() > 0.8) {
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

    // Activity
    const daysSinceLogin = Math.floor(Math.random() * 120);
    const lastLogin = new Date(now.getTime() - daysSinceLogin * 24 * 60 * 60 * 1000).toISOString();
    
    const daysSinceActivity = daysSinceLogin + Math.floor(Math.random() * 10);
    const lastActivity = new Date(now.getTime() - daysSinceActivity * 24 * 60 * 60 * 1000).toISOString();

    const utilizationScore = daysSinceActivity > 90 ? 0 : daysSinceActivity > 30 ? Math.floor(Math.random() * 40) : 50 + Math.floor(Math.random() * 50);

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
    });
  }
  return users;
}

export const mockUsers = generateMockUsers(500);

export const mockInsights = [
  { id: '1', title: 'Dormant E5 Users', description: 'Users with E5 licenses showing no activity in 90+ days.', count: mockUsers.filter(u => u.assignedLicenses.includes('E5') && new Date(u.lastActivity).getTime() < Date.now() - 90 * 24 * 60 * 60 * 1000).length, savings: 3800, action: 'Reclaim' },
  { id: '2', title: 'Disabled Accounts with Licenses', description: 'Accounts marked as disabled but still consuming active licenses.', count: mockUsers.filter(u => u.status === 'Disabled' && u.assignedLicenses.length > 0).length, savings: 1250, action: 'Reclaim' },
  { id: '3', title: 'Shared Mailboxes with Premium', description: 'Shared Mailboxes incorrectly assigned E3/E5 instead of Exchange Online Plan 2.', count: mockUsers.filter(u => u.userType === 'Shared Mailbox' && (u.assignedLicenses.includes('E3') || u.assignedLicenses.includes('E5'))).length, savings: 800, action: 'Downgrade' },
  { id: '4', title: 'E5 Downgrade Candidates', description: 'Active E5 users who only utilize E3 workloads (Exchange, Basic Teams).', count: 45, savings: 675, action: 'Downgrade' },
];
