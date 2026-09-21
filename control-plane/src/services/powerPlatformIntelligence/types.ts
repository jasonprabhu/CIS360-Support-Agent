export interface PPIntelligenceData {
  isConfigured: boolean;
  kpis: {
    environments: number;
    powerApps: number;
    cloudFlows: number;
    desktopFlows: number;
    agents: number;
    dataverseInstances: number;
    customConnectors: number;
    activeMakers: number;
  };
  growth: { date: string; apps: number; flows: number; makers: number; agents: number; }[];
  estate: { id: string; name: string; type: string; health: string; riskScore: number; }[];
  appsQuadrant: { name: string; usage: number; risk: number; status: string; }[];
  automationFailures: { name: string; environment: string; failures: number; trend: string; }[];
  makers: { type: string; count: number; }[];
  governance: { category: string; count: number; severity: string; }[];
  agentUsage: { name: string; owner: string; conversations: number; dataverse: boolean; }[];
  support: { category: string; tickets: number; mttr: number; }[];
  devops: { pipeline: string; deployments: number; successRate: number; }[];
  actions: { id: string; severity: 'Critical' | 'Attention' | 'Recommendation'; asset: string; reason: string; suggestedAction: string; }[];
}

export interface IPowerPlatformDataProvider {
  isMockMode: boolean;
  data: PPIntelligenceData;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  toggleMockMode: () => void;
}
