export interface DomainHealth {
  name: string;
  health: number;
  trend: string;
  signal: string;
  alerts: number;
}

export interface ServicePulse {
  name: string;
  health: number;
  trend: string;
  signal: string;
}

export interface WorkplaceSignal {
  id: string;
  severity: 'healthy' | 'attention' | 'critical' | 'informational' | 'ai';
  domain: string;
  explanation: string;
  trend: string;
  timestamp: string;
  actionText: string;
}

export interface FrictionDomain {
  name: string;
  totalIssues: number;
  issues: { name: string; count: number }[];
}

export interface AutomationOpp {
  domain: string;
  recurringRequests: number;
  automationsAvailable: number;
  effortSaved: string;
}

export interface ActionItem {
  id: string;
  category: 'Critical' | 'Attention' | 'Opportunity';
  domain: string;
  issue: string;
  evidence: string;
  impact: string;
  recommendedStep: string;
}

export interface MasterIntelligenceData {
  pulse: {
    healthScore: number;
    domains: DomainHealth[];
  };
  services: ServicePulse[];
  signals: WorkplaceSignal[];
  friction: FrictionDomain[];
  automation: AutomationOpp[];
  actions: ActionItem[];
  briefing: string[];
}

export interface IWorkplaceIntelligenceProvider {
  isMockMode: boolean;
  data: MasterIntelligenceData;
  isLoading: boolean;
  role: string;
  setRole: (role: string) => void;
  refreshData: () => Promise<void>;
  toggleMockMode: () => void;
}
