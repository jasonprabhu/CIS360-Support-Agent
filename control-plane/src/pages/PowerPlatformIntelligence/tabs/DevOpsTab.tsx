import { usePowerPlatformData } from '../../../services/powerPlatformIntelligence/PowerPlatformDataProvider';

const DevOpsTab = () => {
  const { data } = usePowerPlatformData();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6">Release & Deployment Intelligence</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2">Pipeline / Release</th>
                <th className="px-4 py-2">Deployments (30d)</th>
                <th className="px-4 py-2">Success Rate</th>
                <th className="px-4 py-2">Lifecycle Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.devops.map((pipe, i) => (
                <tr key={i} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 font-bold text-gray-900">{pipe.pipeline}</td>
                  <td className="px-4 py-3">{pipe.deployments}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pipe.successRate > 90 ? 'bg-green-500' : pipe.successRate > 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: pipe.successRate + '%' }}></div>
                      </div>
                      <span className="font-bold">{pipe.successRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-xs font-bold text-gray-400 gap-1">
                      <span className="text-blue-500">DEV</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      <span className="text-indigo-500">UAT</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      <span className="text-green-500">PROD</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DevOpsTab;
