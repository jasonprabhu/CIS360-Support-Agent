import { useWorkplaceIntelligence } from '../../../services/workplaceIntelligence/WorkplaceIntelligenceProvider';

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'healthy': return 'bg-green-100 border-green-200 text-green-800';
    case 'attention': return 'bg-amber-100 border-amber-200 text-amber-800';
    case 'critical': return 'bg-red-100 border-red-200 text-red-800';
    case 'ai': return 'bg-purple-100 border-purple-200 text-purple-800';
    default: return 'bg-blue-100 border-blue-200 text-blue-800';
  }
};

const getBadgeColor = (severity: string) => {
  switch (severity) {
    case 'healthy': return 'bg-green-500';
    case 'attention': return 'bg-amber-500';
    case 'critical': return 'bg-red-500';
    case 'ai': return 'bg-purple-500';
    default: return 'bg-blue-500';
  }
};

const WorkplaceSignals = () => {
  const { data } = useWorkplaceIntelligence();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">What's Happening</h2>
          <p className="text-xs text-gray-500 mt-1">Cross-service intelligence signals.</p>
        </div>
        <button className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {data.signals.map((signal) => (
          <div key={signal.id} className={`p-4 rounded-lg border ${getSeverityColor(signal.severity)} flex gap-4 transition-all hover:shadow-md cursor-pointer`}>
            <div className="flex-shrink-0 mt-1">
              <span className={`flex w-3 h-3 rounded-full ${getBadgeColor(signal.severity)}`}>
                {signal.severity === 'critical' && <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black uppercase tracking-wider opacity-80">{signal.domain}</span>
                <span className="text-[10px] font-bold opacity-60">{signal.timestamp}</span>
              </div>
              <p className="text-sm font-semibold mb-2">{signal.explanation}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-bold bg-white/50 px-2 py-0.5 rounded">{signal.trend}</span>
                <span className="text-xs font-bold uppercase tracking-wider hover:underline">{signal.actionText} →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkplaceSignals;
