import { useWorkplaceIntelligence } from '../../../services/workplaceIntelligence/WorkplaceIntelligenceProvider';

const AutomationOpportunity = () => {
  const { data } = useWorkplaceIntelligence();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Automation Opportunity</h2>
          <p className="text-xs text-gray-500">Connecting intelligence to action.</p>
        </div>
      </div>

      <div className="space-y-3">
        {data.automation.map((opp, i) => (
          <div key={i} className="border border-gray-100 rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer group">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-900">{opp.domain}</span>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{opp.effortSaved} potential</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-gray-50 rounded p-2">
                <span className="block text-[10px] text-gray-500 uppercase font-bold">Recurring Requests</span>
                <span className="text-lg font-black text-gray-800">{opp.recurringRequests}</span>
              </div>
              <div className="bg-green-50 border border-green-100 rounded p-2">
                <span className="block text-[10px] text-green-700 uppercase font-bold">Available Routines</span>
                <span className="text-lg font-black text-green-700">{opp.automationsAvailable}</span>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700 transition-colors">Automate</button>
              <button className="flex-1 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-50 transition-colors">Analyze</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutomationOpportunity;
