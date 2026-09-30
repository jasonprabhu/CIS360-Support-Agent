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

export interface IntelligenceScenario {
  id: string;
  query: string;
  title: string;
  domain: string;
  category: 'Critical' | 'Attention' | 'Opportunity';
  timestamp: string;
  signal: {
    title: string;
    metricBadge: string;
    description: string;
    timestamp: string;
    affectedScope: string;
    impactSummary: string;
  };
  pattern: {
    title: string;
    correlationText: string;
    telemetryPoints: { label: string; value: number; baseline: number }[];
    relatedComponents: string[];
    affectedUsersCount: number;
  };
  insight: {
    title: string;
    causalExplanation: string;
    rootCause: string;
    confidence: number;
    riskLevel: 'Critical' | 'High' | 'Medium';
    technicalFacts: string[];
  };
  recommendation: {
    title: string;
    steps: string[];
    ticketDeflectionForecast: number;
    downtimeAvoidedHours: number;
    laborHoursSaved: number;
  };
  action: {
    label: string;
    executionType: 'auto-replay' | 'conditional-access' | 'qos-throttle';
    auditNumber: string;
    successMessage: string;
    affectedResource: string;
  };
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
  scenarios: IntelligenceScenario[];
}

export interface IWorkplaceIntelligenceProvider {
  isMockMode: boolean;
  data: MasterIntelligenceData;
  isLoading: boolean;
  role: string;
  setRole: (role: string) => void;
  refreshData: () => Promise<void>;
  toggleMockMode: () => void;
  selectedScenario: IntelligenceScenario | null;
  setSelectedScenario: (scenario: IntelligenceScenario | null) => void;
  isDeepDiveOpen: boolean;
  setIsDeepDiveOpen: (open: boolean) => void;
  remediationStatus: 'idle' | 'executing' | 'success';
  executeRemediation: (scenarioId: string) => Promise<void>;
  resetRemediation: () => void;
}

