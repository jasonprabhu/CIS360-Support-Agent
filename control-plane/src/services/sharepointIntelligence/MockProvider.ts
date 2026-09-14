import type { ISharePointDataProvider, KPI, Insight, HealthScore } from './types';

export class MockSharePointDataProvider implements ISharePointDataProvider {
  isConfigured = true;

  healthScore: HealthScore = {
    overall: 84,
    explanation: 'Content health improved 4.1% this month. Sharing risk decreased, but 37 inactive SharePoint sites and 214 externally shared files require attention.',
    dimensions: [
      { name: 'Security', score: 91, trend: 2.1 },
      { name: 'Collaboration', score: 87, trend: 1.4 },
      { name: 'Governance', score: 76, trend: -3.2 },
      { name: 'Storage Efficiency', score: 81, trend: 4.5 },
      { name: 'User Experience', score: 85, trend: 1.1 },
    ]
  };

  kpis: KPI[] = [
    { id: '1', category: 'Content', title: 'Total SharePoint Sites', value: '1,284', trend: 3.2, status: 'neutral' },
    { id: '2', category: 'Content', title: 'Active Sites', value: '890', trend: 1.1, status: 'good' },
    { id: '3', category: 'Content', title: 'OneDrive Users', value: '3,420', trend: 4.0, status: 'neutral' },
    { id: '4', category: 'Content', title: 'Total Storage', value: '84.2 TB', trend: 2.1, status: 'neutral' },
    { id: '5', category: 'Content', title: 'Storage Growth', value: '1.2 TB/mo', trend: -0.5, status: 'good' },
    
    { id: '6', category: 'Collaboration', title: 'Active Files', value: '142k', trend: 12.0, status: 'good' },
    { id: '7', category: 'Collaboration', title: 'External Shares', value: '2,481', trend: 14.8, status: 'warning' },
    { id: '8', category: 'Collaboration', title: 'Inactive Content', value: '18.6 TB', trend: 8.4, status: 'warning' },
    
    { id: '9', category: 'Security', title: 'Sensitive/High-Risk', value: '412', trend: -2.0, status: 'good' },
    { id: '10', category: 'Security', title: 'Content Issues', value: '89', trend: 12.4, status: 'critical' },
  ];

  insights: Insight[] = [
    { id: '1', severity: 'Critical', message: '214 externally shared files contain sensitive business information.', impact: 'High risk of data exfiltration or regulatory breach.', affected: '214 files across 12 sites', timestamp: '2 hours ago', recommendedAction: 'Revoke external links for sensitive files' },
    { id: '2', severity: 'Attention Required', message: '37 SharePoint sites have had no meaningful activity for more than 180 days.', impact: 'Wasted storage quota and governance clutter.', affected: '37 Sites (4.2 TB)', timestamp: '1 day ago', recommendedAction: 'Initiate archival workflow' },
    { id: '3', severity: 'Emerging Pattern', message: 'Finance collaboration activity increased 42% this month.', impact: 'Expected storage spikes in Finance sector.', affected: 'Finance Portal & related sites', timestamp: '3 days ago', recommendedAction: 'Review storage quotas for Finance' },
    { id: '4', severity: 'Improvement', message: 'External sharing reduced by 18% after the latest policy change.', impact: 'Reduced attack surface.', affected: 'Tenant-wide', timestamp: '1 week ago', recommendedAction: 'No action needed' },
  ];

  async refreshData() {
    return new Promise<void>(resolve => setTimeout(resolve, 800));
  }
}
