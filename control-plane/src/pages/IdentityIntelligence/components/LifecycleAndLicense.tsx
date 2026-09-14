import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const LifecycleAndLicense = () => {
  const { data } = useIdentityData();
  const { lifecycleMetrics, licenseMetrics } = data;

  const licenseData = [
    { name: 'Active', value: licenseMetrics.active, color: '#10b981' },
    { name: 'Under-utilized', value: licenseMetrics.underUtilized, color: '#f59e0b' },
    { name: 'Unused', value: licenseMetrics.unused, color: '#ef4444' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Lifecycle Flow */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Identity Lifecycle</h3>
        
        <div className="relative py-4">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
          
          <div className="relative z-10 flex justify-between">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-4 border-white shadow-sm font-bold text-sm">HR</div>
              <p className="text-xs font-semibold text-gray-600 mt-2">New Joiners</p>
              <p className="text-lg font-bold text-gray-900">{lifecycleMetrics.newJoiners}</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border-4 border-white shadow-sm font-bold text-sm">ID</div>
              <p className="text-xs font-semibold text-gray-600 mt-2">Created</p>
              <p className="text-xs text-gray-500">Avg {lifecycleMetrics.avgOnboardingDays}d</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center border-4 border-white shadow-sm font-bold text-sm">OK</div>
              <p className="text-xs font-semibold text-gray-600 mt-2">Ready</p>
              <p className="text-xs text-gray-500">Auto-assigned</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center border-4 border-white shadow-sm font-bold text-sm">Zzz</div>
              <p className="text-xs font-semibold text-gray-600 mt-2">Dormant</p>
              <p className="text-lg font-bold text-orange-600">{lifecycleMetrics.dormant}</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center border-4 border-white shadow-sm font-bold text-sm">Off</div>
              <p className="text-xs font-semibold text-gray-600 mt-2">Departures</p>
              <p className="text-lg font-bold text-gray-900">{lifecycleMetrics.departures}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border border-red-100 rounded-lg p-4 bg-red-50 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <p className="text-sm font-semibold text-red-900">Lifecycle Exceptions</p>
            <p className="text-xs text-red-800 mt-1 leading-relaxed">4 departed employees still have active Microsoft 365 access and assigned licenses.</p>
            <div className="mt-2 flex gap-2">
              <button className="text-xs bg-white border border-red-200 text-red-700 px-2 py-1 rounded font-medium hover:bg-red-50">Revoke Access</button>
            </div>
          </div>
        </div>
      </div>

      {/* License Intelligence */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-semibold text-gray-900">License Intelligence</h3>
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estimated Avoidable Cost</p>
            <p className="text-2xl font-bold text-indigo-600">{licenseMetrics.avoidableCost} <span className="text-sm font-medium text-gray-400">/ mo</span></p>
          </div>
        </div>
        
        <div className="flex-1 flex items-center">
          <div className="w-1/2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={licenseData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                  {licenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-sm font-medium text-gray-600">Purchased</span>
              <span className="text-sm font-bold text-gray-900">{licenseMetrics.purchased}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-sm font-medium text-gray-600">Assigned</span>
              <span className="text-sm font-bold text-gray-900">{licenseMetrics.assigned}</span>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-gray-600">Active</span>
              </div>
              <span className="text-xs font-bold text-gray-900">{licenseMetrics.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-xs font-medium text-gray-600">Under-utilized</span>
              </div>
              <span className="text-xs font-bold text-gray-900">{licenseMetrics.underUtilized}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs font-medium text-gray-600">Unused</span>
              </div>
              <span className="text-xs font-bold text-gray-900">{licenseMetrics.unused}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifecycleAndLicense;
