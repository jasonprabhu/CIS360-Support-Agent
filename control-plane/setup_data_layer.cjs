const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const servicesDir = path.join(srcDir, 'services', 'identityIntelligence');
const pagesDir = path.join(srcDir, 'pages', 'IdentityIntelligence');
const componentsDir = path.join(pagesDir, 'components');

[servicesDir, pagesDir, componentsDir].forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
    console.log('Created dir ' + d);
  }
});

// types.ts
const typesCode = `export interface IdentityHealthScore {
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
`;
fs.writeFileSync(path.join(servicesDir, 'types.ts'), typesCode);

// MockProvider.ts
const mockProviderCode = `import { IIdentityDataProvider, IdentityHealthScore, KPI, Insight, IdentityIssue, IdentityUser } from './types';

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

  kpis: KPI[] = [
    { title: 'Total Identities', value: '12,482', trend: 2.8, status: 'neutral' },
    { title: 'Risky Identities', value: 34, trend: -12.4, status: 'good' },
    { title: 'MFA Coverage', value: '97.2%', trend: 1.8, status: 'good' },
    { title: 'Privileged Users', value: 142, trend: 0, status: 'warning' },
    { title: 'Inactive Users', value: 891, trend: -4.1, status: 'warning' },
    { title: 'Guest Users', value: '3,214', trend: 14.2, status: 'neutral' },
    { title: 'License Utilization', value: '88.4%', trend: -2.1, status: 'warning' },
    { title: 'Identity Issues', value: 214, trend: -8.3, status: 'good' },
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
        id: \`u\${i}\`,
        name: \`Mock User \${i}\`,
        email: \`user\${i}@company.com\`,
        department: depts[Math.floor(seededRandom(i * 2) * depts.length)],
        role: roles[Math.floor(seededRandom(i * 3) * roles.length)],
        manager: \`Manager \${Math.floor(seededRandom(i * 4) * 20)}\`,
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
`;
fs.writeFileSync(path.join(servicesDir, 'MockProvider.ts'), mockProviderCode);

// ProductionProvider.ts
const prodProviderCode = `import { IIdentityDataProvider, IdentityHealthScore, KPI, Insight, IdentityIssue, IdentityUser } from './types';

export class ProductionIdentityDataProvider implements IIdentityDataProvider {
  isConfigured = false;

  healthScore: IdentityHealthScore = {
    overall: 0, security: 0, access: 0, lifecycle: 0, licenseEfficiency: 0, userExperience: 0,
    trends: { overall: 0, security: 0, access: 0, lifecycle: 0, licenseEfficiency: 0, userExperience: 0 },
    explanation: ''
  };
  kpis: KPI[] = [];
  insights: Insight[] = [];
  issues: IdentityIssue[] = [];
  users: IdentityUser[] = [];

  async refreshData() {
    if (!this.isConfigured) {
      // Do nothing, state remains unconfigured
      return Promise.resolve();
    }
    // Future: Call Graph API here
    return Promise.resolve();
  }
}
`;
fs.writeFileSync(path.join(servicesDir, 'ProductionProvider.ts'), prodProviderCode);

// IdentityDataProvider.tsx
const contextCode = `import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IIdentityDataProvider } from './types';
import { MockIdentityDataProvider } from './MockProvider';
import { ProductionIdentityDataProvider } from './ProductionProvider';

interface IdentityContextType {
  data: IIdentityDataProvider;
  isMockMode: boolean;
  setMockMode: (mock: boolean) => void;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const IdentityContext = createContext<IdentityContextType | undefined>(undefined);

export const IdentityDataProvider = ({ children }: { children: ReactNode }) => {
  const [isMockMode, setMockMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IIdentityDataProvider>(new MockIdentityDataProvider());

  useEffect(() => {
    const provider = isMockMode ? new MockIdentityDataProvider() : new ProductionIdentityDataProvider();
    setData(provider);
  }, [isMockMode]);

  const refresh = async () => {
    setIsLoading(true);
    await data.refreshData();
    setIsLoading(false);
  };

  return (
    <IdentityContext.Provider value={{ data, isMockMode, setMockMode, isLoading, refresh }}>
      {children}
    </IdentityContext.Provider>
  );
};

export const useIdentityData = () => {
  const context = useContext(IdentityContext);
  if (context === undefined) {
    throw new Error('useIdentityData must be used within an IdentityDataProvider');
  }
  return context;
};
`;
fs.writeFileSync(path.join(servicesDir, 'IdentityDataProvider.tsx'), contextCode);
console.log('Data layer setup complete.');
