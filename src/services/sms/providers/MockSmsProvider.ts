import { ISmsProvider } from '../ISmsProvider';

export class MockSmsProvider implements ISmsProvider {
  public async sendSms(to: string, message: string): Promise<boolean> {
    console.log(`\n[MOCK SMS] To: ${to}`);
    console.log(`[MOCK SMS] Message: ${message}\n`);
    return true; // Simulate success
  }
}
