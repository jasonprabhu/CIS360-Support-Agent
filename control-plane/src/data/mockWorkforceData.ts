export interface WorkforceRecord {
  id: string;
  name: string;
  department: string;
  team: string;
  manager: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  presenceState: 'Available' | 'Busy' | 'In Call' | 'Away' | 'Offline' | 'DND';
  attendanceStatus: 'Present' | 'Late' | 'Absent' | 'Early Logout';
  productivityRisk: 'Low' | 'Medium' | 'High';
  checkInTime: string | null;
  checkOutTime: string | null;
  totalHours: number; // in hours
  lateLogin: boolean;
  breakDuration: number; // in minutes
  currentDuration: number; // current presence duration in minutes
  manualOverride: boolean; // did they manually set presence?
  lastActivity: string; // ISO string
  meetingsAttended: number;
  meetingsMissed: number;
  callsMade: number;
  callsReceived: number;
  chatVolume: number;
  responseAvgMinutes: number;
  focusTimeHours: number;
  afterHoursWork: number; // in hours
  weekendWork: number; // in hours
  contextSwitchingScore: number; // 0-100
  burnoutRisk: boolean;
}

const DEPARTMENTS = ['Finance', 'HR', 'Sales', 'Operations', 'Engineering', 'IT', 'Legal', 'Marketing'];
const TEAMS = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Echo', 'Core Services', 'Customer Success', 'Platform', 'Security'];
const MANAGERS = ['Sarah Johnson', 'Michael Chen', 'David Patel', 'Elena Rodriguez', 'James Wilson', 'Lisa Wong'];
const LOCATIONS = ['New York', 'London', 'Remote', 'San Francisco', 'Singapore', 'Austin', 'Toronto'];
const FIRST_NAMES = ['John', 'Jane', 'Alex', 'Chris', 'Taylor', 'Jordan', 'Casey', 'Sam', 'Morgan', 'Riley'];
const LAST_NAMES = ['Smith', 'Doe', 'Brown', 'Lee', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez'];

export const mockWorkforceData: WorkforceRecord[] = (() => {
  const records: WorkforceRecord[] = [];
  const now = new Date();

  for (let i = 0; i < 500; i++) {
    const name = `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
    const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const workMode = Math.random() > 0.6 ? 'Remote' : Math.random() > 0.3 ? 'Hybrid' : 'Onsite';
    
    // Presence probabilities
    const presenceRand = Math.random();
    const presenceState = presenceRand > 0.4 ? 'Available' : presenceRand > 0.2 ? 'Busy' : presenceRand > 0.1 ? 'In Call' : presenceRand > 0.05 ? 'Away' : presenceRand > 0.02 ? 'DND' : 'Offline';
    
    // Attendance probabilities
    const absent = Math.random() < 0.05; // 5% absent
    const late = !absent && Math.random() < 0.15; // 15% late
    const early = !absent && !late && Math.random() < 0.05;
    
    const attendanceStatus = absent ? 'Absent' : late ? 'Late' : early ? 'Early Logout' : 'Present';
    
    let checkInTime = null;
    let checkOutTime = null;
    let totalHours = 0;
    let breakDuration = 0;

    if (!absent) {
      const checkInHour = late ? Math.floor(Math.random() * 2) + 9 : Math.floor(Math.random() * 2) + 7; // 7-8 or 9-10
      const checkInMinute = Math.floor(Math.random() * 60);
      checkInTime = `${checkInHour.toString().padStart(2, '0')}:${checkInMinute.toString().padStart(2, '0')} AM`;
      
      totalHours = early ? Math.floor(Math.random() * 4) + 2 : Math.floor(Math.random() * 4) + 6;
      breakDuration = Math.floor(Math.random() * 60) + 15;
    }

    const productivityRiskRand = Math.random();
    const productivityRisk = productivityRiskRand > 0.85 ? 'High' : productivityRiskRand > 0.6 ? 'Medium' : 'Low';
    
    const afterHoursWork = Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0;
    const burnoutRisk = afterHoursWork > 1 || productivityRisk === 'High';

    records.push({
      id: `emp-${i}`,
      name: `${name} ${i}`,
      department,
      team: TEAMS[Math.floor(Math.random() * TEAMS.length)],
      manager: MANAGERS[Math.floor(Math.random() * MANAGERS.length)],
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      workMode,
      presenceState,
      attendanceStatus,
      productivityRisk,
      checkInTime,
      checkOutTime,
      totalHours,
      lateLogin: late,
      breakDuration,
      currentDuration: Math.floor(Math.random() * 300), // up to 5 hours in state
      manualOverride: Math.random() > 0.8,
      lastActivity: new Date(now.getTime() - Math.floor(Math.random() * 10000000)).toISOString(),
      meetingsAttended: Math.floor(Math.random() * 8),
      meetingsMissed: Math.floor(Math.random() * 2),
      callsMade: Math.floor(Math.random() * 15),
      callsReceived: Math.floor(Math.random() * 15),
      chatVolume: Math.floor(Math.random() * 100),
      responseAvgMinutes: Math.floor(Math.random() * 60) + 1,
      focusTimeHours: Math.floor(Math.random() * 6),
      afterHoursWork,
      weekendWork: Math.random() > 0.9 ? Math.floor(Math.random() * 4) + 1 : 0,
      contextSwitchingScore: Math.floor(Math.random() * 100),
      burnoutRisk
    });
  }
  return records;
})();
