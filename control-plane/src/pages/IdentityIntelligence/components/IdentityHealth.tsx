import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';

const IdentityHealth = () => {
  const { data } = useIdentityData();
  const { healthScore } = data;

  const renderTrend = (val: number) => {
    if (val > 0) return <span className="text-green-600 text-xs font-medium">↑ {Math.abs(val)}%</span>;
    if (val < 0) return <span className="text-red-600 text-xs font-medium">↓ {Math.abs(val)}%</span>;
    return <span className="text-gray-400 text-xs font-medium">-</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Identity Health</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Radial Score Mock */}
        <div className="relative flex items-center justify-center w-32 h-32 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-indigo-600" strokeDasharray={`${healthScore.overall}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-gray-900">{healthScore.overall}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">/ 100</span>
          </div>
        </div>

        <div className="w-full space-y-3">
          {[
            { label: 'Security', val: healthScore.security, trend: healthScore.trends.security },
            { label: 'Access', val: healthScore.access, trend: healthScore.trends.access },
            { label: 'Lifecycle', val: healthScore.lifecycle, trend: healthScore.trends.lifecycle },
            { label: 'License Efficiency', val: healthScore.licenseEfficiency, trend: healthScore.trends.licenseEfficiency },
            { label: 'User Experience', val: healthScore.userExperience, trend: healthScore.trends.userExperience },
          ].map((dim, idx) => (
            <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors">
              <span className="text-sm text-gray-700 font-medium">{dim.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">{dim.val}</span>
                <div className="w-12 text-right">{renderTrend(dim.trend)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 bg-indigo-50/50 p-3 rounded-lg flex gap-3 items-start">
        <svg className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-xs text-indigo-900 leading-relaxed font-medium">
          {healthScore.explanation}
        </p>
      </div>
    </div>
  );
};

export default IdentityHealth;
