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
