import { useState } from 'react';
import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';

const IssuesTable = () => {
  const { data } = useIdentityData();
  const { issues } = data;
  const [searchTerm, setSearchTerm] = useState('');

  const renderRisk = (risk: string) => {
    let color = 'bg-gray-100 text-gray-800';
    if (risk === 'High') color = 'bg-red-100 text-red-800';
    if (risk === 'Medium') color = 'bg-orange-100 text-orange-800';
    if (risk === 'Low') color = 'bg-green-100 text-green-800';
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{risk}</span>;
  };

  const filteredIssues = issues.filter(issue => 
    issue.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    issue.issue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Top Identity Issues</h3>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search users or issues..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md text-sm pl-9 pr-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
          <button className="border border-gray-300 rounded-md bg-white text-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filter
          </button>
          <button className="border border-gray-300 rounded-md bg-white text-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Export
          </button>
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
            {filteredIssues.map((issue) => (
              <tr key={issue.id} className="bg-white border-b hover:bg-gray-50 transition-colors cursor-pointer group">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {issue.userName.charAt(0)}
                  </div>
                  {issue.userName}
                </td>
                <td className="px-6 py-4 font-medium text-gray-700">{issue.issue}</td>
                <td className="px-6 py-4">{renderRisk(issue.risk)}</td>
                <td className="px-6 py-4 text-gray-600">{issue.impact}</td>
                <td className="px-6 py-4">{issue.ageDays} days</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-600 font-medium hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {issue.recommendedAction}
                  </button>
                </td>
              </tr>
            ))}
            {filteredIssues.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No issues found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssuesTable;
