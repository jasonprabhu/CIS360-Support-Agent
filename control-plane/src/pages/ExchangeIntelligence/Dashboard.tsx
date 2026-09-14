import { useState } from 'react';
import { useExchangeData } from '../../services/exchangeIntelligence/ExchangeDataProvider';
import HeroHeader from './components/HeroHeader';
import OverviewTab from './components/OverviewTab';
import StorageArchiveTab from './components/StorageArchiveTab';
import MailFlowEOPTab from './components/MailFlowEOPTab';
import SecurityRoutingTab from './components/SecurityRoutingTab';
import SupportIntelligenceTab from './components/SupportIntelligenceTab';
import Exchange360Modal from './components/Exchange360Modal';

const Dashboard = () => {
  const { data, isMockMode, isLoading } = useExchangeData();
  const [activeTab, setActiveTab] = useState('overview');
  const [drilldown, setDrilldown] = useState<any>(null);

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
        {activeTab === 'overview' && <OverviewTab onDrilldown={(payload) => setDrilldown(payload)} />}
        {activeTab === 'storage' && <StorageArchiveTab />}
        {activeTab === 'mailflow' && <MailFlowEOPTab onDrilldown={(payload) => setDrilldown(payload)} />}
        {activeTab === 'security' && <SecurityRoutingTab onDrilldown={(payload) => setDrilldown(payload)} />}
        {activeTab === 'support' && <SupportIntelligenceTab />}
      </div>
      <Exchange360Modal isOpen={!!drilldown} onClose={() => setDrilldown(null)} payload={drilldown} />
    </div>
  );
};

export default Dashboard;
