import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';

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
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${isMockMode ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            🧪 Mock Data
          </button>
          <button 
            onClick={() => setMockMode(false)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${!isMockMode ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
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
          <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
    </div>
  );
};

export default HeroHeader;
