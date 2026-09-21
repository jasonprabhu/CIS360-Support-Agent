import type { PPIntelligenceData } from './types';

export const mockPowerPlatformData: PPIntelligenceData = {
  isConfigured: true,
  kpis: {
    environments: 528,
    powerApps: 8343,
    cloudFlows: 22196,
    desktopFlows: 1205,
    agents: 12460,
    dataverseInstances: 25,
    customConnectors: 261,
    activeMakers: 2041,
    supportTickets: 180,
    l2l3Demand: 'High (0.5 FTE)',
    governanceExceptions: 32,
    dlpViolations: 14,
    orphanedAssets: 241,
    inactiveAssets: 1205,
    criticalApps: 112,
  },
  growth: Array.from({ length: 12 }).map((_, i) => ({
    date: new Date(2025, i, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    apps: Math.floor(7400 + (i * 85)), // +12% annual
    flows: Math.floor(19400 + (i * 230)), // +14% annual
    makers: Math.floor(1700 + (i * 28)), // +17% annual
    agents: Math.floor(2000 + (i * i * 80)), // Accelerating
  })),
  estate: [
    { id: '1', name: 'Global Default', type: 'Default', health: 'Attention', riskScore: 72 },
    { id: '2', name: 'France OpCo Prod', type: 'Production', health: 'Healthy', riskScore: 12 },
    { id: '3', name: 'Germany Sandbox', type: 'Sandbox', health: 'Healthy', riskScore: 5 },
    { id: '4', name: 'Legacy HR Data', type: 'Production', health: 'Critical', riskScore: 94 },
  ],
  appsQuadrant: [
    { name: 'Global Payment App', usage: 9500, risk: 85, status: 'Business Critical' },
    { name: 'IT Helpdesk Portal', usage: 8200, risk: 20, status: 'Business Critical' },
    { name: 'Old Survey Tool', usage: 120, risk: 90, status: 'Lifecycle Candidate' },
    { name: 'Team Lunch Picker', usage: 50, risk: 5, status: 'Review' },
  ],
  automationFailures: [
    { name: 'Invoice Processing Flow', environment: 'Global Default', failures: 412, trend: '+45%' },
    { name: 'Onboarding Sync', environment: 'France OpCo Prod', failures: 89, trend: '+12%' },
    { name: 'Orphaned Approval Flow', environment: 'Default', failures: 42, trend: '0%' },
  ],
  makers: [
    { type: 'Explorer (1-2 apps)', count: 1240 },
    { type: 'Builder (3-10 apps)', count: 580 },
    { type: 'Advanced (10+ apps)', count: 180 },
    { type: 'Production (Shared)', count: 41 },
  ],
  governance: [
    { category: 'DLP Policy Violations', count: 14, severity: 'Critical' },
    { category: 'Ownerless Apps', count: 241, severity: 'Attention' },
    { category: 'Unused Premium Licenses', count: 85, severity: 'Recommendation' },
  ],
  agentUsage: [
    { name: 'HR Benefits Copilot', owner: 'HR Team', conversations: 14200, dataverse: true },
    { name: 'IT Support Bot', owner: 'IT Dept', conversations: 9500, dataverse: true },
    { name: 'Test Agent 1', owner: 'Unknown', conversations: 0, dataverse: false },
  ],
  support: [
    { category: 'Connector Failures', tickets: 65, mttr: 4.2 },
    { category: 'Permissions / Access', tickets: 45, mttr: 2.1 },
    { category: 'App Performance', tickets: 35, mttr: 12.5 },
    { category: 'Environment / DLP', tickets: 20, mttr: 24.0 },
    { category: 'Copilot / AI', tickets: 15, mttr: 1.5 },
  ],
  devops: [
    { pipeline: 'France Prod Release', deployments: 42, successRate: 98 },
    { pipeline: 'Global HR Release', deployments: 14, successRate: 85 },
    { pipeline: 'Experimental AI', deployments: 104, successRate: 42 },
  ],
  actions: [
    { id: 'A1', severity: 'Critical', asset: 'Invoice Processing Flow', reason: 'Repeated production flow failure (412 errors)', suggestedAction: 'Review Connector Credentials' },
    { id: 'A2', severity: 'Critical', asset: 'Legacy HR Data Env', reason: 'DLP violation affecting production asset', suggestedAction: 'Quarantine Environment' },
    { id: 'A3', severity: 'Attention', asset: '241 Apps', reason: 'Applications without active owners', suggestedAction: 'Initiate CoE Ownership workflow' },
    { id: 'A4', severity: 'Recommendation', asset: 'Test Agent 1', reason: 'Inactive for 90+ days', suggestedAction: 'Archive' },
  ]
};
