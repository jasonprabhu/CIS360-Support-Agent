import { Router } from 'express';
import { getDb } from './database';

const router = Router();

// Middleware to extract simple auth token
const extractUser = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // In a real prod env, we'd validate the JWT signature with Azure AD here
    // For this simulation, we'll just extract the payload if it's a simple token, or use a fallback
    req.userEmail = authHeader.split(' ')[1] || 'UnknownUser';
  } else {
    req.userEmail = req.body?.user || 'CurrentUser';
  }
  next();
};

router.use(extractUser);

router.post('/checkin', async (req: any, res: any) => {
  try {
    const db = await getDb();
    const timestamp = new Date().toISOString();
    await db.run('INSERT INTO workday_events (user_email, event_type, timestamp) VALUES (?, ?, ?)', [req.userEmail, 'CHECK_IN', timestamp]);
    res.json({ status: 'success', message: `Checked in successfully at ${new Date().toLocaleTimeString()}`, event: { type: 'CHECK_IN', timestamp, user: req.userEmail } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to record check-in' });
  }
});

router.post('/checkout', async (req: any, res: any) => {
  try {
    const db = await getDb();
    const timestamp = new Date().toISOString();
    await db.run('INSERT INTO workday_events (user_email, event_type, timestamp) VALUES (?, ?, ?)', [req.userEmail, 'CHECK_OUT', timestamp]);
    res.json({ status: 'success', message: 'Checked out successfully. Total hours today: 8h 14m', event: { type: 'CHECK_OUT', timestamp, user: req.userEmail } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to record check-out' });
  }
});

router.post('/break/start', async (req: any, res: any) => {
  try {
    const db = await getDb();
    const timestamp = new Date().toISOString();
    await db.run('INSERT INTO workday_events (user_email, event_type, timestamp) VALUES (?, ?, ?)', [req.userEmail, 'BREAK_START', timestamp]);
    res.json({ status: 'success', message: 'Break started', event: { type: 'BREAK_START', timestamp, user: req.userEmail } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to start break' });
  }
});

router.post('/break/end', async (req: any, res: any) => {
  try {
    const db = await getDb();
    const timestamp = new Date().toISOString();
    await db.run('INSERT INTO workday_events (user_email, event_type, timestamp) VALUES (?, ?, ?)', [req.userEmail, 'BREAK_END', timestamp]);
    res.json({ status: 'success', message: 'Break ended', event: { type: 'BREAK_END', timestamp, user: req.userEmail } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to end break' });
  }
});

router.get('/me', async (req: any, res: any) => {
  res.json({
    status: 'success',
    data: {
      todayStatus: 'Active',
      checkedInTime: '09:12 AM',
      totalWorkedHours: '4h 30m',
      currentBreakStatus: 'Not on break',
      lastCheckOut: 'Yesterday at 05:45 PM'
    }
  });
});

router.get('/history', async (req: any, res: any) => {
  try {
    const db = await getDb();
    const events = await db.all('SELECT * FROM workday_events ORDER BY timestamp DESC LIMIT 50');
    res.json({
      status: 'success',
      data: events.map(e => ({ type: e.event_type, timestamp: e.timestamp, user: e.user_email }))
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to load history' });
  }
});

router.get('/team', (req, res) => {
  res.json({
    status: 'success',
    data: [
      { member: 'Jane Doe', presence: 'Available', checkedIn: true },
      { member: 'John Smith', presence: 'Busy', checkedIn: true },
      { member: 'Alice Johnson', presence: 'Offline', checkedIn: false }
    ]
  });
});

export default router;
