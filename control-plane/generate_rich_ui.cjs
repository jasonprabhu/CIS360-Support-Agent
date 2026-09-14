const fs = require('fs');
const path = require('path');
const servicesDir = path.join(__dirname, 'src', 'services', 'identityIntelligence');
const componentsDir = path.join(__dirname, 'src', 'pages', 'IdentityIntelligence', 'components');

// --- 1. Update Types ---
let typesStr = fs.readFileSync(path.join(servicesDir, 'types.ts'), 'utf8');

const newTypes = `
export interface RiskMetric {
  date: string;
  high: number;
  medium: number;
  low: number;
}

export interface RiskDistribution {
  category: string;
  count: number;
}

export interface LifecycleMetrics {
  newJoiners: number;
  departures: number;
  dormant: number;
  avgOnboardingDays: number;
}

export interface LicenseMetrics {
  purchased: number;
  assigned: number;
  active: number;
  unused: number;
  underUtilized: number;
  avoidableCost: string;
}

export interface ExperienceScore {
  overall: number;
  byDepartment: { name: string; score: number }[];
  ticketTrend: { date: string; tickets: number }[];
}
`;

if (!typesStr.includes('RiskMetric')) {
  typesStr = typesStr.replace('export interface IIdentityDataProvider {', newTypes + '\nexport interface IIdentityDataProvider {');
  typesStr = typesStr.replace('refreshData: () => Promise<void>;', `
  riskTrend: RiskMetric[];
  riskDistribution: RiskDistribution[];
  lifecycleMetrics: LifecycleMetrics;
  licenseMetrics: LicenseMetrics;
  experienceScore: ExperienceScore;
  refreshData: () => Promise<void>;`);
  fs.writeFileSync(path.join(servicesDir, 'types.ts'), typesStr);
}


// --- 2. Update MockProvider ---
let mockStr = fs.readFileSync(path.join(servicesDir, 'MockProvider.ts'), 'utf8');
if (!mockStr.includes('riskTrend: RiskMetric[]')) {
  const mockAdditions = `
  riskTrend: RiskMetric[] = Array.from({ length: 14 }).map((_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    high: Math.floor(Math.random() * 10) + 5,
    medium: Math.floor(Math.random() * 20) + 15,
    low: Math.floor(Math.random() * 40) + 30
  }));

  riskDistribution: RiskDistribution[] = [
    { category: 'Authentication', count: 42 },
    { category: 'Location', count: 28 },
    { category: 'Device', count: 19 },
    { category: 'Privilege', count: 12 },
    { category: 'Lifecycle', count: 8 }
  ];

  lifecycleMetrics: LifecycleMetrics = {
    newJoiners: 24,
    departures: 8,
    dormant: 42,
    avgOnboardingDays: 2.4
  };

  licenseMetrics: LicenseMetrics = {
    purchased: 1000,
    assigned: 942,
    active: 781,
    underUtilized: 91,
    unused: 67,
    avoidableCost: '₹3.8L'
  };

  experienceScore: ExperienceScore = {
    overall: 91,
    byDepartment: [
      { name: 'Finance', score: 96 },
      { name: 'HR', score: 94 },
      { name: 'Engineering', score: 92 },
      { name: 'Sales', score: 88 },
      { name: 'Operations', score: 81 }
    ],
    ticketTrend: Array.from({ length: 14 }).map((_, i) => ({
      date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tickets: Math.floor(Math.random() * 15) + 5
    }))
  };
`;
  
  mockStr = mockStr.replace('users: IdentityUser[] = [];', `users: IdentityUser[] = [];\n${mockAdditions}`);
  
  // Let's also expand the issues list to be more realistic for the table
  const expandedIssues = `
  issues: IdentityIssue[] = [
    { id: '1', userId: 'u1', userName: 'John Smith', issue: 'MFA not configured', risk: 'High', impact: 'Authentication', ageDays: 4, recommendedAction: 'Enforce MFA' },
    { id: '2', userId: 'u2', userName: 'Ravi Kumar', issue: 'Inactive 94 days', risk: 'Medium', impact: 'Account hygiene', ageDays: 94, recommendedAction: 'Review account' },
    { id: '3', userId: 'u3', userName: 'Service-CRM', issue: 'Excessive privileges', risk: 'High', impact: 'Security', ageDays: 12, recommendedAction: 'Review permissions' },
    { id: '4', userId: 'u4', userName: 'Sarah Jenkins', issue: 'Multiple failed sign-ins', risk: 'Medium', impact: 'Security', ageDays: 1, recommendedAction: 'Investigate' },
    { id: '5', userId: 'u5', userName: 'David Chen', issue: 'Unused E5 license', risk: 'Low', impact: 'Cost', ageDays: 62, recommendedAction: 'Downgrade license' },
    { id: '6', userId: 'u6', userName: 'Maria Garcia', issue: 'Login from new country', risk: 'High', impact: 'Security', ageDays: 0, recommendedAction: 'Block sign-in' },
    { id: '7', userId: 'u7', userName: 'Alex Johnson', issue: 'Unmanaged device access', risk: 'Medium', impact: 'Compliance', ageDays: 3, recommendedAction: 'Enforce Intune' },
    { id: '8', userId: 'u8', userName: 'Priya Patel', issue: 'Orphaned guest account', risk: 'Low', impact: 'Hygiene', ageDays: 120, recommendedAction: 'Remove guest' },
  ];
`;
  mockStr = mockStr.replace(/issues: IdentityIssue\[\] = \[[\s\S]*?\];/, expandedIssues.trim());
  
  fs.writeFileSync(path.join(servicesDir, 'MockProvider.ts'), mockStr);
}

// --- 3. Update ProductionProvider ---
let prodStr = fs.readFileSync(path.join(servicesDir, 'ProductionProvider.ts'), 'utf8');
if (!prodStr.includes('riskTrend: RiskMetric[]')) {
  prodStr = prodStr.replace('users: IdentityUser[] = [];', `users: IdentityUser[] = [];
  riskTrend: any[] = [];
  riskDistribution: any[] = [];
  lifecycleMetrics: any = { newJoiners: 0, departures: 0, dormant: 0, avgOnboardingDays: 0 };
  licenseMetrics: any = { purchased: 0, assigned: 0, active: 0, unused: 0, underUtilized: 0, avoidableCost: '₹0' };
  experienceScore: any = { overall: 0, byDepartment: [], ticketTrend: [] };`);
  fs.writeFileSync(path.join(servicesDir, 'ProductionProvider.ts'), prodStr);
}


// --- 4. Replace Components ---

// RiskAndAccess.tsx
const riskCode = `import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const RiskAndAccess = () => {
  const { data } = useIdentityData();
  const { riskTrend, riskDistribution } = data;

  const COLORS = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#4f46e5'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Intelligence */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Intelligence</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
            <p className="text-xs font-semibold text-red-800 mb-1">High Risk</p>
            <p className="text-2xl font-bold text-red-600">34</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
            <p className="text-xs font-semibold text-orange-800 mb-1">Medium Risk</p>
            <p className="text-2xl font-bold text-orange-600">142</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <p className="text-xs font-semibold text-green-800 mb-1">Avg Resolution</p>
            <p className="text-2xl font-bold text-green-600">2.4h</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="h-40 w-full">
            <p className="text-xs font-medium text-gray-500 mb-2">Risk Trend (14 days)</p>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrend}>
                <defs>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <Tooltip />
                <Area type="monotone" dataKey="high" stroke="#dc2626" fillOpacity={1} fill="url(#colorHigh)" />
                <Area type="monotone" dataKey="medium" stroke="#ea580c" fillOpacity={0.3} fill="#ea580c" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="h-40 w-full">
            <p className="text-xs font-medium text-gray-500 mb-2">Risk Distribution</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {riskDistribution.map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Access & Privilege Intelligence */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Access & Privilege Intelligence</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-indigo-900">Security Groups</p>
              <span className="bg-indigo-200 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-medium">1,204</span>
            </div>
            <p className="text-xs text-indigo-700 mt-2">142 unused groups detected</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-blue-900">M365 Groups</p>
              <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">842</span>
            </div>
            <p className="text-xs text-blue-700 mt-2">External sharing enabled on 64</p>
          </div>
        </div>

        <div className="border border-gray-100 rounded-lg p-4 mb-6 bg-gray-50/50">
          <p className="text-sm font-semibold text-gray-800 mb-4">Privilege Distribution</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                <span>Permanent Privileges</span>
                <span className="text-red-600 font-bold">14 (12%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                <span>Eligible Privileges (PIM)</span>
                <span className="text-green-600 font-bold">104 (88%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 border border-orange-100 rounded-lg p-4 bg-orange-50/30 flex items-start gap-3">
          <svg className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <p className="text-sm font-semibold text-orange-900">Privilege Anomaly Detected</p>
            <p className="text-xs text-orange-800 mt-1 leading-relaxed">2 Global Administrator roles were assigned permanently outside of PIM workflows in the last 48 hours. <span className="font-semibold underline cursor-pointer">Investigate</span></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RiskAndAccess;
`;
fs.writeFileSync(path.join(componentsDir, 'RiskAndAccess.tsx'), riskCode);

// LifecycleAndLicense.tsx
const lifecycleCode = `import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const LifecycleAndLicense = () => {
  const { data } = useIdentityData();
  const { lifecycleMetrics, licenseMetrics } = data;

  const licenseData = [
    { name: 'Active', value: licenseMetrics.active, color: '#10b981' },
    { name: 'Under-utilized', value: licenseMetrics.underUtilized, color: '#f59e0b' },
    { name: 'Unused', value: licenseMetrics.unused, color: '#ef4444' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Lifecycle Flow */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Identity Lifecycle</h3>
        
        <div className="relative py-4">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
          
          <div className="relative z-10 flex justify-between">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-4 border-white shadow-sm font-bold text-sm">HR</div>
              <p className="text-xs font-semibold text-gray-600 mt-2">New Joiners</p>
              <p className="text-lg font-bold text-gray-900">{lifecycleMetrics.newJoiners}</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border-4 border-white shadow-sm font-bold text-sm">ID</div>
              <p className="text-xs font-semibold text-gray-600 mt-2">Created</p>
              <p className="text-xs text-gray-500">Avg {lifecycleMetrics.avgOnboardingDays}d</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center border-4 border-white shadow-sm font-bold text-sm">OK</div>
              <p className="text-xs font-semibold text-gray-600 mt-2">Ready</p>
              <p className="text-xs text-gray-500">Auto-assigned</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center border-4 border-white shadow-sm font-bold text-sm">Zzz</div>
              <p className="text-xs font-semibold text-gray-600 mt-2">Dormant</p>
              <p className="text-lg font-bold text-orange-600">{lifecycleMetrics.dormant}</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center border-4 border-white shadow-sm font-bold text-sm">Off</div>
              <p className="text-xs font-semibold text-gray-600 mt-2">Departures</p>
              <p className="text-lg font-bold text-gray-900">{lifecycleMetrics.departures}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border border-red-100 rounded-lg p-4 bg-red-50 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <p className="text-sm font-semibold text-red-900">Lifecycle Exceptions</p>
            <p className="text-xs text-red-800 mt-1 leading-relaxed">4 departed employees still have active Microsoft 365 access and assigned licenses.</p>
            <div className="mt-2 flex gap-2">
              <button className="text-xs bg-white border border-red-200 text-red-700 px-2 py-1 rounded font-medium hover:bg-red-50">Revoke Access</button>
            </div>
          </div>
        </div>
      </div>

      {/* License Intelligence */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-semibold text-gray-900">License Intelligence</h3>
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estimated Avoidable Cost</p>
            <p className="text-2xl font-bold text-indigo-600">{licenseMetrics.avoidableCost} <span className="text-sm font-medium text-gray-400">/ mo</span></p>
          </div>
        </div>
        
        <div className="flex-1 flex items-center">
          <div className="w-1/2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={licenseData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                  {licenseData.map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-sm font-medium text-gray-600">Purchased</span>
              <span className="text-sm font-bold text-gray-900">{licenseMetrics.purchased}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-sm font-medium text-gray-600">Assigned</span>
              <span className="text-sm font-bold text-gray-900">{licenseMetrics.assigned}</span>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-gray-600">Active</span>
              </div>
              <span className="text-xs font-bold text-gray-900">{licenseMetrics.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-xs font-medium text-gray-600">Under-utilized</span>
              </div>
              <span className="text-xs font-bold text-gray-900">{licenseMetrics.underUtilized}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs font-medium text-gray-600">Unused</span>
              </div>
              <span className="text-xs font-bold text-gray-900">{licenseMetrics.unused}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifecycleAndLicense;
`;
fs.writeFileSync(path.join(componentsDir, 'LifecycleAndLicense.tsx'), lifecycleCode);

// UserExperience.tsx
const uxCode = `import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const UserExperience = () => {
  const { data } = useIdentityData();
  const { experienceScore } = data;

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 85) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center lg:col-span-1">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Identity Experience Score</h3>
        <div className="text-6xl font-bold text-gray-900 my-4">{experienceScore.overall}</div>
        <p className="text-sm text-gray-500 text-center px-4">Based on authentication success, MFA friction, and account lockout rates.</p>
        
        <div className="w-full mt-8 space-y-3">
          {experienceScore.byDepartment.map(dept => (
            <div key={dept.name} className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-600">{dept.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: \`\${dept.score}%\`, backgroundColor: getScoreColor(dept.score) }}></div>
                </div>
                <span className="font-bold text-gray-900 w-6 text-right">{dept.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Support Intelligence</h3>
          <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-1 rounded">12 Repeat Problem Users</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-100 p-3 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Auth Tickets</p>
              <p className="text-xl font-bold text-gray-900 mt-1">42</p>
            </div>
            <div className="text-red-500 text-xs font-semibold bg-red-50 px-2 py-1 rounded">↑ 12%</div>
          </div>
          <div className="border border-gray-100 p-3 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">MFA Resets</p>
              <p className="text-xl font-bold text-gray-900 mt-1">18</p>
            </div>
            <div className="text-green-500 text-xs font-semibold bg-green-50 px-2 py-1 rounded">↓ 4%</div>
          </div>
        </div>

        <div className="flex-1 min-h-[150px]">
          <p className="text-xs font-medium text-gray-500 mb-2">Identity-related Tickets (14 days)</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={experienceScore.ticketTrend}>
              <XAxis dataKey="date" hide />
              <Tooltip />
              <Line type="monotone" dataKey="tickets" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserExperience;
`;
fs.writeFileSync(path.join(componentsDir, 'UserExperience.tsx'), uxCode);

// IssuesTable.tsx (Adding state for search/filter)
const tableCode = `import { useState } from 'react';
import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';

const IssuesTable = () => {
  const { data } = useIdentityData();
  const { issues } = data;
  const [searchTerm, setSearchTerm] = useState('');

  const renderRisk = (risk: string) => {
    let color = 'bg-gray-100 text-gray-800';
    if (risk === 'High') color = 'bg-red-100 text-red-800';
    if (risk === 'Medium') color = 'bg-orange-100 text-orange-800';
    if (risk === 'Low') color = 'bg-green-100 text-green-800';
    return <span className={\`px-2.5 py-0.5 rounded-full text-xs font-medium \${color}\`}>{risk}</span>;
  };

  const filteredIssues = issues.filter(issue => 
    issue.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    issue.issue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Top Identity Issues</h3>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search users or issues..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md text-sm pl-9 pr-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
          <button className="border border-gray-300 rounded-md bg-white text-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filter
          </button>
          <button className="border border-gray-300 rounded-md bg-white text-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-semibold">User</th>
              <th className="px-6 py-3 font-semibold">Issue</th>
              <th className="px-6 py-3 font-semibold">Risk</th>
              <th className="px-6 py-3 font-semibold">Impact</th>
              <th className="px-6 py-3 font-semibold">Age</th>
              <th className="px-6 py-3 font-semibold text-right">Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue.id} className="bg-white border-b hover:bg-gray-50 transition-colors cursor-pointer group">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {issue.userName.charAt(0)}
                  </div>
                  {issue.userName}
                </td>
                <td className="px-6 py-4 font-medium text-gray-700">{issue.issue}</td>
                <td className="px-6 py-4">{renderRisk(issue.risk)}</td>
                <td className="px-6 py-4 text-gray-600">{issue.impact}</td>
                <td className="px-6 py-4">{issue.ageDays} days</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-600 font-medium hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {issue.recommendedAction}
                  </button>
                </td>
              </tr>
            ))}
            {filteredIssues.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No issues found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssuesTable;
`;
fs.writeFileSync(path.join(componentsDir, 'IssuesTable.tsx'), tableCode);

console.log('UI Components updated with full visuals.');
