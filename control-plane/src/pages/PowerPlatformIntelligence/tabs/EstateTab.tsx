import { usePowerPlatformData } from '../../../services/powerPlatformIntelligence/PowerPlatformDataProvider';

const EstateTab = () => {
  const { data } = usePowerPlatformData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-center">
          <h3 className="text-sm font-bold text-gray-500 uppercase">Total Environments</h3>
          <p className="text-5xl font-black text-gray-900 mt-2">{data.kpis.environments}</p>
        </div>
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Environment Health</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                <tr>
                  <th className="px-4 py-2">Environment</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Health</th>
                  <th className="px-4 py-2">Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.estate.map((env, i) => (
                  <tr key={i} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 font-bold text-gray-900">{env.name}</td>
                    <td className="px-4 py-3">{env.type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${env.health === 'Healthy' ? 'bg-green-100 text-green-700' : env.health === 'Attention' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {env.health}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${env.riskScore > 80 ? 'bg-red-500' : env.riskScore > 50 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: env.riskScore + '%' }}></div>
                        </div>
                        <span className="font-bold">{env.riskScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstateTab;
