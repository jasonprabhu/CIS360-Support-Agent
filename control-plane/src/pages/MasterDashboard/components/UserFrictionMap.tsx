import { useWorkplaceIntelligence } from '../../../services/workplaceIntelligence/WorkplaceIntelligenceProvider';

const UserFrictionMap = () => {
  const { data } = useWorkplaceIntelligence();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">User Friction</h2>
        <p className="text-xs text-gray-500 mt-1">Hotspots requiring administrative attention.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.friction.map((domain, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
              <span className="font-bold text-gray-900 group-hover:text-indigo-600">{domain.name}</span>
              <span className="text-xl font-black text-amber-600">{domain.totalIssues}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {domain.issues.map((issue, j) => {
                // Size nodes relatively based on count
                const size = issue.count > 50 ? 'h-16 w-16 text-sm' : issue.count > 25 ? 'h-14 w-14 text-xs' : 'h-12 w-12 text-[10px]';
                const color = issue.count > 50 ? 'bg-red-100 border-red-300 text-red-800' : issue.count > 25 ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-blue-50 border-blue-200 text-blue-700';
                
                return (
                  <div key={j} className={`rounded-full border flex flex-col items-center justify-center text-center p-1 shadow-sm transition-transform hover:scale-110 ${size} ${color}`}>
                    <span className="font-black">{issue.count}</span>
                    <span className="leading-tight font-medium truncate w-full px-1">{issue.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserFrictionMap;
