import { useState } from 'react';

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
