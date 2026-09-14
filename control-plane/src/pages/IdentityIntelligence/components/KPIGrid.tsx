import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';

const KPIGrid = () => {
  const { data } = useIdentityData();
  const { kpis } = data;

  const renderTrend = (trend: number, status?: string) => {
    let color = 'text-gray-500';
    if (status === 'good') color = 'text-green-600';
    if (status === 'warning') color = 'text-yellow-600';
    if (status === 'critical') color = 'text-red-600';

    const dir = trend > 0 ? '↑' : (trend < 0 ? '↓' : '-');
    return <span className={`text-xs font-semibold ${color}`}>{dir} {Math.abs(trend)}%</span>;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-medium text-gray-500">{kpi.title}</h4>
            <div className="p-1.5 bg-gray-50 rounded-md">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
            <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-xs">
              {renderTrend(kpi.trend, kpi.status)}
              <span>vs prev 30d</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIGrid;
