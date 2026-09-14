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

export interface ISharePointDataProvider {
  isConfigured: boolean;
  healthScore: HealthScore;
  kpis: KPI[];
  insights: Insight[];
  refreshData: () => Promise<void>;
}
