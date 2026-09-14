import { useSharePointData } from '../../../services/sharepointIntelligence/SharePointDataProvider';

const ContentHealthScore = () => {
  const { data } = useSharePointData();
  const { healthScore } = data;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
      {/* Primary Score */}
      <div className="p-8 md:w-1/3 bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Content Health Score</h3>
        <div className="relative">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * healthScore.overall) / 100} className="text-indigo-600 transition-all duration-1000 ease-out" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-gray-900">{healthScore.overall}</span>
            <span className="text-sm font-medium text-gray-500">/ 100</span>
          </div>
        </div>
      </div>

      {/* Dimensions & Explanation */}
      <div className="p-8 md:w-2/3 flex flex-col justify-center">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {healthScore.dimensions.map((dim, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">{dim.name}</span>
                <span className={"text-xs font-bold flex items-center gap-0.5 " + (dim.trend > 0 ? 'text-green-600' : 'text-red-600')}>
                  {dim.trend > 0 ? '↑' : '↓'}
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">{dim.score}</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: dim.score + '%' }}></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-900 mb-1">CIS360 Analysis</h4>
            <p className="text-sm text-indigo-800 leading-relaxed">
              "{healthScore.explanation}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContentHealthScore;
