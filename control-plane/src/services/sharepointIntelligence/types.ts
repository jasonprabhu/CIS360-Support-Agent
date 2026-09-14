export interface KPI {
  id: string;
  title: string;
  value: string | number;
  trend: number;
  status?: 'good' | 'warning' | 'critical' | 'neutral';
  category: 'Content' | 'Collaboration' | 'Security';
}

export interface Dimension {
  name: string;
  score: number;
  trend: number;
}

export interface HealthScore {
  overall: number;
  explanation: string;
  dimensions: Dimension[];
}

export interface Insight {
  id: string;
  severity: 'Critical' | 'Attention Required' | 'Emerging Pattern' | 'Improvement';
  message: string;
  impact: string;
  affected: string;
  timestamp: string;
  recommendedAction: string;
}

export interface ContentActivityData {
  date: string;
  viewed: number;
  modified: number;
  shared: number;
  deleted: number;
}

export interface Site {
  id: string;
  name: string;
  owner: string;
  activity: 'High' | 'Medium' | 'Low' | 'Inactive';
  storageGB: number;
  externalSharing: boolean;
  health: number;
  issues: number;
  anomaly?: string;
}

export interface StorageWaste {
  category: string;
  tb: number;
}

export interface StorageHotspot {
  name: string;
  type: 'Site' | 'OneDrive';
  sizeGB: number;
  growthPercent: number;
  lastActivity: string;
}

export interface AccessNode {
  name: string;
  type: 'User' | 'Group' | 'Site' | 'Folder' | 'File';
  role?: string;
}

export interface GovernanceCompliance {
  overall: number;
  ownership: number;
  sharing: number;
  lifecycle: number;
  permissions: number;
  storage: number;
}

export interface LifecycleAging {
  range: string;
  tb: number;
}

export interface ISharePointDataProvider {
  isConfigured: boolean;
  healthScore: HealthScore;
  kpis: KPI[];
  insights: Insight[];
  contentActivity: ContentActivityData[];
  sites: Site[];
  oneDriveDistribution: { range: string; count: number }[];
  storageWaste: StorageWaste[];
  storageHotspots: StorageHotspot[];
  sharingMetrics: { anonymous: number; specificExternal: number; guest: number; internal: number };
  accessPath: AccessNode[];
  governance: GovernanceCompliance;
  lifecycleAging: LifecycleAging[];
  refreshData: () => Promise<void>;
}
