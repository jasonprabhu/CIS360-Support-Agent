import fs from 'fs';
import path from 'path';

export interface BotSettings {
  brandName: string;
  logoUrl: string;
  categoryMappings: Record<string, string>;
}

const SETTINGS_FILE_PATH = path.join(__dirname, '../../data/settings.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dir = path.dirname(SETTINGS_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export class SettingsService {
  private static defaultSettings: BotSettings = {
    brandName: 'CIS360 Support',
    logoUrl: '', // Default empty, can fallback to text or a default SVG
    categoryMappings: {}
  };

  public static getSettings(): BotSettings {
    ensureDataDir();
    try {
      if (fs.existsSync(SETTINGS_FILE_PATH)) {
        const data = fs.readFileSync(SETTINGS_FILE_PATH, 'utf8');
        return { ...this.defaultSettings, ...JSON.parse(data) };
      }
    } catch (err) {
      console.error('[SettingsService] Failed to read settings.json', err);
    }
    return { ...this.defaultSettings };
  }

  public static updateSettings(newSettings: Partial<BotSettings>): BotSettings {
    ensureDataDir();
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    try {
      fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(updated, null, 2));
    } catch (err) {
      console.error('[SettingsService] Failed to write settings.json', err);
    }
    return updated;
  }
}
