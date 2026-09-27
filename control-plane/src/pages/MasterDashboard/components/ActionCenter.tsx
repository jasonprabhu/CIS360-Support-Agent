import { useWorkplaceIntelligence } from '../../../services/workplaceIntelligence/WorkplaceIntelligenceProvider';

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

const ActionCenter = () => {
  const { data } = useWorkplaceIntelligence();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">CIS360 Action Center</h2>
        <p className="text-xs text-gray-500 mt-1">Recommended next steps based on intelligence.</p>
      </div>

      <div className="space-y-4">
        {data.actions.map((action) => (
          <div key={action.id} className={`rounded-xl p-4 border shadow-sm ${getSeverityStyles(action.category)}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${getBadgeStyles(action.category)}`}>{action.category}</span>
              <span className="font-bold text-sm">{action.domain}</span>
            </div>
            <h4 className="font-bold mb-1">{action.issue}</h4>
            <div className="text-xs opacity-90 mb-2">
              <span className="font-semibold">Evidence:</span> {action.evidence}
            </div>
            
            <div className="mt-3 flex justify-end">
              <button className="px-3 py-1.5 bg-white/60 border border-black/10 rounded text-xs font-bold hover:bg-white transition-colors">
                {action.recommendedStep} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionCenter;
