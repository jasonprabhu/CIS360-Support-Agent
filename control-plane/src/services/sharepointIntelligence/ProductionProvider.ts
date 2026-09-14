import type { ISharePointDataProvider, KPI, Insight, HealthScore, ContentActivityData, Site, StorageWaste, StorageHotspot } from './types';

export class ProductionSharePointDataProvider implements ISharePointDataProvider {
  isConfigured = false;
  healthScore: HealthScore = { overall: 0, explanation: '', dimensions: [] };
  kpis: KPI[] = [];
  insights: Insight[] = [];
  contentActivity: ContentActivityData[] = [];
  sites: Site[] = [];
  oneDriveDistribution = [];
  storageWaste: StorageWaste[] = [];
  storageHotspots: StorageHotspot[] = [];

  async refreshData() {
    return Promise.resolve();
  }
}
