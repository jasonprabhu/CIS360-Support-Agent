import { useExchangeData } from '../../../services/exchangeIntelligence/ExchangeDataProvider';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const KPIGrid = () => {
  const { data } = useExchangeData();
  const { kpis } = data;

  const getTrendColor = (status?: string) => {
    if (status === 'good') return '#16a34a';
    if (status === 'warning') return '#ca8a04';
    if (status === 'critical') return '#dc2626';
    return '#6366f1';
  };

  const renderTrend = (trend: number, status?: string) => {
    let color = 'text-gray-500';
    if (status === 'good') color = 'text-green-600';
    if (status === 'warning') color = 'text-yellow-600';
    if (status === 'critical') color = 'text-red-600';

    const dir = trend > 0 ? '↑' : (trend < 0 ? '↓' : '-');
    return <span className={"text-xs font-semibold " + color}>{dir} {Math.abs(trend)}%</span>;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-medium text-gray-500">{kpi.title}</h4>
          </div>
          <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
          <div className="flex-1 w-full mt-3 mb-2 min-h-[40px]">
            {kpi.history && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpi.history.map((val, i) => ({ value: val, index: i }))} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={"color-" + idx} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getTrendColor(kpi.status)} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={getTrendColor(kpi.status)} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke={getTrendColor(kpi.status)} fillOpacity={1} fill={"url(#color-" + idx + ")"} strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-auto text-gray-500 text-xs">
            {renderTrend(kpi.trend, kpi.status)}
            <span>vs prev 30d</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIGrid;
