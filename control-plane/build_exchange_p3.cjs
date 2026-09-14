const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'pages', 'ExchangeIntelligence', 'components');

// 1. KPIGrid.tsx
fs.writeFileSync(path.join(componentsDir, 'KPIGrid.tsx'), `import { useExchangeData } from '../../../services/exchangeIntelligence/ExchangeDataProvider';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const KPIGrid = () => {
  const { data } = useExchangeData();
  const { kpis } = data;

  const getTrendColor = (status?: string) => {
    if (status === 'good') return '#16a34a';
    if (status === 'warning') return '#ca8a04';
    if (status === 'critical') return '#dc2626';
    return '#6366f1';
  };

  const renderTrend = (trend: number, status?: string) => {
    let color = 'text-gray-500';
    if (status === 'good') color = 'text-green-600';
    if (status === 'warning') color = 'text-yellow-600';
    if (status === 'critical') color = 'text-red-600';

    const dir = trend > 0 ? '↑' : (trend < 0 ? '↓' : '-');
    return <span className={"text-xs font-semibold " + color}>{dir} {Math.abs(trend)}%</span>;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-medium text-gray-500">{kpi.title}</h4>
          </div>
          <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
          <div className="flex-1 w-full mt-3 mb-2 min-h-[40px]">
            {kpi.history && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpi.history.map((val, i) => ({ value: val, index: i }))} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={"color-" + idx} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getTrendColor(kpi.status)} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={getTrendColor(kpi.status)} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke={getTrendColor(kpi.status)} fillOpacity={1} fill={"url(#color-" + idx + ")"} strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-auto text-gray-500 text-xs">
            {renderTrend(kpi.trend, kpi.status)}
            <span>vs prev 30d</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIGrid;
`);

// 2. AIInsights.tsx
fs.writeFileSync(path.join(componentsDir, 'AIInsights.tsx'), `import { useExchangeData } from '../../../services/exchangeIntelligence/ExchangeDataProvider';

const AIInsights = () => {
  const { data } = useExchangeData();
  const { insights } = data;

  const getSeverityStyle = (severity: string) => {
    switch(severity) {
      case 'Critical': return 'border-red-500 bg-red-50 text-red-900';
      case 'Attention Required': return 'border-orange-500 bg-orange-50 text-orange-900';
      case 'Cost Optimization': return 'border-green-500 bg-green-50 text-green-900';
      case 'Emerging Pattern': return 'border-blue-500 bg-blue-50 text-blue-900';
      default: return 'border-gray-500 bg-gray-50 text-gray-900';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        Exchange Intelligence Insights
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {insights.map(insight => (
          <div key={insight.id} className={"border-l-4 rounded-r-lg p-4 shadow-sm flex flex-col justify-between " + getSeverityStyle(insight.severity)}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{insight.severity}</span>
                <span className="text-xs opacity-70">{insight.timestamp}</span>
              </div>
              <p className="text-sm font-medium mb-3">{insight.message}</p>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="text-xs font-semibold bg-white/60 hover:bg-white px-3 py-1.5 rounded transition-colors border border-transparent hover:border-gray-200 flex-1">
                Investigate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AIInsights;
`);

// 3. HybridHealthWidget.tsx
fs.writeFileSync(path.join(componentsDir, 'HybridHealthWidget.tsx'), `import { useExchangeData } from '../../../services/exchangeIntelligence/ExchangeDataProvider';

const HybridHealthWidget = () => {
  const { data } = useExchangeData();
  const { hybridHealth } = data;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hybrid Environment Health</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={"w-3 h-3 rounded-full " + (hybridHealth.m365Status === 'Healthy' ? 'bg-green-500' : 'bg-red-500')}></div>
            <span className="font-medium text-gray-900">Exchange Online (M365)</span>
          </div>
          <span className="text-sm font-semibold text-gray-700">{hybridHealth.m365Status}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={"w-3 h-3 rounded-full " + (hybridHealth.adSyncStatus === 'Healthy' ? 'bg-green-500' : 'bg-red-500')}></div>
            <span className="font-medium text-gray-900">Entra Connect Sync</span>
          </div>
          <span className="text-sm text-gray-500">Last sync: {hybridHealth.lastSync}</span>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-5">On-Premises Servers</h4>
          <div className="space-y-2">
            {hybridHealth.onPremServers.map((server, i) => (
              <div key={i} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <span className={"w-2 h-2 rounded-full " + (server.status === 'Healthy' ? 'bg-green-500' : 'bg-yellow-500')}></span>
                    {server.name}
                  </p>
                  <p className="text-xs text-gray-500 ml-4">{server.role} • Uptime: {server.uptime}</p>
                </div>
                <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Manage</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HybridHealthWidget;
`);

// 4. RegionConnectivityWidget.tsx
fs.writeFileSync(path.join(componentsDir, 'RegionConnectivityWidget.tsx'), `import { useExchangeData } from '../../../services/exchangeIntelligence/ExchangeDataProvider';

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
`);

// 5. Update OverviewTab.tsx to use these
fs.writeFileSync(path.join(componentsDir, 'OverviewTab.tsx'), `import KPIGrid from './KPIGrid';
import AIInsights from './AIInsights';
import HybridHealthWidget from './HybridHealthWidget';
import RegionConnectivityWidget from './RegionConnectivityWidget';

const OverviewTab = () => {
  return (
    <div className="space-y-6">
      <KPIGrid />
      <AIInsights />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HybridHealthWidget />
        <RegionConnectivityWidget />
      </div>
    </div>
  );
};

export default OverviewTab;
`);

// 6. StorageArchiveTab.tsx
fs.writeFileSync(path.join(componentsDir, 'StorageArchiveTab.tsx'), `import { useExchangeData } from '../../../services/exchangeIntelligence/ExchangeDataProvider';
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
`);

// 7. MailFlowEOPTab.tsx
fs.writeFileSync(path.join(componentsDir, 'MailFlowEOPTab.tsx'), `import { useExchangeData } from '../../../services/exchangeIntelligence/ExchangeDataProvider';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MailFlowEOPTab = () => {
  const { data } = useExchangeData();
  const { eopMetrics, appMailboxes } = data;

  return (
    <div className="space-y-6">
      
      {/* EOP Threat Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Exchange Online Protection (EOP) Threats Blocked</h3>
          <select className="border border-gray-300 rounded-md text-sm py-1 px-3">
            <option>Last 14 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={eopMetrics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPhish" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSpam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? (val / 1000) + 'k' : val} />
              <Tooltip />
              <Area type="monotone" dataKey="phishing" stackId="1" stroke="#ef4444" fill="url(#colorPhish)" name="Phishing" />
              <Area type="monotone" dataKey="spam" stackId="1" stroke="#f97316" fill="url(#colorSpam)" name="Spam" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* App Mailboxes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Application Mailboxes & Relays</h3>
            <p className="text-sm text-gray-500">Monitoring high-volume service accounts and SMTP relays.</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">Add Exception</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-semibold">Account Name</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Department</th>
                <th className="px-6 py-3 font-semibold">Daily Volume</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {appMailboxes.map((mbx) => (
                <tr key={mbx.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{mbx.accountName}</td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      {mbx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{mbx.department}</td>
                  <td className="px-6 py-4 font-mono">{mbx.dailyVolume.toLocaleString()} msgs</td>
                  <td className="px-6 py-4">
                    {mbx.throttled ? (
                      <span className="text-red-600 font-bold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Throttled
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">Healthy</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 font-medium hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors">
                      Investigate
                    </button>
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

export default MailFlowEOPTab;
`);

console.log('Exchange UI Components Setup Complete');
