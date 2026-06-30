import { Router } from 'express';
import { SettingsService } from '../services/settingsService';

const router = Router();

// GET /api/settings
router.get('/', (req, res) => {
  try {
    const settings = SettingsService.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/settings
router.post('/', (req, res) => {
  try {
    const { brandName, logoUrl, categoryMappings, acsConnectionString, acsPhoneNumber, enabledUseCases, supportEmail, supportPhone, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom } = req.body;
    const updated = SettingsService.updateSettings({ 
      brandName, 
      logoUrl, 
      categoryMappings, 
      acsConnectionString, 
      acsPhoneNumber,
      enabledUseCases,
      supportEmail,
      supportPhone,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      smtpFrom
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/settings/test-sms
router.post('/test-sms', async (req, res) => {
  try {
    const { testPhoneNumber } = req.body;
    if (!testPhoneNumber) {
      return res.status(400).json({ error: 'Test phone number is required' });
    }

    const { SmsFactory } = await import('../services/sms/SmsFactory');
    const smsProvider = SmsFactory.getProvider();
    const success = await smsProvider.sendSms(testPhoneNumber, 'This is a test message from CIS360 Admin Portal.');
    
    if (success) {
      res.json({ success: true, message: 'Test SMS sent successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to send Test SMS. Check server logs.' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/settings/test-email
router.post('/test-email', async (req, res) => {
  try {
    const { testEmail } = req.body;
    if (!testEmail) {
      return res.status(400).json({ error: 'Test email address is required' });
    }

    const { EmailProvider } = await import('../services/email/EmailProvider');
    const emailProvider = new EmailProvider();
    const success = await emailProvider.sendEmail(testEmail, 'Test SMTP Configuration', 'This is a test message from CIS360 Admin Portal to verify SMTP configuration.');
    
    if (success) {
      res.json({ success: true, message: 'Test Email sent successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to send Test Email. Check server logs.' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
