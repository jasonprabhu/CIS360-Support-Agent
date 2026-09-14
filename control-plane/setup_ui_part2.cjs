const fs = require('fs');
const path = require('path');
const componentsDir = path.join(__dirname, 'src', 'pages', 'IdentityIntelligence', 'components');

// AIInsights.tsx
const aiInsightsCode = `import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';

const AIInsights = () => {
  const { data } = useIdentityData();
  const { insights } = data;

  const getSeverityStyle = (severity: string) => {
    switch(severity) {
      case 'Critical': return 'border-red-500 bg-red-50 text-red-900';
      case 'Attention Required': return 'border-orange-500 bg-orange-50 text-orange-900';
      case 'Emerging Pattern': return 'border-blue-500 bg-blue-50 text-blue-900';
      case 'Improvement': return 'border-green-500 bg-green-50 text-green-900';
      case 'License Opportunity': return 'border-purple-500 bg-purple-50 text-purple-900';
      default: return 'border-gray-500 bg-gray-50 text-gray-900';
    }
  };

  const getSeverityDot = (severity: string) => {
    switch(severity) {
      case 'Critical': return '🔴';
      case 'Attention Required': return '🟠';
      case 'Emerging Pattern': return '🔵';
      case 'Improvement': return '🟢';
      case 'License Opportunity': return '🟣';
      default: return '⚪';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        CIS360 Intelligence
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {insights.map(insight => (
          <div key={insight.id} className={\`border-l-4 rounded-r-lg p-4 flex flex-col justify-between h-full shadow-sm \${getSeverityStyle(insight.severity)}\`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{getSeverityDot(insight.severity)} {insight.severity}</span>
                <span className="text-xs opacity-70">{insight.timestamp}</span>
              </div>
              <p className="text-sm font-medium mb-3 leading-snug">{insight.message}</p>
            </div>
            <div>
              <p className="text-xs font-semibold opacity-80 mb-3">Impact: {insight.impact}</p>
              <div className="flex gap-2">
                <button className="text-xs font-semibold bg-white/50 hover:bg-white px-2 py-1.5 rounded transition-colors flex-1 text-center">Investigate</button>
                <button className="text-xs font-semibold bg-white/50 hover:bg-white px-2 py-1.5 rounded transition-colors flex-1 text-center">Explain</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
`;
fs.writeFileSync(path.join(componentsDir, 'AIInsights.tsx'), aiInsightsCode);

// RiskAndAccess.tsx
const riskAndAccessCode = `const RiskAndAccess = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Intelligence</h3>
        <div className="h-64 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
          [ Risk Trend & Distribution Visualizations ]
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Access & Privilege Intelligence</h3>
        <div className="h-64 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
          [ Privilege Trends & Access Anomalies ]
        </div>
      </div>
    </div>
  );
};

export default RiskAndAccess;
`;
fs.writeFileSync(path.join(componentsDir, 'RiskAndAccess.tsx'), riskAndAccessCode);

// LifecycleAndLicense.tsx
const lifecycleLicenseCode = `const LifecycleAndLicense = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Identity Lifecycle</h3>
        <div className="h-64 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
          [ Lifecycle Flow Visualization (Joiners/Leavers) ]
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">License Intelligence</h3>
        <div className="h-64 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
          [ License Utilization & Cost Savings ]
        </div>
      </div>
    </div>
  );
};

export default LifecycleAndLicense;
`;
fs.writeFileSync(path.join(componentsDir, 'LifecycleAndLicense.tsx'), lifecycleLicenseCode);

// UserExperience.tsx
const userExperienceCode = `const UserExperience = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Experience & Support Intelligence</h3>
      <div className="h-64 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
        [ Experience Score by Department & Top Identity Issues/Tickets ]
      </div>
    </div>
  );
};

export default UserExperience;
`;
fs.writeFileSync(path.join(componentsDir, 'UserExperience.tsx'), userExperienceCode);

// IssuesTable.tsx
const issuesTableCode = `import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';

const IssuesTable = () => {
  const { data } = useIdentityData();
  const { issues } = data;

  const renderRisk = (risk: string) => {
    let color = 'bg-gray-100 text-gray-800';
    if (risk === 'High') color = 'bg-red-100 text-red-800';
    if (risk === 'Medium') color = 'bg-orange-100 text-orange-800';
    if (risk === 'Low') color = 'bg-green-100 text-green-800';
    return <span className={\`px-2.5 py-0.5 rounded-full text-xs font-medium \${color}\`}>{risk}</span>;
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
`;
fs.writeFileSync(path.join(componentsDir, 'IssuesTable.tsx'), issuesTableCode);

// Identity360Modal.tsx
const identity360ModalCode = `const Identity360Modal = () => {
  // Placeholder for the slide-out drill down panel.
  // In a full implementation, this would read an \`activeUserId\` from context.
  return null;
};

export default Identity360Modal;
`;
fs.writeFileSync(path.join(componentsDir, 'Identity360Modal.tsx'), identity360ModalCode);

console.log('UI Components (Part 2) created.');
