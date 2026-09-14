import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';

const IssuesTable = () => {
  const { data } = useIdentityData();
  const { issues } = data;

  const renderRisk = (risk: string) => {
    let color = 'bg-gray-100 text-gray-800';
    if (risk === 'High') color = 'bg-red-100 text-red-800';
    if (risk === 'Medium') color = 'bg-orange-100 text-orange-800';
    if (risk === 'Low') color = 'bg-green-100 text-green-800';
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{risk}</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-semibold text-gray-900">Top Identity Issues</h3>
        <div className="flex gap-3">
          <input type="text" placeholder="Search users or issues..." className="border border-gray-300 rounded-md text-sm px-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500 w-64" />
          <button className="border border-gray-300 rounded-md bg-white text-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-50">Filter</button>
          <button className="border border-gray-300 rounded-md bg-white text-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-50">Export</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-semibold">User</th>
              <th className="px-6 py-3 font-semibold">Issue</th>
              <th className="px-6 py-3 font-semibold">Risk</th>
              <th className="px-6 py-3 font-semibold">Impact</th>
              <th className="px-6 py-3 font-semibold">Age</th>
              <th className="px-6 py-3 font-semibold text-right">Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="bg-white border-b hover:bg-gray-50 transition-colors cursor-pointer group">
                <td className="px-6 py-4 font-medium text-gray-900">{issue.userName}</td>
                <td className="px-6 py-4">{issue.issue}</td>
                <td className="px-6 py-4">{renderRisk(issue.risk)}</td>
                <td className="px-6 py-4">{issue.impact}</td>
                <td className="px-6 py-4">{issue.ageDays} days</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-600 font-medium hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {issue.recommendedAction}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssuesTable;
