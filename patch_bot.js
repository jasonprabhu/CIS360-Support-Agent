const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'src', 'bot.ts');
let content = fs.readFileSync(p, 'utf8');

// Inside `handleNaturalLanguageInput`, we need to handle the new `escalate` type
content = content.replace(
  /else if \(aiResponse\.type === 'execute'\) \{/,
  `else if (aiResponse.type === 'escalate') {
        const card = CardBuilder.textResponseCard(
          'L3 Escalation Required',
          \`I have determined that this issue (\${aiResponse.summary}) is related to \${aiResponse.domain}, but it requires an L3 Engineering escalation as there is no direct automation available.\\n\\nI am routing this to the \${aiResponse.domain} support queue.\`,
          'warning'
        );
        await context.sendActivity({ attachments: [card] });
        
        // Initiate the human handoff specifically to the relevant domain team
        await (this as any).initiateHandoff(context, aiResponse.domain);
        
      } else if (aiResponse.type === 'execute') {`
);

fs.writeFileSync(p, content);
console.log('Successfully updated bot.ts');
