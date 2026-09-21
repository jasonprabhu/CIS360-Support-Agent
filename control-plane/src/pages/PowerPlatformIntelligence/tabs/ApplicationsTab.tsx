import { usePowerPlatformData } from '../../../services/powerPlatformIntelligence/PowerPlatformDataProvider';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  'Business Critical': '#3b82f6',
  'Attention Required': '#f59e0b',
  'Lifecycle Candidate': '#9ca3af',
  'Review': '#10b981',
};

const ApplicationsTab = () => {
  const { data } = usePowerPlatformData();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Portfolio Visualization: Usage vs Risk</h3>
        <p className="text-xs text-gray-500 mb-6">Identify critical shadow IT applications requiring managed support.</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="usage" name="Monthly Users" label={{ value: 'Usage (Monthly Active)', position: 'insideBottom', offset: -10 }} />
              <YAxis type="number" dataKey="risk" name="Risk Score" label={{ value: 'Risk & Complexity', angle: -90, position: 'insideLeft' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Applications" data={data.appsQuadrant}>
                {data.appsQuadrant.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] ?? '#6366f1'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Application Intelligence</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2">Application</th>
                <th className="px-4 py-2">Usage</th>
                <th className="px-4 py-2">Risk Score</th>
                <th className="px-4 py-2">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.appsQuadrant.map((app, i) => (
                <tr key={i} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 font-bold text-gray-900">{app.name}</td>
                  <td className="px-4 py-3">{app.usage.toLocaleString()}</td>
                  <td className="px-4 py-3 font-bold">{app.risk}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-700">{app.status}</span>
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

export default ApplicationsTab;
