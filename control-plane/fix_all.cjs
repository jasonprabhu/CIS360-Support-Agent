const fs = require('fs');
const path = require('path');
const componentsDir = path.join(__dirname, 'src', 'pages', 'IdentityIntelligence', 'components');

const fixFile = (fp) => {
  let content = fs.readFileSync(fp, 'utf8');
  // I need to replace \"{\`\" with just \"{`\" and \"\`}\" with \"`}\"
  // Wait, the actual text in the files is probably \"{\\`\" because I used write_to_file.
  // Let me just regex replace all backslash-escaped backticks and dollar signs.
  content = content.replace(/\\\\`/g, '`');
  content = content.replace(/\\\\\\$/g, '$');
  fs.writeFileSync(fp, content);
};

fixFile(path.join(__dirname, 'src', 'pages', 'IdentityIntelligence', 'Dashboard.tsx'));
fixFile(path.join(componentsDir, 'AIInsights.tsx'));
fixFile(path.join(componentsDir, 'Identity360Modal.tsx'));
fixFile(path.join(componentsDir, 'IssuesTable.tsx'));
fixFile(path.join(componentsDir, 'KPIGrid.tsx'));

console.log('Fixed syntax errors');
