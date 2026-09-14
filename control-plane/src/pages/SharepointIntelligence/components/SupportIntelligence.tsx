import { useSharePointData } from '../../../services/sharepointIntelligence/SharePointDataProvider';

const SupportIntelligence = ({ onDrilldown }: { onDrilldown?: (data: any) => void }) => {
  const { data } = useSharePointData();
  const { supportHotspots, problemUsers } = data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Content Support Intelligence</h2>
          <p className="text-sm text-gray-500">Correlate SharePoint and OneDrive telemetry with CIS360 support data.</p>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
        <h3 className="text-sm font-bold text-indigo-900 mb-2">What IT Should Know</h3>
        <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
          <li><strong>SharePoint support demand increased 18% this week.</strong></li>
          <li>61% of new incidents relate to permissions.</li>
          <li>Three SharePoint sites account for 48% of the incidents.</li>
        </ul>
        <div className="mt-4 flex gap-3">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded shadow-sm transition-colors">Create Problem Record</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Support Hotspots */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Support Hotspots</h3>
            <p className="text-xs text-gray-500 mt-1">Sites with unusually high ticket volumes</p>
          </div>
          <div className="divide-y divide-gray-100">
            {supportHotspots.map((hotspot, i) => (
              <div key={i} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="font-bold text-gray-900">{hotspot.siteName}</h4>
                  <p className="text-sm text-gray-500">{hotspot.tickets} tickets this week</p>
                </div>
                <div className="text-right">
                  <span className="text-red-600 font-bold text-sm bg-red-50 px-2 py-1 rounded flex items-center gap-1">
                    ↑ {hotspot.trend}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Repeat Problem Users */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Users with Repeated Issues</h3>
            <p className="text-xs text-gray-500 mt-1">Top support offenders</p>
          </div>
          <div className="divide-y divide-gray-100">
            {problemUsers.map((user, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => onDrilldown && onDrilldown({ type: 'problemUser', data: user })}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600">{user.name}</h4>
                    <p className="text-xs text-gray-500">{user.issue} ({user.occurrences}x)</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-gray-900">{user.cause}</p>
                  <p className="text-xs text-gray-500">Last: {user.lastIncident}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
export default SupportIntelligence;
