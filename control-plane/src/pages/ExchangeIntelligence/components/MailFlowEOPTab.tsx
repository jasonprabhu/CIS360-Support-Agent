import { useExchangeData } from '../../../services/exchangeIntelligence/ExchangeDataProvider';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MailFlowEOPTab = ({ onDrilldown }: { onDrilldown?: (payload: any) => void }) => {
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
                    <button onClick={() => onDrilldown && onDrilldown({ type: 'appMailbox', data: mbx })} className="text-indigo-600 font-medium hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors">
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
