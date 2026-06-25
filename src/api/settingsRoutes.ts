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
    const { brandName, logoUrl, categoryMappings } = req.body;
    const updated = SettingsService.updateSettings({ brandName, logoUrl, categoryMappings });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
