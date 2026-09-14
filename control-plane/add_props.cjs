const fs = require('fs');
const path = require('path');
const componentsDir = path.join(__dirname, 'src', 'pages', 'IdentityIntelligence', 'components');

const updateComponent = (filename, propName) => {
  let content = fs.readFileSync(path.join(componentsDir, filename), 'utf8');
  content = content.replace(\`const \${propName} = () => {\`, \`interface \${propName}Props { onDrilldown?: (data: any) => void; }\\n\\nconst \${propName} = ({ onDrilldown }: \${propName}Props) => {\`);
  fs.writeFileSync(path.join(componentsDir, filename), content);
};

updateComponent('IssuesTable.tsx', 'IssuesTable');
updateComponent('RiskAndAccess.tsx', 'RiskAndAccess');
updateComponent('LifecycleAndLicense.tsx', 'LifecycleAndLicense');
updateComponent('UserExperience.tsx', 'UserExperience');

console.log('Added onDrilldown to remaining components');
