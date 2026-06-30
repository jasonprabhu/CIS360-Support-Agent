import nodemailer from 'nodemailer';
import { SettingsService } from '../settingsService';

export class EmailProvider {
  private transporter: nodemailer.Transporter | null = null;
  private fromAddress: string = '';

  constructor() {
    const settings = SettingsService.getSettings();
    if (settings.smtpHost && settings.smtpPort && settings.smtpUser && settings.smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: parseInt(settings.smtpPort, 10),
        secure: parseInt(settings.smtpPort, 10) === 465, // true for 465, false for other ports
        auth: {
          user: settings.smtpUser,
          pass: settings.smtpPass,
        },
      });
      this.fromAddress = settings.smtpFrom || settings.smtpUser;
      console.log(`[EmailProvider] Initialized SMTP for ${settings.smtpHost}:${settings.smtpPort}`);
    } else {
      console.log('[EmailProvider] SMTP settings not fully configured. Will use console.log mock.');
    }
  }

  public async sendEmail(to: string, subject: string, text: string): Promise<boolean> {
    if (!this.transporter) {
      console.log(`[EmailProvider Mock] Would have sent email to ${to}`);
      console.log(`[EmailProvider Mock] Subject: ${subject}`);
      console.log(`[EmailProvider Mock] Body: ${text}`);
      return true; // Simulate success
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject,
        text,
      });
      console.log(`[EmailProvider] Message sent: ${info.messageId}`);
      return true;
    } catch (err: any) {
      console.error('[EmailProvider] Error sending email:', err.message);
      return false;
    }
  }
}
