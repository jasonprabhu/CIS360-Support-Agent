import { ISmsProvider } from './ISmsProvider';
import { MockSmsProvider } from './providers/MockSmsProvider';
import { AzureSmsProvider } from './providers/AzureSmsProvider';
import { SettingsService } from '../settingsService';

export class SmsFactory {
  public static getProvider(): ISmsProvider {
    const settings = SettingsService.getSettings();

    // If ACS is configured in the admin portal, use Azure. Otherwise fallback to Mock.
    if (settings.acsConnectionString && settings.acsPhoneNumber && settings.acsConnectionString.trim() !== '') {
      return new AzureSmsProvider(settings.acsConnectionString, settings.acsPhoneNumber);
    }

    // Default to Mock for local dev or when unconfigured
    return new MockSmsProvider();
  }
}
