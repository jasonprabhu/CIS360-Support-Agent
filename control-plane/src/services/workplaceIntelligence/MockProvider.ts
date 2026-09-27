import type { MasterIntelligenceData } from './types';

export const mockWorkplaceData: MasterIntelligenceData = {
  pulse: {
    healthScore: 87,
    domains: [
      { name: 'Identity', health: 92, trend: '+1.2%', signal: 'Stable', alerts: 2 },
      { name: 'Collaboration', health: 89, trend: '+4.2%', signal: 'High Activity', alerts: 0 },
      { name: 'Communication', health: 86, trend: '-0.8%', signal: 'Normal', alerts: 1 },
      { name: 'Content', health: 94, trend: '+0.5%', signal: 'Optimized', alerts: 0 },
      { name: 'Productivity', health: 88, trend: '+7.1%', signal: 'Adoption Growing', alerts: 3 },
      { name: 'AI', health: 96, trend: '+18.4%', signal: 'Accelerating', alerts: 0 },
    ],
  },
  services: [
    { name: 'Identity', health: 92, trend: '↑ 1.2%', signal: 'MFA Success 99%' },
    { name: 'Teams', health: 89, trend: '↑ 4.2%', signal: 'Meetings +12%' },
    { name: 'Exchange', health: 86, trend: '→ 0.8%', signal: 'Mailflow Stable' },
    { name: 'SharePoint', health: 94, trend: '↑ 0.5%', signal: 'Storage Optimized' },
    { name: 'OneDrive', health: 95, trend: '↑ 1.1%', signal: 'Sync Errors < 1%' },
    { name: 'Power Platform', health: 88, trend: '↑ 7.1%', signal: 'Makers +14%' },
    { name: 'Copilot', health: 96, trend: '↑ 18.4%', signal: 'Usage Spiking' },
  ],
  signals: [
    { id: '1', severity: 'ai', domain: 'AI / Copilot', explanation: 'AI adoption accelerating across Sales and Marketing business units.', trend: '↑ 18% WOW', timestamp: '10m ago', actionText: 'View Adoption' },
    { id: '2', severity: 'attention', domain: 'Identity', explanation: 'Failed authentication activity is slightly above the 30-day baseline.', trend: '↑ 4% spikes', timestamp: '1h ago', actionText: 'Investigate Auth' },
    { id: '3', severity: 'healthy', domain: 'Exchange', explanation: 'Repeated mailbox-related support requests have decreased.', trend: '↓ 12% WoW', timestamp: '3h ago', actionText: 'View Tickets' },
    { id: '4', severity: 'critical', domain: 'Teams', explanation: 'Cluster of repeated meeting access issues detected in EMEA region.', trend: 'Warning', timestamp: '4h ago', actionText: 'Analyze Friction' },
  ],
  friction: [
    { name: 'Identity', totalIssues: 124, issues: [{ name: 'MFA Setup', count: 45 }, { name: 'Password Reset', count: 52 }, { name: 'Group Access', count: 27 }] },
    { name: 'Teams', totalIssues: 89, issues: [{ name: 'Meeting Join', count: 41 }, { name: 'Guest Access', count: 32 }, { name: 'Audio/Video', count: 16 }] },
    { name: 'Exchange', totalIssues: 65, issues: [{ name: 'Shared Mailbox', count: 35 }, { name: 'Sync Issues', count: 20 }, { name: 'Spam Filter', count: 10 }] },
    { name: 'Power Platform', totalIssues: 112, issues: [{ name: 'Connector Fails', count: 68 }, { name: 'DLP Blocks', count: 24 }, { name: 'Premium License', count: 20 }] },
  ],
  automation: [
    { domain: 'Identity', recurringRequests: 32, automationsAvailable: 14, effortSaved: '18 hrs/mo' },
    { domain: 'Teams', recurringRequests: 21, automationsAvailable: 11, effortSaved: '12 hrs/mo' },
    { domain: 'Exchange', recurringRequests: 18, automationsAvailable: 8, effortSaved: '9 hrs/mo' },
    { domain: 'SharePoint', recurringRequests: 9, automationsAvailable: 5, effortSaved: '4 hrs/mo' },
  ],
  actions: [
    { id: 'A1', category: 'Critical', domain: 'Teams', issue: 'Repeated Meeting Access Issues', evidence: '47 related requests in the last 7 days.', impact: 'High user friction in EMEA', recommendedStep: 'Investigate Routing' },
    { id: 'A2', category: 'Attention', domain: 'Power Platform', issue: 'Orphaned Premium Flows', evidence: '14 flows failing due to disabled owner accounts.', impact: 'Broken business processes', recommendedStep: 'Reassign Owners' },
    { id: 'A3', category: 'Opportunity', domain: 'Identity', issue: 'Automate Guest Access', evidence: '32 manual guest access requests this week.', impact: 'Save 18 hours per month', recommendedStep: 'Deploy Workflow' },
  ],
  briefing: [
    'Teams collaboration activity increased significantly in the last 24 hours.',
    'Authentication friction is elevated for a subset of users in EMEA.',
    'Several recurring support requests have matching automations available in the Hub.',
  ]
};
