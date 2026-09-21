import { useState } from 'react';
import { usePowerPlatformData } from '../../services/powerPlatformIntelligence/PowerPlatformDataProvider';
import OverviewTab from './tabs/OverviewTab';
import EstateTab from './tabs/EstateTab';
import ApplicationsTab from './tabs/ApplicationsTab';
import AutomationTab from './tabs/AutomationTab';
import MakersTab from './tabs/MakersTab';
import GovernanceTab from './tabs/GovernanceTab';
import AIAgentsTab from './tabs/AIAgentsTab';
import SupportTab from './tabs/SupportTab';
import DevOpsTab from './tabs/DevOpsTab';
import ActionCenterTab from './tabs/ActionCenterTab';

const Dashboard = () => {
  const { isMockMode, toggleMockMode, isLoading } = usePowerPlatformData();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Command Center' },
    { id: 'estate', label: 'Estate' },
    { id: 'apps', label: 'Applications' },
    { id: 'automation', label: 'Automation' },
    { id: 'makers', label: 'Makers' },
    { id: 'governance', label: 'Governance' },
    { id: 'ai', label: 'AI Agents' },
    { id: 'support', label: 'Support' },
    { id: 'devops', label: 'DevOps' },
    { id: 'action', label: 'Action Center' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'estate': return <EstateTab />;
      case 'apps': return <ApplicationsTab />;
      case 'automation': return <AutomationTab />;
      case 'makers': return <MakersTab />;
      case 'governance': return <GovernanceTab />;
      case 'ai': return <AIAgentsTab />;
      case 'support': return <SupportTab />;
      case 'devops': return <DevOpsTab />;
      case 'action': return <ActionCenterTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="animate-fade-in p-6 relative h-full flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Header and Global Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Power Platform Intelligence</h2>
          <p className="text-sm text-gray-500 mt-1">Global visibility. Governance intelligence. Proactive support.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option>All Operations (Global)</option>
            <option>France OpCo</option>
            <option>Germany OpCo</option>
            <option>Italy OpCo</option>
          </select>
          <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option>All Environments</option>
            <option>Production Only</option>
            <option>Default Environment</option>
          </select>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={toggleMockMode}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${!isMockMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Live API
            </button>
            <button
              onClick={toggleMockMode}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${isMockMode ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Demo Data
            </button>
          </div>
        </div>
      </div>

      {isMockMode && (
        <div className="mb-6 bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs px-4 py-2 rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          <strong>DEMO DATA MODE ACTIVE:</strong> Showing synthetic baseline data for preview.
        </div>
      )}

      {/* Horizontal Tabs */}
      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <nav className="-mb-px flex space-x-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
              {tab.id === 'action' && <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">4</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pb-12">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;
