import type { ISharePointDataProvider, KPI, Insight, HealthScore, ContentActivityData, Site, StorageWaste, StorageHotspot } from './types';

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

  contentActivity: ContentActivityData[] = Array.from({ length: 14 }).map((_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    viewed: Math.floor(Math.random() * 50000) + 100000,
    modified: Math.floor(Math.random() * 15000) + 20000,
    shared: Math.floor(Math.random() * 2000) + 1000,
    deleted: Math.floor(Math.random() * 500) + 100,
  }));

  sites: Site[] = [
    { id: 's1', name: 'Finance Portal', owner: 'sarah.connor@company.com', activity: 'High', storageGB: 1840, externalSharing: true, health: 72, issues: 3, anomaly: 'Finance Portal experienced 4.8x its normal download volume in the last 24 hours.' },
    { id: 's2', name: 'HR Documents', owner: 'mike.ross@company.com', activity: 'Medium', storageGB: 450, externalSharing: false, health: 94, issues: 0 },
    { id: 's3', name: 'Project Phoenix', owner: 'Unassigned', activity: 'Inactive', storageGB: 1200, externalSharing: true, health: 41, issues: 5 },
    { id: 's4', name: 'Engineering Specs', owner: 'jason.prabhu@company.com', activity: 'High', storageGB: 3420, externalSharing: true, health: 88, issues: 1 },
    { id: 's5', name: 'Marketing Assets', owner: 'diana.prince@company.com', activity: 'Medium', storageGB: 5800, externalSharing: true, health: 79, issues: 2 },
  ];

  oneDriveDistribution = [
    { range: '<10 GB', count: 1840 },
    { range: '10–50 GB', count: 950 },
    { range: '50–100 GB', count: 420 },
    { range: '100–500 GB', count: 180 },
    { range: '> 500 GB', count: 30 },
  ];

  storageWaste: StorageWaste[] = [
    { category: 'Inactive content', tb: 7.4 },
    { category: 'Large unused files', tb: 3.1 },
    { category: 'Abandoned sites', tb: 1.6 },
    { category: 'Duplicate content', tb: 0.7 },
  ];

  storageHotspots: StorageHotspot[] = [
    { name: 'Marketing Assets', type: 'Site', sizeGB: 5800, growthPercent: 12.4, lastActivity: 'Today' },
    { name: 'Engineering Specs', type: 'Site', sizeGB: 3420, growthPercent: 4.1, lastActivity: 'Today' },
    { name: 'Finance Portal', type: 'Site', sizeGB: 1840, growthPercent: 18.2, lastActivity: 'Today' },
    { name: 'Anita Borg (ODFB)', type: 'OneDrive', sizeGB: 840, growthPercent: 24.1, lastActivity: '2 days ago' },
    { name: 'Project Phoenix', type: 'Site', sizeGB: 1200, growthPercent: 0, lastActivity: '7 months ago' },
  ];

  async refreshData() {
    return new Promise<void>(resolve => setTimeout(resolve, 800));
  }
}
