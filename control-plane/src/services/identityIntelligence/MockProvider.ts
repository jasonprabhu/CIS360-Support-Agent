import type { IIdentityDataProvider, IdentityHealthScore, KPI, Insight, IdentityIssue, IdentityUser } from './types';

// Deterministic random generator for consistent mock data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export class MockIdentityDataProvider implements IIdentityDataProvider {
  isConfigured = true;

  healthScore: IdentityHealthScore = {
    overall: 87,
    security: 91,
    access: 84,
    lifecycle: 89,
    licenseEfficiency: 78,
    userExperience: 93,
    trends: {
      overall: 3.4,
      security: 4.2,
      access: -1.2,
      lifecycle: 2.1,
      licenseEfficiency: -3.8,
      userExperience: 1.1
    },
    explanation: 'Identity health improved 3.4% this month, primarily due to increased MFA coverage and reduced inactive accounts. License efficiency remains the biggest opportunity.'
  };

  private generateTrendData(start: number, end: number, volatility: number = 10): number[] {
    const data = [];
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      // Linear interpolation + noise
      const val = start + (end - start) * progress;
      const noise = (seededRandom(i * 100) - 0.5) * volatility;
      data.push(Math.max(0, val + noise));
    }
    return data;
  }

  kpis: KPI[] = [
    { title: 'Total Identities', value: '12,482', trend: 2.8, status: 'neutral', history: this.generateTrendData(12000, 12482) },
    { title: 'Risky Identities', value: 34, trend: -12.4, status: 'good', history: this.generateTrendData(45, 34) },
    { title: 'MFA Coverage', value: '97.2%', trend: 1.8, status: 'good', history: this.generateTrendData(93, 97.2) },
    { title: 'Privileged Users', value: 142, trend: 0, status: 'warning', history: this.generateTrendData(142, 142, 5) },
    { title: 'Inactive Users', value: 891, trend: -4.1, status: 'warning', history: this.generateTrendData(940, 891) },
    { title: 'Guest Users', value: '3,214', trend: 14.2, status: 'neutral', history: this.generateTrendData(2800, 3214) },
    { title: 'License Utilization', value: '88.4%', trend: -2.1, status: 'warning', history: this.generateTrendData(92, 88.4) },
    { title: 'Identity Issues', value: 214, trend: -8.3, status: 'good', history: this.generateTrendData(250, 214) },
  ];

  insights: Insight[] = [
    { id: '1', severity: 'Critical', message: '4 departed employees still have active Microsoft 365 access.', impact: 'High Security Risk', timestamp: '2 hours ago' },
    { id: '2', severity: 'Attention Required', message: '27 users have not completed MFA registration.', impact: 'Compliance Violation', timestamp: '1 day ago' },
    { id: '3', severity: 'License Opportunity', message: '67 E5 licenses have not been used for more than 60 days.', impact: '₹3.8L / month avoidable cost', timestamp: '3 days ago' },
    { id: '4', severity: 'Emerging Pattern', message: 'Authentication failures in Sales increased 38% over the last 7 days.', impact: 'User Friction', timestamp: '5 hours ago' },
    { id: '5', severity: 'Improvement', message: 'MFA coverage increased from 91% to 97% this month.', impact: 'Security Posture +6%', timestamp: '1 week ago' },
  ];

  issues: IdentityIssue[] = [
    { id: '1', userId: 'u1', userName: 'John Smith', issue: 'MFA not configured', risk: 'High', impact: 'Authentication', ageDays: 4, recommendedAction: 'Enforce MFA' },
    { id: '2', userId: 'u2', userName: 'Ravi Kumar', issue: 'Inactive 94 days', risk: 'Medium', impact: 'Account hygiene', ageDays: 94, recommendedAction: 'Review account' },
    { id: '3', userId: 'u3', userName: 'Service-CRM', issue: 'Excessive privileges', risk: 'High', impact: 'Security', ageDays: 12, recommendedAction: 'Review permissions' },
    { id: '4', userId: 'u4', userName: 'Sarah Jenkins', issue: 'Multiple failed sign-ins', risk: 'Medium', impact: 'Security', ageDays: 1, recommendedAction: 'Investigate' },
    { id: '5', userId: 'u5', userName: 'David Chen', issue: 'Unused E5 license', risk: 'Low', impact: 'Cost', ageDays: 62, recommendedAction: 'Downgrade license' },
  ];

  users: IdentityUser[] = [];

  constructor() {
    this.generateUsers();
  }

  private generateUsers() {
    const depts = ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations'];
    const roles = ['Manager', 'Developer', 'Analyst', 'Director', 'Specialist'];
    
    for (let i = 1; i <= 500; i++) {
      const riskRand = seededRandom(i);
      this.users.push({
        id: `u${i}`,
        name: `Mock User ${i}`,
        email: `user${i}@company.com`,
        department: depts[Math.floor(seededRandom(i * 2) * depts.length)],
        role: roles[Math.floor(seededRandom(i * 3) * roles.length)],
        manager: `Manager ${Math.floor(seededRandom(i * 4) * 20)}`,
        status: seededRandom(i * 5) > 0.9 ? 'Inactive' : 'Active',
        riskLevel: riskRand > 0.95 ? 'High' : (riskRand > 0.8 ? 'Medium' : 'Low'),
        mfaStatus: seededRandom(i * 6) > 0.95 ? 'Pending' : 'Registered',
        licenses: ['Microsoft 365 E5']
      });
    }
  }

  async refreshData() {
    // Simulate network delay
    return new Promise<void>(resolve => setTimeout(resolve, 800));
  }
}
