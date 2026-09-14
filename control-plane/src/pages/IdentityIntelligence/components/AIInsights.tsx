import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';

const AIInsights = () => {
  const { data } = useIdentityData();
  const { insights } = data;

  const getSeverityStyle = (severity: string) => {
    switch(severity) {
      case 'Critical': return 'border-red-500 bg-red-50 text-red-900';
      case 'Attention Required': return 'border-orange-500 bg-orange-50 text-orange-900';
      case 'Emerging Pattern': return 'border-blue-500 bg-blue-50 text-blue-900';
      case 'Improvement': return 'border-green-500 bg-green-50 text-green-900';
      case 'License Opportunity': return 'border-purple-500 bg-purple-50 text-purple-900';
      default: return 'border-gray-500 bg-gray-50 text-gray-900';
    }
  };

  const getSeverityDot = (severity: string) => {
    switch(severity) {
      case 'Critical': return '🔴';
      case 'Attention Required': return '🟠';
      case 'Emerging Pattern': return '🔵';
      case 'Improvement': return '🟢';
      case 'License Opportunity': return '🟣';
      default: return '⚪';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        CIS360 Intelligence
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {insights.map(insight => (
          <div key={insight.id} className={`border-l-4 rounded-r-lg p-4 flex flex-col justify-between h-full shadow-sm ${getSeverityStyle(insight.severity)}`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{getSeverityDot(insight.severity)} {insight.severity}</span>
                <span className="text-xs opacity-70">{insight.timestamp}</span>
              </div>
              <p className="text-sm font-medium mb-3 leading-snug">{insight.message}</p>
            </div>
            <div>
              <p className="text-xs font-semibold opacity-80 mb-3">Impact: {insight.impact}</p>
              <div className="flex gap-2">
                <button className="text-xs font-semibold bg-white/50 hover:bg-white px-2 py-1.5 rounded transition-colors flex-1 text-center">Investigate</button>
                <button className="text-xs font-semibold bg-white/50 hover:bg-white px-2 py-1.5 rounded transition-colors flex-1 text-center">Explain</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
