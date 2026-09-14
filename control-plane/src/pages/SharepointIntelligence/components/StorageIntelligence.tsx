import { useSharePointData } from '../../../services/sharepointIntelligence/SharePointDataProvider';

const StorageIntelligence = () => {
  const { data } = useSharePointData();
  const { storageWaste, storageHotspots } = data;

  const totalWaste = storageWaste.reduce((acc, val) => acc + val.tb, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Storage Intelligence</h2>
          <p className="text-sm text-gray-500">Sprawl tracking and cost optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Waste Intelligence */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 border-t-4 border-t-green-500 flex flex-col">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Storage Waste</h3>
          <p className="text-sm text-gray-900 font-medium mb-6">Potential storage recovery: <span className="text-xl font-black text-green-600">{totalWaste.toFixed(1)} TB</span></p>
          
          <div className="space-y-4 flex-1">
            {storageWaste.map((waste, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{waste.category}</span>
                  <span className="font-bold text-gray-900">{waste.tb} TB</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: (waste.tb / totalWaste) * 100 + '%' }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
            <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold py-2 rounded transition-colors border border-gray-200">Identify Owners</button>
            <button className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded transition-colors">Create Cleanup Rec.</button>
          </div>
        </div>

        {/* Hotspots */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Storage Hotspots (Top 5)</h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Size</th>
                  <th className="px-6 py-3 font-semibold">Growth (30d)</th>
                  <th className="px-6 py-3 font-semibold">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {storageHotspots.map((hotspot, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-bold text-gray-900 group-hover:text-indigo-600">{hotspot.name}</td>
                    <td className="px-6 py-4">
                      <span className={"px-2 py-1 rounded text-xs font-bold " + (hotspot.type === 'Site' ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700')}>{hotspot.type}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-900">{hotspot.sizeGB >= 1024 ? (hotspot.sizeGB / 1024).toFixed(1) + ' TB' : hotspot.sizeGB + ' GB'}</td>
                    <td className="px-6 py-4">
                      <span className={"font-bold " + (hotspot.growthPercent > 10 ? 'text-red-600' : 'text-gray-500')}>
                        {hotspot.growthPercent > 0 ? '+' : ''}{hotspot.growthPercent}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{hotspot.lastActivity}</td>
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
export default StorageIntelligence;
