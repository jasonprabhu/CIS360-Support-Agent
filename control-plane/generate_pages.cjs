const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'src', 'pages');

const pages = [
  { file: 'MasterDashboard.tsx', name: 'MasterDashboard', title: 'Master Intelligence Dashboard' },
  { file: 'IdentityIntelligence.tsx', name: 'IdentityIntelligence', title: 'Identity Intelligence' },
  { file: 'ExchangeIntelligence.tsx', name: 'ExchangeIntelligence', title: 'Exchange Intelligence' },
  { file: 'SharePointIntelligence.tsx', name: 'SharePointIntelligence', title: 'SharePoint & OneDrive Intelligence' },
  { file: 'TeamsIntelligence.tsx', name: 'TeamsIntelligence', title: 'Teams Intelligence' },
  { file: 'TeamsVoiceIntelligence.tsx', name: 'TeamsVoiceIntelligence', title: 'Teams Voice Intelligence' },
  { file: 'PowerPlatformIntelligence.tsx', name: 'PowerPlatformIntelligence', title: 'Power Platform Intelligence' }
];

pages.forEach(p => {
  const content = `import React from 'react';

const ${p.name} = () => {
  return (
    <div className="animate-fade-in p-6">
      <div className="page-header mb-6">
        <h2 className="text-2xl font-bold text-gray-800">${p.title}</h2>
        <p className="text-gray-500">KPIs and metrics for ${p.title} will be displayed here.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        <p className="text-lg font-medium text-gray-900">Dashboard Layout</p>
        <p className="mt-1">We will add the detailed KPI cards to this page next.</p>
      </div>
    </div>
  );
};

export default ${p.name};
`;
  fs.writeFileSync(path.join(pagesDir, p.file), content);
  console.log('Created ' + p.file);
});
