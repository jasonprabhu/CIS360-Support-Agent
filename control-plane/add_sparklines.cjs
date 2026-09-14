const fs = require('fs');
const path = require('path');
const servicesDir = path.join(__dirname, 'src', 'services', 'identityIntelligence');
const componentsDir = path.join(__dirname, 'src', 'pages', 'IdentityIntelligence', 'components');

// 1. Update types.ts
let typesStr = fs.readFileSync(path.join(servicesDir, 'types.ts'), 'utf8');
typesStr = typesStr.replace("status?: 'good' | 'warning' | 'critical' | 'neutral';", "status?: 'good' | 'warning' | 'critical' | 'neutral';\n  history?: number[];");
fs.writeFileSync(path.join(servicesDir, 'types.ts'), typesStr);

// 2. Update MockProvider.ts
let mockStr = fs.readFileSync(path.join(servicesDir, 'MockProvider.ts'), 'utf8');

const kpiGenCode = `
  private generateTrendData(start: number, end: number, volatility: number = 10): number[] {
    const data = [];
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      // Linear interpolation + noise
      const val = start + (end - start) * progress;
      const noise = (seededRandom(i * 100) - 0.5) * volatility;
      data.push(Math.max(0, val + noise));
    }
    return data;
  }

  kpis: KPI[] = [
    { title: 'Total Identities', value: '12,482', trend: 2.8, status: 'neutral', history: this.generateTrendData(12000, 12482) },
    { title: 'Risky Identities', value: 34, trend: -12.4, status: 'good', history: this.generateTrendData(45, 34) },
    { title: 'MFA Coverage', value: '97.2%', trend: 1.8, status: 'good', history: this.generateTrendData(93, 97.2) },
    { title: 'Privileged Users', value: 142, trend: 0, status: 'warning', history: this.generateTrendData(142, 142, 5) },
    { title: 'Inactive Users', value: 891, trend: -4.1, status: 'warning', history: this.generateTrendData(940, 891) },
    { title: 'Guest Users', value: '3,214', trend: 14.2, status: 'neutral', history: this.generateTrendData(2800, 3214) },
    { title: 'License Utilization', value: '88.4%', trend: -2.1, status: 'warning', history: this.generateTrendData(92, 88.4) },
    { title: 'Identity Issues', value: 214, trend: -8.3, status: 'good', history: this.generateTrendData(250, 214) },
  ];
`;

mockStr = mockStr.replace(/kpis: KPI\[\] = \[[\s\S]*?\];/, kpiGenCode.trim());
fs.writeFileSync(path.join(servicesDir, 'MockProvider.ts'), mockStr);

// 3. Update KPIGrid.tsx
let kpiGridStr = fs.readFileSync(path.join(componentsDir, 'KPIGrid.tsx'), 'utf8');

// Add Recharts import
kpiGridStr = kpiGridStr.replace(
  "import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';",
  "import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';\nimport { ResponsiveContainer, AreaChart, Area } from 'recharts';"
);

const chartCode = `
  const getTrendColor = (status?: string) => {
    if (status === 'good') return '#16a34a'; // green-600
    if (status === 'warning') return '#ca8a04'; // yellow-600
    if (status === 'critical') return '#dc2626'; // red-600
    return '#6366f1'; // indigo-500 (neutral)
  };

  const renderTrend = (trend: number, status?: string) => {
    let color = 'text-gray-500';
    if (status === 'good') color = 'text-green-600';
    if (status === 'warning') color = 'text-yellow-600';
    if (status === 'critical') color = 'text-red-600';

    const dir = trend > 0 ? '↑' : (trend < 0 ? '↓' : '-');
    return <span className={\`text-xs font-semibold \${color}\`}>{dir} {Math.abs(trend)}%</span>;
  };
`;
kpiGridStr = kpiGridStr.replace(/const renderTrend = [\s\S]*?};\n/, chartCode);

const chartRender = `
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
            
            {kpi.history && (
              <div className="h-10 w-full mt-1 mb-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={kpi.history.map((val, i) => ({ value: val, index: i }))}>
                    <defs>
                      <linearGradient id={\`color-\${idx}\`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getTrendColor(kpi.status)} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={getTrendColor(kpi.status)} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke={getTrendColor(kpi.status)} fillOpacity={1} fill={\`url(#color-\${idx})\`} strokeWidth={2} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-xs">
`;
kpiGridStr = kpiGridStr.replace(/<div>\s*<div className="text-2xl font-bold text-gray-900 mb-1">\{kpi\.value\}<\/div>\s*<div className="flex items-center gap-1\.5 mt-1 text-gray-500 text-xs">/, chartRender);

fs.writeFileSync(path.join(componentsDir, 'KPIGrid.tsx'), kpiGridStr);
console.log('Done modifying KPIGrid, MockProvider, and types');
