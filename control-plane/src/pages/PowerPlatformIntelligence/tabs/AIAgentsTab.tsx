import { usePowerPlatformData } from '../../../services/powerPlatformIntelligence/PowerPlatformDataProvider';

const AIAgentsTab = () => {
  const { data } = usePowerPlatformData();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">AI Agent Intelligence</h3>
        <p className="text-xs text-gray-500 mb-6">Copilot Studio & Virtual Agent utilization.</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2">Agent Name</th>
                <th className="px-4 py-2">Owner</th>
                <th className="px-4 py-2">Conversations (30d)</th>
                <th className="px-4 py-2">Dataverse Backend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.agentUsage.map((agent, i) => (
                <tr key={i} className="hover:bg-gray-50 cursor-pointer group">
                  <td className="px-4 py-3 font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 11a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm2-4a1 1 0 11-2 0 1 1 0 012 0z"/></svg>
                    {agent.name}
                  </td>
                  <td className="px-4 py-3">{agent.owner}</td>
                  <td className="px-4 py-3 font-mono">{agent.conversations.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${agent.dataverse ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                      {agent.dataverse ? 'Enabled' : 'Disabled'}
                    </span>
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

export default AIAgentsTab;
