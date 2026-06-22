import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

export const config = {
  port: process.env.PORT || '3978',
  microsoftAppId: process.env.MicrosoftAppId || process.env.MicrosoftAppID || process.env.MICROSOFT_APP_ID || '',
  microsoftAppPassword: process.env.MicrosoftAppPassword || process.env.MicrosoftAppPASSWORD || process.env.MICROSOFT_APP_PASSWORD || '',
  microsoftAppType: process.env.MicrosoftAppType || process.env.MICROSOFT_APP_TYPE || 'MultiTenant',
  microsoftAppTenantId: process.env.MicrosoftAppTenantId || process.env.MicrosoftAppTenantID || process.env.MICROSOFT_APP_TENANT_ID || process.env.TenantId || process.env.TenantID || '',
  serviceNowMock: process.env.SERVICENOW_MOCK === 'true',
  serviceNowUrl: process.env.SERVICENOW_URL || '',
  serviceNowUsername: process.env.SERVICENOW_USERNAME || '',
  serviceNowPassword: process.env.SERVICENOW_PASSWORD || '',
  supportChannelId: process.env.SUPPORT_CHANNEL_ID || 'support-agent-channel-id',
  m365Mock: process.env.M365_MOCK !== 'false', // Default to true (mocking) if not explicitly set to false
  m365TenantId: process.env.M365_TENANT_ID || '',
  m365ClientId: process.env.M365_CLIENT_ID || '',
  m365ClientSecret: process.env.M365_CLIENT_SECRET || ''
};
