import { useSharePointData } from '../../../services/sharepointIntelligence/SharePointDataProvider';

const SharepointSiteIntelligence = () => {
  const { data } = useSharePointData();
  const { sites } = data;

  const anomalySite = sites.find(s => s.anomaly);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-gray-900">SharePoint Site Intelligence</h2>
          <p className="text-sm text-gray-500">Site health, anomalies, and active governance.</p>
        </div>
      </div>

      {anomalySite && (
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-xl p-5 shadow-sm flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-100 text-orange-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Anomaly Detected</span>
              <span className="text-sm font-bold text-gray-900">{anomalySite.name}</span>
            </div>
            <p className="text-sm text-orange-900 font-medium">"{anomalySite.anomaly}"</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-orange-200 text-orange-800 hover:bg-orange-100 text-xs font-bold px-4 py-2 rounded-lg transition-colors">View Users</button>
            <button className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm">Investigate</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Site</th>
                <th className="px-6 py-4 font-semibold">Owner</th>
                <th className="px-6 py-4 font-semibold">Activity</th>
                <th className="px-6 py-4 font-semibold">Storage</th>
                <th className="px-6 py-4 font-semibold">Ext Sharing</th>
                <th className="px-6 py-4 font-semibold">Health Score</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-medium text-gray-900 group-hover:text-indigo-600">{site.name}</td>
                  <td className={"px-6 py-4 " + (site.owner === 'Unassigned' ? 'text-red-600 font-semibold' : '')}>{site.owner}</td>
                  <td className="px-6 py-4">
                    <span className={"px-2.5 py-0.5 rounded-full text-xs font-semibold " + (site.activity === 'High' ? 'bg-green-100 text-green-800' : site.activity === 'Inactive' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800')}>
                      {site.activity}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">{site.storageGB >= 1024 ? (site.storageGB / 1024).toFixed(1) + ' TB' : site.storageGB + ' GB'}</td>
                  <td className="px-6 py-4">
                    <span className={"font-semibold " + (site.externalSharing ? 'text-orange-600' : 'text-green-600')}>{site.externalSharing ? 'Enabled' : 'Disabled'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div className={"h-full rounded-full " + (site.health > 80 ? 'bg-green-500' : site.health > 60 ? 'bg-yellow-500' : 'bg-red-500')} style={{ width: site.health + '%' }}></div>
                      </div>
                      <span className="font-bold text-gray-900">{site.health}</span>
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
export default SharepointSiteIntelligence;
