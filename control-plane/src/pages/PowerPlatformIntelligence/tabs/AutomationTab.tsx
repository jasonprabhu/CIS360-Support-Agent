import { usePowerPlatformData } from '../../../services/powerPlatformIntelligence/PowerPlatformDataProvider';

const AutomationTab = () => {
  const { data } = usePowerPlatformData();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Failure Intelligence</h3>
        <p className="text-xs text-gray-500 mb-6">Flows experiencing repeated execution failures requiring intervention.</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2">Cloud Flow Name</th>
                <th className="px-4 py-2">Environment</th>
                <th className="px-4 py-2">Failures (7d)</th>
                <th className="px-4 py-2">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.automationFailures.map((flow, i) => (
                <tr key={i} className="hover:bg-gray-50 cursor-pointer group">
                  <td className="px-4 py-3 font-bold text-gray-900 group-hover:text-indigo-600">{flow.name}</td>
                  <td className="px-4 py-3">{flow.environment}</td>
                  <td className="px-4 py-3 font-black text-red-600">{flow.failures}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${flow.trend.startsWith('+') ? 'text-red-500' : 'text-gray-500'}`}>{flow.trend}</span>
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

export default AutomationTab;
