import { usePowerPlatformData } from '../../../services/powerPlatformIntelligence/PowerPlatformDataProvider';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const OverviewTab = () => {
  const { data } = usePowerPlatformData();

  return (
    <div className="space-y-6">
      {/* Executive KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Environments', val: data.kpis.environments, change: '+5%', status: 'neutral' },
          { label: 'Power Apps', val: data.kpis.powerApps.toLocaleString(), change: '+12%', status: 'good' },
          { label: 'Cloud Flows', val: data.kpis.cloudFlows.toLocaleString(), change: '+14%', status: 'good' },
          { label: 'Desktop Flows', val: data.kpis.desktopFlows.toLocaleString(), change: '+8%', status: 'neutral' },
          { label: 'AI Agents / Copilot', val: data.kpis.agents.toLocaleString(), change: 'Accelerating', status: 'purple' },
          { label: 'Dataverse Instances', val: data.kpis.dataverseInstances, change: 'Stable', status: 'neutral' },
          { label: 'Custom Connectors', val: data.kpis.customConnectors, change: '+2%', status: 'attention' },
          { label: 'Active Makers', val: data.kpis.activeMakers.toLocaleString(), change: '+17%', status: 'good' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col hover:border-indigo-300 transition-colors">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{kpi.label}</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">{kpi.val}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${kpi.status === 'good' ? 'bg-green-100 text-green-700' : kpi.status === 'attention' ? 'bg-amber-100 text-amber-700' : kpi.status === 'purple' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Growth Visualization */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6">Platform Growth & Adoption</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.growth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? (val / 1000) + 'k' : val} />
              <Tooltip cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Legend iconType="circle" />
              <Area type="monotone" dataKey="flows" name="Cloud Flows" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="apps" name="Power Apps" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="agents" name="AI Agents" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="makers" name="Makers" stroke="#f59e0b" fill="none" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
