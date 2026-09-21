import { usePowerPlatformData } from '../../../services/powerPlatformIntelligence/PowerPlatformDataProvider';

const ActionCenterTab = () => {
  const { data } = usePowerPlatformData();

  const getSeverityStyles = (severity: string) => {
    if (severity === 'Critical') return 'border-red-200 bg-red-50 text-red-900';
    if (severity === 'Attention') return 'border-amber-200 bg-amber-50 text-amber-900';
    return 'border-blue-200 bg-blue-50 text-blue-900';
  };

  const getBadgeStyles = (severity: string) => {
    if (severity === 'Critical') return 'bg-red-600 text-white';
    if (severity === 'Attention') return 'bg-amber-500 text-white';
    return 'bg-blue-500 text-white';
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Proactive Recommendations</h3>
        <p className="text-xs text-gray-500">Automatically detected issues and governance actions that require attention.</p>
      </div>

      {data.actions.map((action, i) => (
        <div key={i} className={`rounded-xl p-5 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${getSeverityStyles(action.severity)}`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${getBadgeStyles(action.severity)}`}>{action.severity}</span>
              <span className="font-bold">{action.asset}</span>
            </div>
            <p className="text-sm opacity-90">{action.reason}</p>
          </div>
          <button className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
            {action.suggestedAction}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ActionCenterTab;
