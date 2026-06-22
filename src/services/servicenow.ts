import axios from 'axios';
import { config } from '../config';

export interface ServiceNowIncident {
  sys_id?: string;
  number: string;
  short_description: string;
  description: string;
  severity: string;
  state: string;
  created_on?: string;
}

export class ServiceNowService {
  public static async createIncident(
    shortDescription: string,
    description: string,
    severity: string
  ): Promise<ServiceNowIncident> {
    if (config.serviceNowMock) {
      console.log('[ServiceNow Mock] Simulating incident creation in ServiceNow...');
      console.log(`[ServiceNow Mock] Title: "${shortDescription}"`);
      console.log(`[ServiceNow Mock] Desc: "${description}"`);
      console.log(`[ServiceNow Mock] Severity: "${severity}"`);

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockIncidentNum = `INC${Math.floor(1000000 + Math.random() * 9000000)}`;
      const mockSysId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      return {
        sys_id: mockSysId,
        number: mockIncidentNum,
        short_description: shortDescription,
        description: description,
        severity: severity,
        state: 'New',
        created_on: new Date().toISOString()
      };
    }

    // Real API implementation
    if (!config.serviceNowUrl || !config.serviceNowUsername || !config.serviceNowPassword) {
      throw new Error('ServiceNow service is set to real mode but credentials or URL are missing in environment variables.');
    }

    // Cleanup URL to avoid double slashes
    const baseUrl = config.serviceNowUrl.replace(/\/$/, '');
    const endpoint = `${baseUrl}/api/now/table/incident`;
    const severityMap: { [key: string]: string } = {
      'Low': '3',
      'Medium': '2',
      'High': '1'
    };

    const payload = {
      short_description: shortDescription,
      description: description,
      urgency: severityMap[severity] || '3',
      impact: severityMap[severity] || '3',
      comments: 'Created automatically via CIS360 Support Agent Teams Bot'
    };

    try {
      const response = await axios.post(endpoint, payload, {
        auth: {
          username: config.serviceNowUsername,
          password: config.serviceNowPassword
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.status === 201 && response.data?.result) {
        const res = response.data.result;
        return {
          sys_id: res.sys_id,
          number: res.number,
          short_description: res.short_description,
          description: res.description || description,
          severity: severity,
          state: res.incident_state || 'New',
          created_on: res.sys_created_on
        };
      } else {
        throw new Error(`ServiceNow responded with status ${response.status}`);
      }
    } catch (error: any) {
      console.error('[ServiceNow Error] Failed to create incident ticket:', error.message);
      throw new Error(`ServiceNow API Error: ${error.message}`);
    }
  }
}
