const fs = require('fs');
const path = require('path');
const servicesDir = path.join(__dirname, 'src', 'services', 'identityIntelligence');
const componentsDir = path.join(__dirname, 'src', 'pages', 'IdentityIntelligence', 'components');

let mockPath = path.join(servicesDir, 'MockProvider.ts');
let mockContent = fs.readFileSync(mockPath, 'utf8');
mockContent = mockContent.replace(
  /import type \{ [^\}]+ \} from '\.\/types';/,
  "import type { IIdentityDataProvider, IdentityHealthScore, KPI, Insight, IdentityIssue, IdentityUser, RiskMetric, RiskDistribution, LifecycleMetrics, LicenseMetrics, ExperienceScore } from './types';"
);
fs.writeFileSync(mockPath, mockContent);

let raPath = path.join(componentsDir, 'RiskAndAccess.tsx');
let raContent = fs.readFileSync(raPath, 'utf8');
raContent = raContent.replace('entry, index', '_, index');
fs.writeFileSync(raPath, raContent);

let uxPath = path.join(componentsDir, 'UserExperience.tsx');
let uxContent = fs.readFileSync(uxPath, 'utf8');
uxContent = uxContent.replace('LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell', 'LineChart, Line, XAxis, Tooltip, ResponsiveContainer');
fs.writeFileSync(uxPath, uxContent);
