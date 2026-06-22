import express from 'express';
import {
  CloudAdapter,
  ConfigurationServiceClientCredentialFactory,
  createBotFrameworkAuthenticationFromConfiguration
} from 'botbuilder';
import { config } from './config';
import { CIS360SupportBot } from './bot';

// 1. Create authentication credentials factory and credentials provider
const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
  MicrosoftAppId: config.microsoftAppId,
  MicrosoftAppPassword: config.microsoftAppPassword,
  MicrosoftAppType: config.microsoftAppType,
  MicrosoftAppTenantId: config.microsoftAppTenantId
});

const botFrameworkAuthentication = createBotFrameworkAuthenticationFromConfiguration(
  {
    get: (key: string) => {
      const map: { [key: string]: any } = {
        MicrosoftAppId: config.microsoftAppId,
        MicrosoftAppPassword: config.microsoftAppPassword,
        MicrosoftAppType: config.microsoftAppType,
        MicrosoftAppTenantId: config.microsoftAppTenantId
      };
      return map[key];
    },
    set: (key: string, value: any) => {}
  } as any,
  credentialsFactory
);

// 2. Create Cloud Adapter
const adapter = new CloudAdapter(botFrameworkAuthentication);

// Catch-all for adapter errors
adapter.onTurnError = async (context, error) => {
  console.error(`\n [onTurnError] Unhandled error in bot execution: ${error}`);
  console.error(error);

  // Send a notification to the user
  try {
    await context.sendActivity('The bot encountered an error. Please try again later or contact your administrator.');
  } catch (err) {
    console.error(`Failed to send turn error message: ${err}`);
  }
};

// 3. Instantiate the Bot Activity Handler
const bot = new CIS360SupportBot();

// 4. Set up Express web server
const app = express();
app.use(express.json());

// Main bot message routing endpoint
app.post('/api/messages', async (req, res) => {
  try {
    // Route incoming requests to the adapter for processing
    await adapter.process(req, res, async (context) => {
      // Route context to bot activity handler
      await bot.run(context);
    });
  } catch (err: any) {
    console.error('[Adapter Error] Failed to process incoming request:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Simple status probe endpoint for health checks
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    botName: 'CIS360 Support',
    serviceNowMode: config.serviceNowMock ? 'MOCK (Simulation)' : 'REAL (REST API)',
    port: config.port
  });
});

// Start the server
const port = config.port;
app.listen(port, () => {
  console.log(`\n🚀 CIS360 Support Agent Bot is running on http://localhost:${port}`);
  console.log(`   👉 Bot API Endpoint: http://localhost:${port}/api/messages`);
  console.log(`   👉 Status Endpoint:   http://localhost:${port}/api/status`);
  console.log(`   ⚙️  ServiceNow Integration: ${config.serviceNowMock ? 'MOCK SIMULATION' : 'REAL REST API'}`);
  console.log(`   👥 Support Escalation Channel: ${config.supportChannelId}`);
});
