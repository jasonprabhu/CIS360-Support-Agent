import { useExchangeData } from '../../../services/exchangeIntelligence/ExchangeDataProvider';

const RegionConnectivityWidget = () => {
  const { data } = useExchangeData();
  const { regionConnectivity } = data;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Client Connectivity</h3>
      
      <div className="space-y-3">
        {regionConnectivity.map((region, i) => (
          <div key={i} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className={"w-2.5 h-2.5 rounded-full " + (region.status === 'Healthy' ? 'bg-green-500' : 'bg-red-500')}></div>
                <span className="font-semibold text-gray-900 text-sm">{region.region}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className={"font-mono " + (region.latencyMs > 100 ? 'text-red-600 font-bold' : 'text-gray-500')}>{region.latencyMs}ms</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-center mt-3">
              <div className="bg-white border border-gray-200 rounded p-1">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Outlook</p>
                <p className={"text-xs font-semibold " + (region.protocols.outlook < 90 ? 'text-red-600' : 'text-green-600')}>{region.protocols.outlook}%</p>
              </div>
              <div className="bg-white border border-gray-200 rounded p-1">
                <p className="text-[10px] text-gray-500 uppercase font-bold">OWA</p>
                <p className={"text-xs font-semibold " + (region.protocols.owa < 90 ? 'text-red-600' : 'text-green-600')}>{region.protocols.owa}%</p>
              </div>
              <div className="bg-white border border-gray-200 rounded p-1">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Mobile</p>
                <p className={"text-xs font-semibold " + (region.protocols.activesync < 90 ? 'text-red-600' : 'text-green-600')}>{region.protocols.activesync}%</p>
              </div>
              <div className="bg-white border border-gray-200 rounded p-1">
                <p className="text-[10px] text-gray-500 uppercase font-bold">EWS</p>
                <p className={"text-xs font-semibold " + (region.protocols.ews < 90 ? 'text-red-600' : 'text-green-600')}>{region.protocols.ews}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RegionConnectivityWidget;
