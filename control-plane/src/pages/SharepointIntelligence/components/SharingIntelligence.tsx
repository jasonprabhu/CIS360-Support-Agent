import { useSharePointData } from '../../../services/sharepointIntelligence/SharePointDataProvider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SharingIntelligence = () => {
  const { data } = useSharePointData();
  const { sharingMetrics } = data;

  const riskData = [
    { name: 'Anonymous Links', value: sharingMetrics.anonymous, color: '#ef4444' },
    { name: 'External Guests', value: sharingMetrics.guest, color: '#f59e0b' },
    { name: 'Specific External', value: sharingMetrics.specificExternal, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sharing Intelligence</h2>
          <p className="text-sm text-gray-500">Monitor external exposure and data leakage risks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KPI Summary */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-red-50 border border-red-100 rounded-xl p-5">
            <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Anonymous Links</h3>
            <p className="text-3xl font-black text-red-600">{sharingMetrics.anonymous}</p>
            <p className="text-sm text-red-700 mt-2">Active "Anyone with the link" URLs</p>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
            <h3 className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">Guest Users</h3>
            <p className="text-3xl font-black text-orange-600">{sharingMetrics.guest}</p>
            <p className="text-sm text-orange-700 mt-2">External accounts in Entra B2B</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Internal Shares</h3>
            <p className="text-3xl font-black text-blue-600">{sharingMetrics.internal.toLocaleString()}</p>
            <p className="text-sm text-blue-700 mt-2">Safe organizational sharing</p>
          </div>
        </div>

        {/* External Risk Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">External Sharing Risk Profile</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={"cell-" + index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Active Links"]} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
export default SharingIntelligence;
