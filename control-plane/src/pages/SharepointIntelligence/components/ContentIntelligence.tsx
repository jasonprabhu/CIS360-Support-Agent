import { useSharePointData } from '../../../services/sharepointIntelligence/SharePointDataProvider';

const ContentIntelligence = () => {
  const { data } = useSharePointData();
  const { insights } = data;

  const getSeverityStyle = (severity: string) => {
    switch(severity) {
      case 'Critical': return 'border-red-500 bg-red-50 text-red-900';
      case 'Attention Required': return 'border-orange-500 bg-orange-50 text-orange-900';
      case 'Emerging Pattern': return 'border-blue-500 bg-blue-50 text-blue-900';
      case 'Improvement': return 'border-green-500 bg-green-50 text-green-900';
      default: return 'border-gray-500 bg-gray-50 text-gray-900';
    }
  };

  const getSeverityDot = (severity: string) => {
    switch(severity) {
      case 'Critical': return '🔴';
      case 'Attention Required': return '🟠';
      case 'Emerging Pattern': return '🔵';
      case 'Improvement': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        CIS360 Content Intelligence
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {insights.map(insight => (
          <div key={insight.id} className={"border-l-4 rounded-r-xl p-5 flex flex-col justify-between shadow-sm " + getSeverityStyle(insight.severity)}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider">{getSeverityDot(insight.severity)} {insight.severity}</span>
                <span className="text-[10px] uppercase font-bold opacity-70">{insight.timestamp}</span>
              </div>
              <p className="text-sm font-semibold mb-4 leading-snug">{insight.message}</p>
            </div>
            
            <div className="pt-4 border-t border-black/10 mt-auto">
              <div className="mb-4">
                <p className="text-xs font-bold opacity-70 uppercase tracking-wider mb-1">Impact</p>
                <p className="text-xs font-medium">{insight.impact}</p>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-white/50 hover:bg-white text-xs font-bold py-2 rounded-lg transition-colors border border-transparent hover:border-black/10">
                  Investigate
                </button>
                <button className="flex-1 bg-white/50 hover:bg-white text-xs font-bold py-2 rounded-lg transition-colors border border-transparent hover:border-black/10">
                  Explain
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ContentIntelligence;
