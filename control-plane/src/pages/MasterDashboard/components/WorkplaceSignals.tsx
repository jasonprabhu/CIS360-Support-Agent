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
  const { data, setSelectedScenario, setIsDeepDiveOpen, resetRemediation } = useWorkplaceIntelligence();

  const handleSignalClick = (signal: any) => {
    resetRemediation();
    const domainLower = signal.domain.toLowerCase();
    
    let matched = data.scenarios[0];
    if (domainLower.includes('identity') || domainLower.includes('auth')) {
      matched = data.scenarios.find(s => s.id === 'exchange-apac-auth') || data.scenarios[1];
    } else if (domainLower.includes('teams') || domainLower.includes('meet')) {
      matched = data.scenarios.find(s => s.id === 'teams-quality-anomaly') || data.scenarios[2];
    } else if (domainLower.includes('power') || domainLower.includes('flow')) {
      matched = data.scenarios.find(s => s.id === 'flow-sap-outage') || data.scenarios[0];
    } else {
      matched = data.scenarios[0];
    }

    setSelectedScenario(matched);
    setIsDeepDiveOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">What's Happening (Proactive Signals)</h2>
          <p className="text-xs text-gray-500 mt-1">Cross-service autonomous telemetry signals. Click any signal for AI root-cause deep-dive.</p>
        </div>
        <button 
          onClick={() => {
            resetRemediation();
            setSelectedScenario(data.scenarios[0]);
            setIsDeepDiveOpen(true);
          }}
          className="text-indigo-600 text-sm font-bold hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {data.signals.map((signal) => (
          <div 
            key={signal.id} 
            onClick={() => handleSignalClick(signal)}
            className={`p-4 rounded-lg border ${getSeverityColor(signal.severity)} flex gap-4 transition-all hover:shadow-md cursor-pointer group`}
          >
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
                <span className="text-xs font-bold uppercase tracking-wider group-hover:underline text-indigo-700">
                  {signal.actionText} →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkplaceSignals;
