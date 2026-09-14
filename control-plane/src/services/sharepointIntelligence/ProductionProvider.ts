import type { ISharePointDataProvider, KPI, Insight, HealthScore } from './types';

export class ProductionSharePointDataProvider implements ISharePointDataProvider {
  isConfigured = false;
  healthScore: HealthScore = { overall: 0, explanation: '', dimensions: [] };
  kpis: KPI[] = [];
  insights: Insight[] = [];

  async refreshData() {
    return Promise.resolve();
  }
}
