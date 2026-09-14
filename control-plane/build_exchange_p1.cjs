const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const servicesDir = path.join(srcDir, 'services', 'exchangeIntelligence');

if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir, { recursive: true });
}

// 1. types.ts
const typesCode = `export interface KPI {
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
`;
fs.writeFileSync(path.join(servicesDir, 'types.ts'), typesCode);

// 2. MockProvider.ts
const mockProviderCode = `import type { 
  IExchangeDataProvider, KPI, Insight, HybridHealth, 
  RegionConnectivity, StorageArchiveMetrics, EOPMetrics, 
  AppMailbox, SupportIntelligence 
} from './types';

const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export class MockExchangeDataProvider implements IExchangeDataProvider {
  isConfigured = true;

  private generateTrendData(start: number, end: number, volatility: number = 10): number[] {
    const data = [];
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const val = start + (end - start) * progress;
      const noise = (Math.random() - 0.5) * volatility;
      data.push(Math.max(0, val + noise));
    }
    return data;
  }

  kpis: KPI[] = [
    { title: 'Total Mailboxes', value: '14,281', trend: 1.2, status: 'neutral', history: this.generateTrendData(14100, 14281) },
    { title: 'Total Storage (Cloud)', value: '142 TB', trend: 4.8, status: 'warning', history: this.generateTrendData(135, 142) },
    { title: 'EOP Block Rate', value: '94.2%', trend: 0.8, status: 'good', history: this.generateTrendData(92, 94.2) },
    { title: 'App Mailboxes Throttled', value: 12, trend: 14.0, status: 'critical', history: this.generateTrendData(2, 12, 3) },
    { title: 'Inactive Mailboxes', value: 412, trend: -2.4, status: 'good', history: this.generateTrendData(440, 412) },
    { title: 'External Forwarding', value: 89, trend: 12.5, status: 'critical', history: this.generateTrendData(60, 89) },
    { title: '3rd Party Archive Sync', value: '99.9%', trend: 0, status: 'good', history: this.generateTrendData(99.9, 99.9, 0.1) },
    { title: 'Exchange Tickets', value: 342, trend: -8.1, status: 'good', history: this.generateTrendData(380, 342) },
  ];

  insights: Insight[] = [
    { id: '1', severity: 'Critical', message: 'Application mailbox "svc-marketing-crm" is hitting SMTP relay throttling limits.', impact: 'Outbound emails delayed', timestamp: '1 hour ago' },
    { id: '2', severity: 'Attention Required', message: 'APAC Region (Singapore node) showing elevated OWA latency (450ms).', impact: 'Poor user experience for 840 users', timestamp: '3 hours ago' },
    { id: '3', severity: 'Cost Optimization', message: '412 Inactive Mailboxes can be converted to Shared Mailboxes.', impact: '₹6.2L / month avoidable cost', timestamp: '1 day ago' },
    { id: '4', severity: 'Emerging Pattern', message: 'Inbound phishing attempts targeting Executive VIPs increased 45%.', impact: 'High Security Risk', timestamp: '5 hours ago' },
    { id: '5', severity: 'Improvement', message: 'Enterprise Vault ingestion rate stabilized at 1.2 TB/day.', impact: 'Compliance SLAs met', timestamp: '1 week ago' },
  ];

  hybridHealth: HybridHealth = {
    m365Status: 'Healthy',
    onPremServers: [
      { name: 'EXCH-MBX-01', status: 'Healthy', role: 'Mailbox', uptime: '94 days' },
      { name: 'EXCH-MBX-02', status: 'Warning', role: 'Mailbox', uptime: '94 days' },
      { name: 'EXCH-EDGE-01', status: 'Healthy', role: 'Edge Transport', uptime: '12 days' },
    ],
    adSyncStatus: 'Healthy',
    lastSync: '2 minutes ago'
  };

  regionConnectivity: RegionConnectivity[] = [
    { region: 'AMER (East)', latencyMs: 42, status: 'Healthy', activeConnections: 4520, protocols: { outlook: 95, owa: 99, activesync: 98, ews: 100 } },
    { region: 'AMER (West)', latencyMs: 58, status: 'Healthy', activeConnections: 3100, protocols: { outlook: 96, owa: 98, activesync: 97, ews: 99 } },
    { region: 'EMEA (London)', latencyMs: 72, status: 'Healthy', activeConnections: 5210, protocols: { outlook: 94, owa: 97, activesync: 98, ews: 99 } },
    { region: 'APAC (Singapore)', latencyMs: 450, status: 'Warning', activeConnections: 1420, protocols: { outlook: 82, owa: 74, activesync: 88, ews: 92 } },
  ];

  storageMetrics: StorageArchiveMetrics = {
    cloudPrimaryTB: 142.4,
    cloudArchiveTB: 84.1,
    onPremTB: 24.5,
    thirdPartyArchive: {
      provider: 'Enterprise Vault',
      status: 'Connected',
      ingestedTB: 342.8,
      dailyIngestionGB: 1240
    }
  };

  eopMetrics: EOPMetrics[] = Array.from({ length: 14 }).map((_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    spam: Math.floor(Math.random() * 50000) + 100000,
    malware: Math.floor(Math.random() * 500) + 100,
    phishing: Math.floor(Math.random() * 2000) + 500,
    clean: Math.floor(Math.random() * 200000) + 500000,
  }));

  appMailboxes: AppMailbox[] = [
    { id: 'app1', accountName: 'svc-marketing-crm', type: 'SMTP Relay', department: 'Marketing', dailyVolume: 12500, throttled: true, status: 'Active' },
    { id: 'app2', accountName: 'svc-jira-integration', type: 'EWS', department: 'Engineering', dailyVolume: 4200, throttled: false, status: 'Active' },
    { id: 'app3', accountName: 'svc-hr-onboarding', type: 'Graph API', department: 'HR', dailyVolume: 850, throttled: false, status: 'Active' },
    { id: 'app4', accountName: 'svc-legacy-erp', type: 'SMTP Relay', department: 'Finance', dailyVolume: 18000, throttled: false, status: 'Active' },
    { id: 'app5', accountName: 'svc-helpdesk-parser', type: 'Graph API', department: 'IT', dailyVolume: 3200, throttled: false, status: 'Active' },
  ];

  supportIntelligence: SupportIntelligence = {
    openTickets: 42,
    avgResolutionHours: 4.2,
    topCategories: [
      { category: 'Outlook Disconnected', count: 142, trend: 12.4 },
      { category: 'Mailbox Full', count: 84, trend: -4.2 },
      { category: 'Mobile Sync Issue', count: 56, trend: 2.1 },
      { category: 'Message Tracking', count: 42, trend: -1.4 },
    ],
    ticketTrend: Array.from({ length: 14 }).map((_, i) => ({
      date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tickets: Math.floor(Math.random() * 40) + 20
    }))
  };

  async refreshData() {
    return new Promise<void>(resolve => setTimeout(resolve, 800));
  }
}
`;
fs.writeFileSync(path.join(servicesDir, 'MockProvider.ts'), mockProviderCode);

// 3. ProductionProvider.ts
const prodProviderCode = `import type { 
  IExchangeDataProvider, KPI, Insight, HybridHealth, 
  RegionConnectivity, StorageArchiveMetrics, EOPMetrics, 
  AppMailbox, SupportIntelligence 
} from './types';

export class ProductionExchangeDataProvider implements IExchangeDataProvider {
  isConfigured = false;
  kpis: KPI[] = [];
  insights: Insight[] = [];
  hybridHealth: HybridHealth = { m365Status: 'Down', onPremServers: [], adSyncStatus: 'Failed', lastSync: '' };
  regionConnectivity: RegionConnectivity[] = [];
  storageMetrics: StorageArchiveMetrics = { cloudPrimaryTB: 0, cloudArchiveTB: 0, onPremTB: 0, thirdPartyArchive: { provider: '', status: 'Disconnected', ingestedTB: 0, dailyIngestionGB: 0 } };
  eopMetrics: EOPMetrics[] = [];
  appMailboxes: AppMailbox[] = [];
  supportIntelligence: SupportIntelligence = { openTickets: 0, avgResolutionHours: 0, topCategories: [], ticketTrend: [] };

  async refreshData() {
    return Promise.resolve();
  }
}
`;
fs.writeFileSync(path.join(servicesDir, 'ProductionProvider.ts'), prodProviderCode);

// 4. ExchangeDataProvider.tsx
const contextCode = `import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { IExchangeDataProvider } from './types';
import { MockExchangeDataProvider } from './MockProvider';
import { ProductionExchangeDataProvider } from './ProductionProvider';

interface ExchangeContextType {
  data: IExchangeDataProvider;
  isMockMode: boolean;
  setMockMode: (mock: boolean) => void;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

export const ExchangeDataProvider = ({ children }: { children: ReactNode }) => {
  const [isMockMode, setMockMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IExchangeDataProvider>(new MockExchangeDataProvider());

  useEffect(() => {
    const provider = isMockMode ? new MockExchangeDataProvider() : new ProductionExchangeDataProvider();
    setData(provider);
  }, [isMockMode]);

  const refresh = async () => {
    setIsLoading(true);
    await data.refreshData();
    setIsLoading(false);
  };

  return (
    <ExchangeContext.Provider value={{ data, isMockMode, setMockMode, isLoading, refresh }}>
      {children}
    </ExchangeContext.Provider>
  );
};

export const useExchangeData = () => {
  const context = useContext(ExchangeContext);
  if (context === undefined) {
    throw new Error('useExchangeData must be used within an ExchangeDataProvider');
  }
  return context;
};
`;
fs.writeFileSync(path.join(servicesDir, 'ExchangeDataProvider.tsx'), contextCode);

console.log('Exchange Data Layer Setup Complete');
