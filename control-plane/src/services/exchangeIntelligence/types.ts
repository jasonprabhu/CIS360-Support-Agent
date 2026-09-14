export interface KPI {
  title: string;
  value: string | number;
  trend: number;
  status?: 'good' | 'warning' | 'critical' | 'neutral';
  history?: number[];
}

export interface Insight {
  id: string;
  severity: 'Critical' | 'Attention Required' | 'Emerging Pattern' | 'Improvement' | 'Cost Optimization';
  message: string;
  impact: string;
  timestamp: string;
}

export interface HybridHealth {
  m365Status: 'Healthy' | 'Degraded' | 'Down';
  onPremServers: { name: string; status: 'Healthy' | 'Warning' | 'Critical'; role: string; uptime: string }[];
  adSyncStatus: 'Healthy' | 'Delayed' | 'Failed';
  lastSync: string;
}

export interface RegionConnectivity {
  region: string;
  latencyMs: number;
  status: 'Healthy' | 'Warning' | 'Critical';
  activeConnections: number;
  protocols: { outlook: number; owa: number; activesync: number; ews: number };
}

export interface StorageArchiveMetrics {
  cloudPrimaryTB: number;
  cloudArchiveTB: number;
  onPremTB: number;
  thirdPartyArchive: {
    provider: string;
    status: 'Connected' | 'Disconnected' | 'Syncing';
    ingestedTB: number;
    dailyIngestionGB: number;
  };
}

export interface EOPMetrics {
  date: string;
  spam: number;
  malware: number;
  phishing: number;
  clean: number;
}

export interface AppMailbox {
  id: string;
  accountName: string;
  type: 'SMTP Relay' | 'Graph API' | 'EWS';
  department: string;
  dailyVolume: number;
  throttled: boolean;
  status: 'Active' | 'Inactive' | 'Disabled';
}

export interface SupportIntelligence {
  openTickets: number;
  avgResolutionHours: number;
  topCategories: { category: string; count: number; trend: number }[];
  ticketTrend: { date: string; tickets: number }[];
}

export interface IExchangeDataProvider {
  isConfigured: boolean;
  kpis: KPI[];
  insights: Insight[];
  hybridHealth: HybridHealth;
  regionConnectivity: RegionConnectivity[];
  storageMetrics: StorageArchiveMetrics;
  eopMetrics: EOPMetrics[];
  appMailboxes: AppMailbox[];
  supportIntelligence: SupportIntelligence;
  refreshData: () => Promise<void>;
}
