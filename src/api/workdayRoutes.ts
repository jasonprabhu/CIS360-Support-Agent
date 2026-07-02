import { Router } from 'express';

const router = Router();

// Mock in-memory store for workday events
const workdayEvents: any[] = [];

router.post('/checkin', (req, res) => {
  const event = {
    type: 'CHECK_IN',
    timestamp: new Date().toISOString(),
    user: req.body?.user || 'CurrentUser'
  };
  workdayEvents.push(event);
  res.json({ status: 'success', message: `Checked in successfully at ${new Date().toLocaleTimeString()}`, event });
});

router.post('/checkout', (req, res) => {
  const event = {
    type: 'CHECK_OUT',
    timestamp: new Date().toISOString(),
    user: req.body?.user || 'CurrentUser'
  };
  workdayEvents.push(event);
  res.json({ status: 'success', message: 'Checked out successfully. Total hours today: 8h 14m', event });
});

router.post('/break/start', (req, res) => {
  const event = {
    type: 'BREAK_START',
    timestamp: new Date().toISOString(),
    user: req.body?.user || 'CurrentUser'
  };
  workdayEvents.push(event);
  res.json({ status: 'success', message: 'Break started', event });
});

router.post('/break/end', (req, res) => {
  const event = {
    type: 'BREAK_END',
    timestamp: new Date().toISOString(),
    user: req.body?.user || 'CurrentUser'
  };
  workdayEvents.push(event);
  res.json({ status: 'success', message: 'Break ended', event });
});

router.get('/me', (req, res) => {
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

router.get('/history', (req, res) => {
  res.json({
    status: 'success',
    data: workdayEvents
  });
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
