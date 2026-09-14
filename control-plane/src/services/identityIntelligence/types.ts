export interface IdentityHealthScore {
  overall: number;
  security: number;
  access: number;
  lifecycle: number;
  licenseEfficiency: number;
  userExperience: number;
  trends: {
    overall: number;
    security: number;
    access: number;
    lifecycle: number;
    licenseEfficiency: number;
    userExperience: number;
  };
  explanation: string;
}

export interface KPI {
  title: string;
  value: string | number;
  trend: number; // positive = up, negative = down
  status?: 'good' | 'warning' | 'critical' | 'neutral';
}

export interface Insight {
  id: string;
  severity: 'Critical' | 'Attention Required' | 'Emerging Pattern' | 'Improvement' | 'License Opportunity';
  message: string;
  impact: string;
  timestamp: string;
}

export interface IdentityIssue {
  id: string;
  userId: string;
  userName: string;
  issue: string;
  risk: 'High' | 'Medium' | 'Low';
  impact: string;
  ageDays: number;
  recommendedAction: string;
}

export interface IdentityUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  manager: string;
  status: 'Active' | 'Inactive' | 'Pending';
  riskLevel: 'High' | 'Medium' | 'Low';
  mfaStatus: 'Registered' | 'Pending' | 'Disabled';
  licenses: string[];
}

export interface IIdentityDataProvider {
  isConfigured: boolean;
  healthScore: IdentityHealthScore;
  kpis: KPI[];
  insights: Insight[];
  issues: IdentityIssue[];
  users: IdentityUser[];
  refreshData: () => Promise<void>;
}
