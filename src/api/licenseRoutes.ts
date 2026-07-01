import { Router } from 'express';
import { GraphService } from '../services/graphService';

const router = Router();

router.get('/intelligence', async (req, res) => {
  try {
    const users = await GraphService.getLicenseIntelligenceData();
    res.json({ success: true, data: { users } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
