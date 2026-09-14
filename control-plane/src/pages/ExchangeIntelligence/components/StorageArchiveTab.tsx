import { useExchangeData } from '../../../services/exchangeIntelligence/ExchangeDataProvider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const StorageArchiveTab = () => {
  const { data } = useExchangeData();
  const { storageMetrics } = data;

  const storageData = [
    { name: 'M365 Primary', value: storageMetrics.cloudPrimaryTB, color: '#4f46e5' },
    { name: 'M365 Archive', value: storageMetrics.cloudArchiveTB, color: '#818cf8' },
    { name: 'On-Premises', value: storageMetrics.onPremTB, color: '#fb923c' },
    { name: storageMetrics.thirdPartyArchive.provider, value: storageMetrics.thirdPartyArchive.ingestedTB, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Distribution */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Global Storage Distribution (TB)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {storageData.map((entry, index) => (
                    <Cell key={"cell-" + index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value + " TB", "Storage"]} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Third Party Integration Widget */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">3rd Party Archive</h3>
          <p className="text-sm text-gray-500 mb-6">External journaling and compliance archiving integration status.</p>
          
          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-lg p-5 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900">{storageMetrics.thirdPartyArchive.provider}</h4>
            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider rounded-full">
              {storageMetrics.thirdPartyArchive.status}
            </span>
            
            <div className="w-full grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Total Ingested</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{storageMetrics.thirdPartyArchive.ingestedTB} TB</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Daily Rate</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{storageMetrics.thirdPartyArchive.dailyIngestionGB} GB/d</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageArchiveTab;
