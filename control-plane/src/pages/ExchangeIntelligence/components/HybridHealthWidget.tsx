import { useExchangeData } from '../../../services/exchangeIntelligence/ExchangeDataProvider';

const HybridHealthWidget = () => {
  const { data } = useExchangeData();
  const { hybridHealth } = data;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hybrid Environment Health</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={"w-3 h-3 rounded-full " + (hybridHealth.m365Status === 'Healthy' ? 'bg-green-500' : 'bg-red-500')}></div>
            <span className="font-medium text-gray-900">Exchange Online (M365)</span>
          </div>
          <span className="text-sm font-semibold text-gray-700">{hybridHealth.m365Status}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={"w-3 h-3 rounded-full " + (hybridHealth.adSyncStatus === 'Healthy' ? 'bg-green-500' : 'bg-red-500')}></div>
            <span className="font-medium text-gray-900">Entra Connect Sync</span>
          </div>
          <span className="text-sm text-gray-500">Last sync: {hybridHealth.lastSync}</span>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-5">On-Premises Servers</h4>
          <div className="space-y-2">
            {hybridHealth.onPremServers.map((server, i) => (
              <div key={i} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <span className={"w-2 h-2 rounded-full " + (server.status === 'Healthy' ? 'bg-green-500' : 'bg-yellow-500')}></span>
                    {server.name}
                  </p>
                  <p className="text-xs text-gray-500 ml-4">{server.role} • Uptime: {server.uptime}</p>
                </div>
                <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Manage</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HybridHealthWidget;
