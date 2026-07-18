const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('C:\\Users\\Jessica\\.gemini\\antigravity\\brain\\4bb1f34c-11a4-49a9-9a26-90ffea6b1135\\use_case_classification.md', 'utf8');

const lines = content.split('\n');

const exoUseCases = [];

let currentActor = 'User';

for (const line of lines) {
  if (line.includes('## 👤 End User Support Use Cases')) {
    currentActor = 'User';
  } else if (line.includes('## 🛠️ Help Desk Performing Use Cases')) {
    currentActor = 'Helpdesk';
  }

  const match = line.match(/- \*\*(EXC\d+)\*\* (.*)/);
  if (match) {
    const id = match[1];
    let name = match[2].trim();
    if (name.includes(' (Distribution List)')) name = name.replace(' (Distribution List)', ' DL');
    if (name.includes(' (M365 Group)')) name = name.replace(' (M365 Group)', ' Group');
    exoUseCases.push({
      id: id,
      name: name,
      description: name,
      actor: currentActor,
      approvalRequired: false,
      category: 'EXO'
    });
  }
}

const useCasesFilePath = path.join(__dirname, 'control-plane', 'src', 'useCases.ts');
let useCasesTs = fs.readFileSync(useCasesFilePath, 'utf8');

// replace Identity with Entra
useCasesTs = useCasesTs.replace(/category: 'Identity'/g, "category: 'Entra'");

// append EXO use cases
const jsonString = JSON.stringify(exoUseCases, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'");

useCasesTs = useCasesTs.replace('];', ',\n' + jsonString.substring(2, jsonString.length - 2) + '\n];');

fs.writeFileSync(useCasesFilePath, useCasesTs);
console.log('Updated useCases.ts with ' + exoUseCases.length + ' EXO use cases.');
