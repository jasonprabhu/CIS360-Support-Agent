import { useState } from 'react';
import { useIdentityData } from '../../services/identityIntelligence/IdentityDataProvider';
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
  const [activeTab, setActiveTab] = useState('overview');
  const [drilldown, setDrilldown] = useState<any>(null);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'risk', label: 'Risk & Access' },
    { id: 'lifecycle', label: 'Lifecycle & License' },
    { id: 'experience', label: 'User Experience' }
  ];

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
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
      
      <HeroHeader />
      
      {/* Sub-navigation Tabs */}
      <div className="mt-6 border-b border-gray-200">
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <IdentityHealth />
              </div>
              <div className="lg:col-span-2">
                <KPIGrid onDrilldown={(kpi: any) => setDrilldown({ type: 'kpi', data: kpi })} />
              </div>
            </div>
            <AIInsights onDrilldown={(insight: any) => setDrilldown({ type: 'insight', data: insight })} />
            <IssuesTable onDrilldown={(issue: any) => setDrilldown({ type: 'issue', data: issue })} />
          </div>
        )}

        {activeTab === 'risk' && (
          <RiskAndAccess />
        )}

        {activeTab === 'lifecycle' && (
          <LifecycleAndLicense />
        )}

        {activeTab === 'experience' && (
          <UserExperience />
        )}
      </div>

      {/* Drill-down Slide-over Panel */}
      <Identity360Modal 
        isOpen={!!drilldown} 
        onClose={() => setDrilldown(null)} 
        payload={drilldown} 
      />
    </div>
  );
};

export default Dashboard;
