import type { ISharePointDataProvider, KPI, Insight, HealthScore, ContentActivityData, Site, StorageWaste, StorageHotspot, AccessNode, GovernanceCompliance, LifecycleAging, SupportHotspot, ProblemUser, RootCauseNode } from './types';

export class ProductionSharePointDataProvider implements ISharePointDataProvider {
  isConfigured = false;
  healthScore: HealthScore = { overall: 0, explanation: '', dimensions: [] };
  kpis: KPI[] = []; insights: Insight[] = []; contentActivity: ContentActivityData[] = []; sites: Site[] = []; oneDriveDistribution = []; storageWaste: StorageWaste[] = []; storageHotspots: StorageHotspot[] = []; sharingMetrics = { anonymous: 0, specificExternal: 0, guest: 0, internal: 0 }; accessPath: AccessNode[] = []; governance: GovernanceCompliance = { overall: 0, ownership: 0, sharing: 0, lifecycle: 0, permissions: 0, storage: 0 }; lifecycleAging: LifecycleAging[] = [];
  supportHotspots: SupportHotspot[] = []; problemUsers: ProblemUser[] = []; rootCauseTimeline: RootCauseNode[] = [];

  async refreshData() { return Promise.resolve(); }
}
