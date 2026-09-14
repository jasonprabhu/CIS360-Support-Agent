import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const RiskAndAccess = () => {
  const { data } = useIdentityData();
  const { riskTrend, riskDistribution } = data;

  const COLORS = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#4f46e5'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Intelligence */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Intelligence</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
            <p className="text-xs font-semibold text-red-800 mb-1">High Risk</p>
            <p className="text-2xl font-bold text-red-600">34</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
            <p className="text-xs font-semibold text-orange-800 mb-1">Medium Risk</p>
            <p className="text-2xl font-bold text-orange-600">142</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <p className="text-xs font-semibold text-green-800 mb-1">Avg Resolution</p>
            <p className="text-2xl font-bold text-green-600">2.4h</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="h-40 w-full">
            <p className="text-xs font-medium text-gray-500 mb-2">Risk Trend (14 days)</p>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrend}>
                <defs>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <Tooltip />
                <Area type="monotone" dataKey="high" stroke="#dc2626" fillOpacity={1} fill="url(#colorHigh)" />
                <Area type="monotone" dataKey="medium" stroke="#ea580c" fillOpacity={0.3} fill="#ea580c" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="h-40 w-full">
            <p className="text-xs font-medium text-gray-500 mb-2">Risk Distribution</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {riskDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Access & Privilege Intelligence */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Access & Privilege Intelligence</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-indigo-900">Security Groups</p>
              <span className="bg-indigo-200 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-medium">1,204</span>
            </div>
            <p className="text-xs text-indigo-700 mt-2">142 unused groups detected</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-blue-900">M365 Groups</p>
              <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">842</span>
            </div>
            <p className="text-xs text-blue-700 mt-2">External sharing enabled on 64</p>
          </div>
        </div>

        <div className="border border-gray-100 rounded-lg p-4 mb-6 bg-gray-50/50">
          <p className="text-sm font-semibold text-gray-800 mb-4">Privilege Distribution</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                <span>Permanent Privileges</span>
                <span className="text-red-600 font-bold">14 (12%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                <span>Eligible Privileges (PIM)</span>
                <span className="text-green-600 font-bold">104 (88%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 border border-orange-100 rounded-lg p-4 bg-orange-50/30 flex items-start gap-3">
          <svg className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <p className="text-sm font-semibold text-orange-900">Privilege Anomaly Detected</p>
            <p className="text-xs text-orange-800 mt-1 leading-relaxed">2 Global Administrator roles were assigned permanently outside of PIM workflows in the last 48 hours. <span className="font-semibold underline cursor-pointer">Investigate</span></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RiskAndAccess;
