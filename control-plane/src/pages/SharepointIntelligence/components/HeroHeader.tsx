import { useSharePointData } from '../../../services/sharepointIntelligence/SharePointDataProvider';

const HeroHeader = () => {
  const { isMockMode, setMockMode, refresh, isLoading } = useSharePointData();

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-gray-200">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">SharePoint & OneDrive Intelligence</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-3xl">
          Understand content usage, collaboration, access, sharing, security and user experience across Microsoft 365.
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* Mock/Prod Toggle */}
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
        
        {/* Filters */}
        <select className="border border-gray-300 rounded-md text-sm py-1.5 pl-3 pr-8 text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm">
          <option>30 Days</option>
          <option>7 Days</option>
          <option>90 Days</option>
          <option>12 Months</option>
        </select>

        <select className="border border-gray-300 rounded-md text-sm py-1.5 pl-3 pr-8 text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm">
          <option>All Departments</option>
          <option>Finance</option>
          <option>Engineering</option>
          <option>HR</option>
        </select>

        {/* Actions */}
        <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
          <span className="text-xs text-gray-400">Last updated: Just now</span>
          <button 
            onClick={refresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors shadow-sm"
            title="Refresh Data"
          >
            <svg className={"w-4 h-4 " + (isLoading ? 'animate-spin text-indigo-600' : '')} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroHeader;
