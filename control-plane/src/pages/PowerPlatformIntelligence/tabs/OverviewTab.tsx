import { usePowerPlatformData } from '../../../services/powerPlatformIntelligence/PowerPlatformDataProvider';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const OverviewTab = () => {
  const { data } = usePowerPlatformData();

  return (
    <div className="space-y-8">
      {/* 1. SCALE & GROWTH */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Scale & Growth</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Environments</span>
            <div className="mt-2 text-2xl font-black text-gray-900">{data.kpis.environments}</div>
          </div>
          <div className="bg-white border border-indigo-200 rounded-xl p-5 shadow-sm bg-indigo-50/30">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Apps Growth</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-indigo-900">{data.kpis.powerApps.toLocaleString()}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">+12% YoY</span>
            </div>
          </div>
          <div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm bg-green-50/30">
            <span className="text-xs font-bold text-green-800 uppercase tracking-wide">Flows Growth</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-green-900">{data.kpis.cloudFlows.toLocaleString()}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-100 text-green-700">+14% YoY</span>
            </div>
          </div>
          <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm bg-amber-50/30">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Makers Growth</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-900">{data.kpis.activeMakers.toLocaleString()}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">+17% YoY</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Dataverse Instances</span>
            <div className="mt-2 text-2xl font-black text-gray-900">{data.kpis.dataverseInstances}</div>
          </div>
        </div>
      </div>

      {/* 2. RISK & GOVERNANCE */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Risk & Governance</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Governance Exceptions</span>
            <span className="text-xl font-black text-amber-600 mt-2">{data.kpis.governanceExceptions}</span>
          </div>
          <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm flex flex-col justify-between bg-red-50/30">
            <span className="text-xs font-bold text-red-800 uppercase">DLP Violations</span>
            <span className="text-xl font-black text-red-600 mt-2">{data.kpis.dlpViolations}</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Orphaned Assets</span>
            <span className="text-xl font-black text-gray-900 mt-2">{data.kpis.orphanedAssets}</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Inactive / Unused</span>
            <span className="text-xl font-black text-gray-500 mt-2">{data.kpis.inactiveAssets.toLocaleString()}</span>
          </div>
          <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm flex flex-col justify-between bg-blue-50/30">
            <span className="text-xs font-bold text-blue-800 uppercase">Critical Applications</span>
            <span className="text-xl font-black text-blue-700 mt-2">{data.kpis.criticalApps}</span>
          </div>
        </div>
      </div>

      {/* 3. SUPPORT & AI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Support Operations</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Support Tickets</span>
              <div className="mt-2 text-2xl font-black text-gray-900">~{data.kpis.supportTickets}<span className="text-sm text-gray-500 font-medium">/year</span></div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">L2/L3 Demand</span>
              <div className="mt-2 text-xl font-bold text-gray-900">{data.kpis.l2l3Demand}</div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">AI & Agents</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total AI Agents</span>
              <div className="mt-2 text-2xl font-black text-purple-700">{data.kpis.agents.toLocaleString()}</div>
            </div>
            <div className="bg-purple-600 rounded-xl p-5 shadow-sm text-white flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-wide opacity-90">Copilot / Agent Adoption</span>
              <div className="mt-2 text-xl font-black flex items-center gap-2">
                Accelerating
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Visualization */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6">Platform Growth Trend</h3>
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
