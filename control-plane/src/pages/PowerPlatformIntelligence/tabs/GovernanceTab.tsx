import { usePowerPlatformData } from '../../../services/powerPlatformIntelligence/PowerPlatformDataProvider';

const GovernanceTab = () => {
  const { data } = usePowerPlatformData();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6">Governance Exceptions</h3>
        
        <div className="space-y-4">
          {data.governance.map((gov, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900">{gov.category}</h4>
                <p className="text-xs text-gray-500">Requires review by Global Governance Team.</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-gray-900">{gov.count}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${gov.severity === 'Critical' ? 'bg-red-100 text-red-700' : gov.severity === 'Attention' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-700'}`}>
                  {gov.severity}
                </span>
                <button className="text-indigo-600 font-semibold text-sm hover:underline">Investigate</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GovernanceTab;
