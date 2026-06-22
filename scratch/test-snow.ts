import { ServiceNowService } from '../src/services/servicenow';

async function testServiceNow() {
  console.log('--- Testing ServiceNow Incident Creation ---');
  try {
    const incident = await ServiceNowService.createIncident(
      'VPN connection timeout',
      'User experiences timeout after 10 minutes of active session. Tested on Windows client.',
      'Medium'
    );
    console.log('Result:');
    console.log(`- Incident Number: ${incident.number}`);
    console.log(`- Sys ID:          ${incident.sys_id}`);
    console.log(`- State:           ${incident.state}`);
    console.log(`- Summary:         ${incident.short_description}`);
    console.log(`- Description:     ${incident.description}`);
    console.log(`- Created On:      ${incident.created_on}`);
    console.log('SUCCESS: ServiceNow mock returned a valid response.');
  } catch (error: any) {
    console.error('ERROR: Failed to run ServiceNow test:', error.message);
  }
}

testServiceNow();
