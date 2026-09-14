import { useSharePointData } from '../../../services/sharepointIntelligence/SharePointDataProvider';

const ContentRiskGovernance = () => {
  const { data } = useSharePointData();
  const { governance } = data;

  const metrics = [
    { label: 'Ownership', score: governance.ownership },
    { label: 'External Sharing', score: governance.sharing },
    { label: 'Lifecycle (Stale Content)', score: governance.lifecycle },
    { label: 'Permissions Management', score: governance.permissions },
    { label: 'Storage Quotas', score: governance.storage },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Content Risk */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 flex flex-col justify-center text-center">
        <div className="mx-auto w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Overall Content Risk</h3>
        <p className="text-4xl font-black text-red-600 mt-2">HIGH</p>
        <p className="text-sm text-gray-500 mt-4 max-w-sm mx-auto">
          Risk elevated due to excessive anonymous links and orphaned sites with sensitive data.
        </p>
        <button className="mt-6 mx-auto bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
          View Risk Mitigation Report
        </button>
      </div>

      {/* Governance Compliance */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Governance Compliance</h3>
          <span className="text-xl font-black text-green-600">{governance.overall}% Healthy</span>
        </div>
        
        <div className="space-y-5">
          {metrics.map((metric, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700">{metric.label}</span>
                <span className="font-bold text-gray-900">{metric.score}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={"h-full rounded-full " + (metric.score > 85 ? 'bg-green-500' : metric.score > 70 ? 'bg-yellow-500' : 'bg-red-500')} 
                  style={{ width: metric.score + '%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
export default ContentRiskGovernance;
