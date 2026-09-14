const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'pages', 'ExchangeIntelligence', 'components');

// 1. SecurityRoutingTab.tsx
fs.writeFileSync(path.join(componentsDir, 'SecurityRoutingTab.tsx'), `import { useState } from 'react';

// Local mock data to avoid complex data layer changes for this specific tab
const mockForwardingRules = [
  { id: '1', user: 'jason.prabhu@company.com', dept: 'Engineering', target: 'jason.personal@gmail.com', type: 'External', created: '2 days ago', status: 'Active' },
  { id: '2', user: 'sarah.connor@company.com', dept: 'Sales', target: 'partner.corp@vendor.com', type: 'External', created: '1 week ago', status: 'Active' },
  { id: '3', user: 'marketing.general@company.com', dept: 'Marketing', target: 'agency@external-marketing.com', type: 'External', created: '1 month ago', status: 'Blocked by Policy' },
  { id: '4', user: 'mike.ross@company.com', dept: 'Legal', target: 'harvey.specter@lawfirm.com', type: 'External', created: '5 hours ago', status: 'Active' },
];

const SecurityRoutingTab = ({ onDrilldown }: { onDrilldown?: (data: any) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredRules = mockForwardingRules.filter(r => 
    r.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h4 className="text-red-900 font-semibold mb-1">External Forwarding Risks</h4>
          <p className="text-3xl font-bold text-red-700">89</p>
          <p className="text-sm text-red-800 mt-2">Active rules sending corporate mail externally.</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h4 className="text-orange-900 font-semibold mb-1">VIP Targeting Anomalies</h4>
          <p className="text-3xl font-bold text-orange-700">12</p>
          <p className="text-sm text-orange-800 mt-2">Executives targeted by suspicious routing rules.</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h4 className="text-green-900 font-semibold mb-1">Auto-Blocked Rules</h4>
          <p className="text-3xl font-bold text-green-700">342</p>
          <p className="text-sm text-green-800 mt-2">Forwarding rules blocked by DLP policies this month.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">External Forwarding Rules</h3>
            <p className="text-sm text-gray-500">Users automatically forwarding emails outside the organization.</p>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md text-sm pl-3 pr-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500 w-64" 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-semibold">Source Mailbox</th>
                <th className="px-6 py-3 font-semibold">Target Address</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Created</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div>{rule.user}</div>
                    <div className="text-xs text-gray-500 font-normal">{rule.dept}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-red-600">{rule.target}</td>
                  <td className="px-6 py-4"><span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">{rule.type}</span></td>
                  <td className="px-6 py-4">{rule.created}</td>
                  <td className="px-6 py-4">
                    <span className={"font-semibold " + (rule.status === 'Active' ? 'text-orange-600' : 'text-green-600')}>{rule.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onDrilldown && onDrilldown({ type: 'forwarding', data: rule })}
                      className="text-indigo-600 font-medium hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors"
                    >
                      Disable Rule
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
export default SecurityRoutingTab;
`);

// 2. SupportIntelligenceTab.tsx
fs.writeFileSync(path.join(componentsDir, 'SupportIntelligenceTab.tsx'), `import { useExchangeData } from '../../../services/exchangeIntelligence/ExchangeDataProvider';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';

const SupportIntelligenceTab = () => {
  const { data } = useExchangeData();
  const { supportIntelligence } = data;

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Open Exchange Tickets</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{supportIntelligence.openTickets}</p>
          </div>
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Avg Resolution Time</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{supportIntelligence.avgResolutionHours} <span className="text-lg text-gray-500">hours</span></p>
          </div>
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Exchange Ticket Volume Trend (14 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={supportIntelligence.ticketTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="tickets" stroke="#6366f1" fill="url(#colorTickets)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Issue Categories</h3>
          </div>
          <div className="flex-1 p-0">
            <ul className="divide-y divide-gray-100">
              {supportIntelligence.topCategories.map((cat, i) => (
                <li key={i} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{cat.category}</p>
                    <p className={"text-xs mt-1 font-medium " + (cat.trend > 0 ? 'text-red-500' : 'text-green-500')}>
                      {cat.trend > 0 ? '↑' : '↓'} {Math.abs(cat.trend)}% vs last week
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-indigo-600">{cat.count}</p>
                    <p className="text-xs text-gray-500">tickets</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SupportIntelligenceTab;
`);

// 3. Exchange360Modal.tsx
fs.writeFileSync(path.join(componentsDir, 'Exchange360Modal.tsx'), `interface Exchange360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: any;
}

const Exchange360Modal = ({ isOpen, onClose, payload }: Exchange360ModalProps) => {
  if (!isOpen || !payload) return null;

  const { type, data } = payload;

  const getTitle = () => {
    if (type === 'insight') return "Insight Investigation";
    if (type === 'forwarding') return "Rule Disablement: " + data.user;
    if (type === 'appMailbox') return "App Mailbox Details: " + data.accountName;
    return 'Exchange Deep Dive';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div 
        className="absolute inset-0 bg-gray-900 bg-opacity-25 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right h-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900 truncate pr-4">{getTitle()}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto bg-white">
          {type === 'insight' && (
            <div className="space-y-6">
              <div className="border-l-4 border-indigo-500 pl-4 py-1">
                <p className="text-sm font-semibold text-gray-900">{data.message}</p>
                <p className="text-xs text-gray-500 mt-1">Detected {data.timestamp}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase">Automated Action</p>
                <p className="text-sm text-gray-700 mt-2">CIS360 will automatically execute the necessary PowerShell scripts via Exchange Online to remediate this finding.</p>
              </div>
            </div>
          )}

          {type === 'forwarding' && (
            <div className="space-y-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <p className="text-sm text-red-800 font-semibold mb-2">Security Risk Detected</p>
                <p className="text-sm text-red-700">Corporate mail is being automatically forwarded to <strong>{data.target}</strong>.</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 text-sm">User</span>
                  <span className="font-medium text-gray-900 text-sm">{data.user}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 text-sm">Department</span>
                  <span className="font-medium text-gray-900 text-sm">{data.dept}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 text-sm">Created</span>
                  <span className="font-medium text-gray-900 text-sm">{data.created}</span>
                </div>
              </div>
            </div>
          )}

          {type === 'appMailbox' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">
                  {data.accountName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{data.accountName}</h4>
                  <p className="text-sm text-gray-500">{data.type} • {data.department}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Daily Volume</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{data.dailyVolume.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                  <p className={"text-lg font-bold mt-1 " + (data.throttled ? 'text-red-600' : 'text-green-600')}>{data.throttled ? 'Throttled' : 'Healthy'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm">
            {type === 'forwarding' ? 'Execute Disable Rule' : 'Execute Remediation'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Exchange360Modal;
`);

// 4. Dashboard.tsx (Update to wire up the Modal)
const dashboardPath = path.join(__dirname, 'src', 'pages', 'ExchangeIntelligence', 'Dashboard.tsx');
let dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

// Add Import for Exchange360Modal if it doesn't exist
if (!dashboardContent.includes('Exchange360Modal')) {
  dashboardContent = dashboardContent.replace(
    "import SupportIntelligenceTab from './components/SupportIntelligenceTab';", 
    "import SupportIntelligenceTab from './components/SupportIntelligenceTab';\nimport Exchange360Modal from './components/Exchange360Modal';"
  );
}

// Add state for drilldown
if (!dashboardContent.includes('drilldown')) {
  dashboardContent = dashboardContent.replace(
    "const [activeTab, setActiveTab] = useState('overview');",
    "const [activeTab, setActiveTab] = useState('overview');\n  const [drilldown, setDrilldown] = useState<any>(null);"
  );
}

// Update Tab rendering to pass onDrilldown to OverviewTab and SecurityRoutingTab and MailFlowEOPTab
// OverviewTab doesn't explicitly accept it in my previous component, but wait, I can just update the Dashboard rendering.
dashboardContent = dashboardContent.replace(
  "{activeTab === 'security' && <SecurityRoutingTab />}",
  "{activeTab === 'security' && <SecurityRoutingTab onDrilldown={(payload) => setDrilldown(payload)} />}"
);
dashboardContent = dashboardContent.replace(
  "{activeTab === 'overview' && <OverviewTab />}",
  "{activeTab === 'overview' && <OverviewTab onDrilldown={(payload) => setDrilldown(payload)} />}"
);
dashboardContent = dashboardContent.replace(
  "{activeTab === 'mailflow' && <MailFlowEOPTab />}",
  "{activeTab === 'mailflow' && <MailFlowEOPTab onDrilldown={(payload) => setDrilldown(payload)} />}"
);

// Add the Modal at the bottom before the last </div>
dashboardContent = dashboardContent.replace(
  "    </div>\n  );\n};",
  "      <Exchange360Modal isOpen={!!drilldown} onClose={() => setDrilldown(null)} payload={drilldown} />\n    </div>\n  );\n};"
);

fs.writeFileSync(dashboardPath, dashboardContent);

// 5. Update OverviewTab to pass drilldown to AIInsights
const overviewPath = path.join(componentsDir, 'OverviewTab.tsx');
let overviewContent = fs.readFileSync(overviewPath, 'utf8');
overviewContent = overviewContent.replace("const OverviewTab = () => {", "const OverviewTab = ({ onDrilldown }: { onDrilldown?: (payload: any) => void }) => {");
overviewContent = overviewContent.replace("<AIInsights />", "<AIInsights onDrilldown={onDrilldown} />");
fs.writeFileSync(overviewPath, overviewContent);

// 6. Update AIInsights to accept drilldown
const insightsPath = path.join(componentsDir, 'AIInsights.tsx');
let insightsContent = fs.readFileSync(insightsPath, 'utf8');
insightsContent = insightsContent.replace("const AIInsights = () => {", "const AIInsights = ({ onDrilldown }: { onDrilldown?: (payload: any) => void }) => {");
insightsContent = insightsContent.replace("<button className=", "<button onClick={() => onDrilldown && onDrilldown({ type: 'insight', data: insight })} className=");
fs.writeFileSync(insightsPath, insightsContent);

// 7. Update MailFlowEOPTab to accept drilldown
const mailflowPath = path.join(componentsDir, 'MailFlowEOPTab.tsx');
let mailflowContent = fs.readFileSync(mailflowPath, 'utf8');
mailflowContent = mailflowContent.replace("const MailFlowEOPTab = () => {", "const MailFlowEOPTab = ({ onDrilldown }: { onDrilldown?: (payload: any) => void }) => {");
mailflowContent = mailflowContent.replace(
  '<button className="text-indigo-600 font-medium hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors">\n                      Investigate\n                    </button>',
  '<button onClick={() => onDrilldown && onDrilldown({ type: \'appMailbox\', data: mbx })} className="text-indigo-600 font-medium hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors">\n                      Investigate\n                    </button>'
);
fs.writeFileSync(mailflowPath, mailflowContent);

console.log('Exchange Phase 4 Complete');
