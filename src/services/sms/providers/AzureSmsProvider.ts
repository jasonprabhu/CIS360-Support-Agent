import { SmsClient } from "@azure/communication-sms";
import { ISmsProvider } from '../ISmsProvider';

export class AzureSmsProvider implements ISmsProvider {
  private client: SmsClient;
  private fromNumber: string;

  constructor(connectionString: string, fromNumber: string) {
    this.client = new SmsClient(connectionString);
    this.fromNumber = fromNumber;
  }

  public async sendSms(to: string, message: string): Promise<boolean> {
    try {
      const sendResults = await this.client.send({
        from: this.fromNumber,
        to: [to],
        message: message
      });

      // ACS can return an array of results if sending to multiple numbers. We only sent to one.
      const result = sendResults[0];
      if (result.successful) {
        console.log(`[AzureSmsProvider] Successfully sent SMS to ${to}. MessageId: ${result.messageId}`);
        return true;
      } else {
        console.error(`[AzureSmsProvider] Failed to send SMS. Error: ${result.errorMessage}`);
        return false;
      }
    } catch (error: any) {
      console.error(`[AzureSmsProvider] Exception occurred while sending SMS: ${error.message}`);
      return false;
    }
  }
}
