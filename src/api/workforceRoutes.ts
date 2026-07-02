import { Router } from 'express';

const router = Router();

// 1. Microsoft Teams Presence
router.get('/presence', (req, res) => {
  res.json({
    status: 'success',
    source: 'Microsoft Teams',
    message: 'Production integration pending. Route is configured.'
  });
});

// 2. Entra Sign-in Logs
router.get('/attendance', (req, res) => {
  res.json({
    status: 'success',
    source: 'Entra ID',
    message: 'Production integration pending. Route is configured.'
  });
});

// 3. Viva Insights
router.get('/productivity', (req, res) => {
  res.json({
    status: 'success',
    source: 'Microsoft Viva',
    message: 'Production integration pending. Route is configured.'
  });
});

// 4. Teams Meetings Data
router.get('/collaboration', (req, res) => {
  res.json({
    status: 'success',
    source: 'Microsoft Teams Meetings',
    message: 'Production integration pending. Route is configured.'
  });
});

// 5. Intune Device Activity
router.get('/devices', (req, res) => {
  res.json({
    status: 'success',
    source: 'Microsoft Intune',
    message: 'Production integration pending. Route is configured.'
  });
});

export default router;
