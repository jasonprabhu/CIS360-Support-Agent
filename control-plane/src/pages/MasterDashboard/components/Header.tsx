import { useWorkplaceIntelligence } from '../../../services/workplaceIntelligence/WorkplaceIntelligenceProvider';

const Header = () => {
  const { role, setRole, refreshData, isMockMode } = useWorkplaceIntelligence();

  return (
    <div className="flex flex-col mb-8 gap-4">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Workplace Intelligence</h1>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Enterprise Digital Workplace Command Center</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select value={role} onChange={(e) => setRole(e.target.value)} className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50">
            <option value="Executive">Executive View</option>
            <option value="Service Owner">Service Owner View</option>
            <option value="IT Admin">IT Administrator View</option>
            <option value="CIS360 AI">CIS360 AI View</option>
          </select>
          <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50">
            <option>Global Tenant</option>
            <option>EMEA Region</option>
            <option>NA Region</option>
          </select>
          <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50">
            <option>Last 7 Days</option>
            <option>Last 24 Hours</option>
            <option>Last 30 Days</option>
          </select>
          <button onClick={refreshData} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors shadow-sm border border-gray-200 bg-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>

      {/* AI Command Bar */}
      <div className="relative mt-2">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </div>
        <input 
          type="text" 
          placeholder="Ask anything about your digital workplace..." 
          className="w-full pl-12 pr-4 py-4 bg-white border-2 border-indigo-100 rounded-xl text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 font-medium transition-all"
        />
        <div className="absolute right-4 top-4 flex gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:block mt-1">Suggested:</span>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-medium">Why are Teams incidents increasing?</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-medium hidden sm:block">What can I automate this week?</button>
        </div>
      </div>
      
      {isMockMode && (
        <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs px-4 py-2 rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          <strong>DEMO DATA MODE ACTIVE:</strong> Showing synthetic baseline data for preview.
        </div>
      )}
    </div>
  );
};

export default Header;
