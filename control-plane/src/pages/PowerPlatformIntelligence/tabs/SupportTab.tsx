import { usePowerPlatformData } from '../../../services/powerPlatformIntelligence/PowerPlatformDataProvider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const SupportTab = () => {
  const { data } = usePowerPlatformData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support KPIs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-center">
          <h3 className="text-sm font-bold text-gray-500 uppercase">Total Incidents (YTD)</h3>
          <p className="text-5xl font-black text-indigo-600 mt-2">180</p>
          <p className="text-sm font-medium text-gray-400 mt-2">~15 per month</p>
        </div>

        {/* Root Cause Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6">Root Cause Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.support} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} fontSize={11} width={120} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="tickets" radius={[0, 4, 4, 0]}>
                  {data.support.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.tickets > 50 ? '#ef4444' : entry.tickets > 30 ? '#f59e0b' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTab;
