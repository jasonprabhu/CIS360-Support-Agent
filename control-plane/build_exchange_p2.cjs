const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages', 'ExchangeIntelligence');
const componentsDir = path.join(pagesDir, 'components');

if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

// index.tsx
fs.writeFileSync(path.join(pagesDir, 'index.tsx'), `import { ExchangeDataProvider } from '../../services/exchangeIntelligence/ExchangeDataProvider';
import Dashboard from './Dashboard';

const ExchangeIntelligence = () => {
  return (
    <ExchangeDataProvider>
      <Dashboard />
    </ExchangeDataProvider>
  );
};

export default ExchangeIntelligence;
`);

// components/OverviewTab.tsx
fs.writeFileSync(path.join(componentsDir, 'OverviewTab.tsx'), `const OverviewTab = () => {
  return <div className="p-6 border rounded-xl border-dashed border-gray-300 text-center text-gray-500">Overview & Hybrid Health Tab Content Placeholder</div>;
};
export default OverviewTab;
`);

// components/StorageArchiveTab.tsx
fs.writeFileSync(path.join(componentsDir, 'StorageArchiveTab.tsx'), `const StorageArchiveTab = () => {
  return <div className="p-6 border rounded-xl border-dashed border-gray-300 text-center text-gray-500">Storage & Archiving Tab Content Placeholder</div>;
};
export default StorageArchiveTab;
`);

// components/MailFlowEOPTab.tsx
fs.writeFileSync(path.join(componentsDir, 'MailFlowEOPTab.tsx'), `const MailFlowEOPTab = () => {
  return <div className="p-6 border rounded-xl border-dashed border-gray-300 text-center text-gray-500">Mail Flow & EOP Tab Content Placeholder</div>;
};
export default MailFlowEOPTab;
`);

// components/SecurityRoutingTab.tsx
fs.writeFileSync(path.join(componentsDir, 'SecurityRoutingTab.tsx'), `const SecurityRoutingTab = () => {
  return <div className="p-6 border rounded-xl border-dashed border-gray-300 text-center text-gray-500">Security & Routing Tab Content Placeholder</div>;
};
export default SecurityRoutingTab;
`);

// components/SupportIntelligenceTab.tsx
fs.writeFileSync(path.join(componentsDir, 'SupportIntelligenceTab.tsx'), `const SupportIntelligenceTab = () => {
  return <div className="p-6 border rounded-xl border-dashed border-gray-300 text-center text-gray-500">Support Intelligence Tab Content Placeholder</div>;
};
export default SupportIntelligenceTab;
`);

// components/HeroHeader.tsx
fs.writeFileSync(path.join(componentsDir, 'HeroHeader.tsx'), `import { useExchangeData } from '../../../services/exchangeIntelligence/ExchangeDataProvider';

const HeroHeader = () => {
  const { isMockMode, setMockMode, refresh, isLoading } = useExchangeData();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Exchange Intelligence</h2>
        <p className="text-sm text-gray-500 mt-1">Hybrid mail flow, EOP security, and storage architecture visibility.</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => setMockMode(true)}
            className={"px-3 py-1.5 text-sm font-medium rounded-md transition-colors " + (isMockMode ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700')}
          >
            🧪 Mock Data
          </button>
          <button 
            onClick={() => setMockMode(false)}
            className={"px-3 py-1.5 text-sm font-medium rounded-md transition-colors " + (!isMockMode ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700')}
          >
            🔴 Production Data
          </button>
        </div>
        
        <select className="border border-gray-300 rounded-md text-sm py-1.5 pl-3 pr-8 text-gray-700 focus:ring-indigo-500 focus:border-indigo-500">
          <option>Global View</option>
          <option>AMER Region</option>
          <option>EMEA Region</option>
          <option>APAC Region</option>
        </select>

        <button 
          onClick={refresh}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
          title="Refresh Data"
        >
          <svg className={"w-4 h-4 " + (isLoading ? 'animate-spin' : '')} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
    </div>
  );
};

export default HeroHeader;
`);

// Dashboard.tsx
fs.writeFileSync(path.join(pagesDir, 'Dashboard.tsx'), `import { useState } from 'react';
import { useExchangeData } from '../../services/exchangeIntelligence/ExchangeDataProvider';
import HeroHeader from './components/HeroHeader';
import OverviewTab from './components/OverviewTab';
import StorageArchiveTab from './components/StorageArchiveTab';
import MailFlowEOPTab from './components/MailFlowEOPTab';
import SecurityRoutingTab from './components/SecurityRoutingTab';
import SupportIntelligenceTab from './components/SupportIntelligenceTab';

const Dashboard = () => {
  const { data, isMockMode, isLoading } = useExchangeData();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Hybrid Overview' },
    { id: 'storage', label: 'Storage & Archiving' },
    { id: 'mailflow', label: 'Mail Flow & EOP' },
    { id: 'security', label: 'Security & Routing' },
    { id: 'support', label: 'Support Intelligence' }
  ];

  if (!isMockMode && !data.isConfigured) {
    return (
      <div className="animate-fade-in p-6">
        <HeroHeader />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-6">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
          <h3 className="text-lg font-medium text-gray-900">Live Exchange Data Not Configured</h3>
          <p className="mt-2 text-gray-500">Production Exchange Online / Hybrid connectors are not yet configured.</p>
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
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
      
      <HeroHeader />
      
      {/* Sub-navigation Tabs */}
      <div className="mt-2 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={"whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors " + (
                activeTab === tab.id 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'storage' && <StorageArchiveTab />}
        {activeTab === 'mailflow' && <MailFlowEOPTab />}
        {activeTab === 'security' && <SecurityRoutingTab />}
        {activeTab === 'support' && <SupportIntelligenceTab />}
      </div>
    </div>
  );
};

export default Dashboard;
`);

// Refactor existing ExchangeIntelligence.tsx route entry
const oldPagePath = path.join(srcDir, 'pages', 'ExchangeIntelligence.tsx');
fs.writeFileSync(oldPagePath, `import ExchangeIntelligenceDashboard from './ExchangeIntelligence/index';
export default ExchangeIntelligenceDashboard;
`);

console.log('Exchange UI Shell Setup Complete');
