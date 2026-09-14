const fs = require('fs');
const path = require('path');
const componentsDir = path.join(__dirname, 'src', 'pages', 'IdentityIntelligence', 'components');
const rootDir = path.join(__dirname, 'src', 'pages', 'IdentityIntelligence');

// index.tsx
const indexCode = `import { IdentityDataProvider } from '../../services/identityIntelligence/IdentityDataProvider';
import Dashboard from './Dashboard';

const IdentityIntelligence = () => {
  return (
    <IdentityDataProvider>
      <Dashboard />
    </IdentityDataProvider>
  );
};

export default IdentityIntelligence;
`;
fs.writeFileSync(path.join(rootDir, 'index.tsx'), indexCode);

// Dashboard.tsx
const dashboardCode = `import { useIdentityData } from '../../services/identityIntelligence/IdentityDataProvider';
import HeroHeader from './components/HeroHeader';
import IdentityHealth from './components/IdentityHealth';
import KPIGrid from './components/KPIGrid';
import AIInsights from './components/AIInsights';
import RiskAndAccess from './components/RiskAndAccess';
import LifecycleAndLicense from './components/LifecycleAndLicense';
import UserExperience from './components/UserExperience';
import IssuesTable from './components/IssuesTable';
import Identity360Modal from './components/Identity360Modal';

const Dashboard = () => {
  const { data, isMockMode, isLoading } = useIdentityData();

  if (!isMockMode && !data.isConfigured) {
    return (
      <div className="animate-fade-in p-6">
        <HeroHeader />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-6">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <h3 className="text-lg font-medium text-gray-900">Live Identity Data Not Configured</h3>
          <p className="mt-2 text-gray-500">Production identity connectors are not yet configured.</p>
          <div className="mt-6 flex justify-center gap-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">Configure Connection</button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">Use Demo Data</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
      
      <HeroHeader />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <IdentityHealth />
        </div>
        <div className="lg:col-span-2">
          <KPIGrid />
        </div>
      </div>

      <div className="mt-6">
        <AIInsights />
      </div>

      <div className="mt-6">
        <RiskAndAccess />
      </div>

      <div className="mt-6">
        <LifecycleAndLicense />
      </div>
      
      <div className="mt-6">
        <UserExperience />
      </div>

      <div className="mt-6">
        <IssuesTable />
      </div>

      <Identity360Modal />
    </div>
  );
};

export default Dashboard;
`;
fs.writeFileSync(path.join(rootDir, 'Dashboard.tsx'), dashboardCode);

// HeroHeader.tsx
const heroHeaderCode = `import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';

const HeroHeader = () => {
  const { isMockMode, setMockMode, refresh, isLoading } = useIdentityData();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Identity Intelligence</h2>
        <p className="text-sm text-gray-500 mt-1">Understand identity health, risk, access, lifecycle and user experience across your organization.</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => setMockMode(true)}
            className={\`px-3 py-1.5 text-sm font-medium rounded-md transition-colors \${isMockMode ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}\`}
          >
            🧪 Mock Data
          </button>
          <button 
            onClick={() => setMockMode(false)}
            className={\`px-3 py-1.5 text-sm font-medium rounded-md transition-colors \${!isMockMode ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}\`}
          >
            🔴 Production Data
          </button>
        </div>
        
        <select className="border border-gray-300 rounded-md text-sm py-1.5 pl-3 pr-8 text-gray-700 focus:ring-indigo-500 focus:border-indigo-500">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>Last 90 Days</option>
        </select>

        <button 
          onClick={refresh}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
          title="Refresh Data"
        >
          <svg className={\`w-4 h-4 \${isLoading ? 'animate-spin' : ''}\`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
    </div>
  );
};

export default HeroHeader;
`;
fs.writeFileSync(path.join(componentsDir, 'HeroHeader.tsx'), heroHeaderCode);

// IdentityHealth.tsx
const identityHealthCode = `import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';

const IdentityHealth = () => {
  const { data } = useIdentityData();
  const { healthScore } = data;

  const renderTrend = (val: number) => {
    if (val > 0) return <span className="text-green-600 text-xs font-medium">↑ {Math.abs(val)}%</span>;
    if (val < 0) return <span className="text-red-600 text-xs font-medium">↓ {Math.abs(val)}%</span>;
    return <span className="text-gray-400 text-xs font-medium">-</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Identity Health</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Radial Score Mock */}
        <div className="relative flex items-center justify-center w-32 h-32 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-indigo-600" strokeDasharray={\`\${healthScore.overall}, 100\`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-gray-900">{healthScore.overall}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">/ 100</span>
          </div>
        </div>

        <div className="w-full space-y-3">
          {[
            { label: 'Security', val: healthScore.security, trend: healthScore.trends.security },
            { label: 'Access', val: healthScore.access, trend: healthScore.trends.access },
            { label: 'Lifecycle', val: healthScore.lifecycle, trend: healthScore.trends.lifecycle },
            { label: 'License Efficiency', val: healthScore.licenseEfficiency, trend: healthScore.trends.licenseEfficiency },
            { label: 'User Experience', val: healthScore.userExperience, trend: healthScore.trends.userExperience },
          ].map((dim, idx) => (
            <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors">
              <span className="text-sm text-gray-700 font-medium">{dim.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">{dim.val}</span>
                <div className="w-12 text-right">{renderTrend(dim.trend)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 bg-indigo-50/50 p-3 rounded-lg flex gap-3 items-start">
        <svg className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-xs text-indigo-900 leading-relaxed font-medium">
          {healthScore.explanation}
        </p>
      </div>
    </div>
  );
};

export default IdentityHealth;
`;
fs.writeFileSync(path.join(componentsDir, 'IdentityHealth.tsx'), identityHealthCode);

// KPIGrid.tsx
const kpiGridCode = `import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';

const KPIGrid = () => {
  const { data } = useIdentityData();
  const { kpis } = data;

  const renderTrend = (trend: number, status?: string) => {
    let color = 'text-gray-500';
    if (status === 'good') color = 'text-green-600';
    if (status === 'warning') color = 'text-yellow-600';
    if (status === 'critical') color = 'text-red-600';

    const dir = trend > 0 ? '↑' : (trend < 0 ? '↓' : '-');
    return <span className={\`text-xs font-semibold \${color}\`}>{dir} {Math.abs(trend)}%</span>;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-medium text-gray-500">{kpi.title}</h4>
            <div className="p-1.5 bg-gray-50 rounded-md">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
            <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-xs">
              {renderTrend(kpi.trend, kpi.status)}
              <span>vs prev 30d</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIGrid;
`;
fs.writeFileSync(path.join(componentsDir, 'KPIGrid.tsx'), kpiGridCode);

console.log('UI Components (Part 1) created.');
