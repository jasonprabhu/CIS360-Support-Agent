import type { 
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
