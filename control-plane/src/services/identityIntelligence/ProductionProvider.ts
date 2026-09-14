import type { IIdentityDataProvider, IdentityHealthScore, KPI, Insight, IdentityIssue, IdentityUser } from './types';

export class ProductionIdentityDataProvider implements IIdentityDataProvider {
  isConfigured = false;

  healthScore: IdentityHealthScore = {
    overall: 0, security: 0, access: 0, lifecycle: 0, licenseEfficiency: 0, userExperience: 0,
    trends: { overall: 0, security: 0, access: 0, lifecycle: 0, licenseEfficiency: 0, userExperience: 0 },
    explanation: ''
  };
  kpis: KPI[] = [];
  insights: Insight[] = [];
  issues: IdentityIssue[] = [];
  users: IdentityUser[] = [];

  async refreshData() {
    if (!this.isConfigured) {
      // Do nothing, state remains unconfigured
      return Promise.resolve();
    }
    // Future: Call Graph API here
    return Promise.resolve();
  }
}
