const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'src', 'pages');

const pages = [
  'MasterDashboard.tsx',
  'IdentityIntelligence.tsx',
  'ExchangeIntelligence.tsx',
  'SharePointIntelligence.tsx',
  'TeamsIntelligence.tsx',
  'TeamsVoiceIntelligence.tsx',
  'PowerPlatformIntelligence.tsx'
];

pages.forEach(file => {
  const fp = path.join(pagesDir, file);
  let content = fs.readFileSync(fp, 'utf8');
  content = content.replace("import React from 'react';\n\n", '');
  fs.writeFileSync(fp, content);
  console.log('Fixed ' + file);
});
