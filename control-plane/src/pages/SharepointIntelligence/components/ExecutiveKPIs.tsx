import { useSharePointData } from '../../../services/sharepointIntelligence/SharePointDataProvider';

const ExecutiveKPIs = () => {
  const { data } = useSharePointData();
  const { kpis } = data;

  const renderSection = (category: string) => {
    const categoryKPIs = kpis.filter(k => k.category === category);
    
    return (
      <div className="mb-8 last:mb-0">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">{category}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categoryKPIs.map(kpi => (
            <div key={kpi.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group">
              <p className="text-xs font-semibold text-gray-500 mb-1 group-hover:text-indigo-600 transition-colors">{kpi.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{kpi.value}</p>
              <div className="flex items-center gap-1.5 text-xs">
                <span className={"font-bold " + (kpi.trend > 0 ? (kpi.status === 'warning' || kpi.status === 'critical' ? 'text-red-600' : 'text-green-600') : (kpi.status === 'warning' || kpi.status === 'critical' ? 'text-green-600' : 'text-red-600'))}>
                  {kpi.trend > 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}%
                </span>
                <span className="text-gray-400">vs prev</span>
                {kpi.status === 'warning' && <span className="ml-auto text-[10px] uppercase font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">Attention</span>}
                {kpi.status === 'critical' && <span className="ml-auto text-[10px] uppercase font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">Critical</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {renderSection('Content')}
      {renderSection('Collaboration')}
      {renderSection('Security')}
    </div>
  );
};
export default ExecutiveKPIs;
