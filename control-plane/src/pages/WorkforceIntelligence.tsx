import { useState, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Filter, Download, Save, RotateCcw, Users, AlertCircle, PhoneCall, MonitorPlay, Database } from 'lucide-react';
import { mockWorkforceData } from '../data/mockWorkforceData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
const PRESENCE_COLORS: Record<string, string> = {
  Available: '#107c41',
  Busy: '#d13438',
  'In Call': '#d13438',
  Away: '#ffaa44',
  DND: '#881798',
  Offline: '#737373'
};

const WorkforceIntelligence = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dataSource, setDataSource] = useState<'Mock' | 'Production'>('Mock');

  // Filters
  const [deptFilter, setDeptFilter] = useState('All');
  const [teamFilter, setTeamFilter] = useState('All');
  const [managerFilter, setManagerFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [presenceFilter, setPresenceFilter] = useState('All');
  const [attendanceFilter, setAttendanceFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  // Filter logic
  const filteredWorkforce = useMemo(() => {
    return mockWorkforceData.filter(emp => {
      if (deptFilter !== 'All' && emp.department !== deptFilter) return false;
      if (teamFilter !== 'All' && emp.team !== teamFilter) return false;
      if (managerFilter !== 'All' && emp.manager !== managerFilter) return false;
      if (locationFilter !== 'All' && emp.location !== locationFilter) return false;
      if (workModeFilter !== 'All' && emp.workMode !== workModeFilter) return false;
      if (presenceFilter !== 'All' && emp.presenceState !== presenceFilter) return false;
      if (attendanceFilter !== 'All' && emp.attendanceStatus !== attendanceFilter) return false;
      if (riskFilter !== 'All' && emp.productivityRisk !== riskFilter) return false;
      return true;
    });
  }, [deptFilter, teamFilter, managerFilter, locationFilter, workModeFilter, presenceFilter, attendanceFilter, riskFilter]);

  const resetFilters = () => {
    setDeptFilter('All');
    setTeamFilter('All');
    setManagerFilter('All');
    setLocationFilter('All');
    setWorkModeFilter('All');
    setPresenceFilter('All');
    setAttendanceFilter('All');
    setRiskFilter('All');
  };

  const renderOverview = () => {
    const presenceData = Object.entries(filteredWorkforce.reduce((acc, emp) => {
      acc[emp.presenceState] = (acc[emp.presenceState] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    const workModeData = Object.entries(filteredWorkforce.reduce((acc, emp) => {
      acc[emp.workMode] = (acc[emp.workMode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).map(([name, value]) => ({ name, value }));

    const deptData = Object.entries(filteredWorkforce.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

    // Mock trend
    const trendData = [
      { day: 'Mon', active: 380, absent: 20 },
      { day: 'Tue', active: 400, absent: 15 },
      { day: 'Wed', active: 410, absent: 10 },
      { day: 'Thu', active: 395, absent: 18 },
      { day: 'Fri', active: 350, absent: 40 },
    ];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Workforce Presence Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={presenceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {presenceData.map((entry, index) => <Cell key={`cell-${index}`} fill={PRESENCE_COLORS[entry.name] || COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Trend (This Week)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="active" stroke="#107c41" fill="#d1f0dd" name="Active Employees" />
                <Area type="monotone" dataKey="absent" stroke="#d13438" fill="#f8d7da" name="Absent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Activity Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f6cbd" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Work Mode Split</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={workModeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {workModeData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderAttendance = () => {
    const present = filteredWorkforce.filter(e => e.attendanceStatus === 'Present' || e.attendanceStatus === 'Late' || e.attendanceStatus === 'Early Logout');
    const avgCheckin = '08:45 AM'; // Mock computed
    const avgCheckout = '05:30 PM';
    const avgHours = present.length > 0 ? (present.reduce((acc, e) => acc + e.totalHours, 0) / present.length).toFixed(1) : '0';
    const absentPct = filteredWorkforce.length > 0 ? ((filteredWorkforce.filter(e => e.attendanceStatus === 'Absent').length / filteredWorkforce.length) * 100).toFixed(1) : '0';

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
            <div className="text-sm text-gray-500 font-semibold mb-1">Avg Check-in</div>
            <div className="text-xl font-bold text-gray-900">{avgCheckin}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
            <div className="text-sm text-gray-500 font-semibold mb-1">Avg Check-out</div>
            <div className="text-xl font-bold text-gray-900">{avgCheckout}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
            <div className="text-sm text-gray-500 font-semibold mb-1">Avg Work Hours</div>
            <div className="text-xl font-bold text-[#0f6cbd]">{avgHours}h</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
            <div className="text-sm text-gray-500 font-semibold mb-1">Absentee Rate</div>
            <div className="text-xl font-bold text-red-600">{absentPct}%</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10 shadow-sm border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Check-in Time</th>
                  <th className="px-6 py-4 font-semibold">Check-out Time</th>
                  <th className="px-6 py-4 font-semibold">Total Hours</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredWorkforce.slice(0, 100).map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                    <td className="px-6 py-4 text-gray-500">{emp.department}</td>
                    <td className="px-6 py-4">{emp.checkInTime || '-'} {emp.lateLogin && <span className="text-xs text-orange-600 font-semibold ml-2">(Late)</span>}</td>
                    <td className="px-6 py-4">{emp.checkOutTime || '-'}</td>
                    <td className="px-6 py-4 font-medium">{emp.totalHours > 0 ? `${emp.totalHours}h` : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${emp.attendanceStatus === 'Present' ? 'bg-green-100 text-green-800' : emp.attendanceStatus === 'Absent' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                        {emp.attendanceStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderPresence = () => {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-orange-600" size={24} />
          <div>
            <h4 className="font-semibold text-orange-900">Presence Drift Detected</h4>
            <p className="text-sm text-orange-800">42 users have been manually set to "Busy" or "Away" for more than 4 hours. The system has prompted them to reset their status.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10 shadow-sm border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Current Presence</th>
                  <th className="px-6 py-4 font-semibold">Duration (mins)</th>
                  <th className="px-6 py-4 font-semibold">Manual Override</th>
                  <th className="px-6 py-4 font-semibold">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredWorkforce.slice(0, 100).map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PRESENCE_COLORS[emp.presenceState] }}></span>
                        {emp.presenceState}
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${emp.currentDuration > 240 && emp.manualOverride ? 'text-red-600 font-semibold' : ''}`}>{emp.currentDuration}</td>
                    <td className="px-6 py-4">{emp.manualOverride ? <span className="px-2 py-1 bg-gray-100 rounded text-xs">Yes</span> : 'No'}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(emp.lastActivity).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderCollaboration = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><PhoneCall size={20} className="text-[#0f6cbd]"/> Meeting Load Distribution</h3>
          <div className="space-y-4">
            <div className="text-center p-10 text-gray-500">Meeting chart mock placeholder</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><Users size={20} className="text-green-600"/> Top Collaborators</h3>
          <ul className="divide-y divide-gray-100">
            {filteredWorkforce.sort((a, b) => b.chatVolume - a.chatVolume).slice(0, 5).map((emp, i) => (
              <li key={emp.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{i + 1}. {emp.name}</div>
                  <div className="text-xs text-gray-500">{emp.department}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-700">{emp.chatVolume} messages</div>
                  <div className="text-xs text-gray-500">{emp.meetingsAttended} meetings</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderProductivity = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-semibold text-gray-500 mb-1">High Focus Time Users</div>
          <div className="text-3xl font-bold text-green-600">{filteredWorkforce.filter(e => e.focusTimeHours > 4).length}</div>
          <p className="text-xs text-gray-500 mt-2">Users with &gt;4 hours of focus time today</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-semibold text-gray-500 mb-1">Meeting Overload</div>
          <div className="text-3xl font-bold text-red-600">{filteredWorkforce.filter(e => e.meetingsAttended >= 6).length}</div>
          <p className="text-xs text-gray-500 mt-2">Users with 6+ meetings today</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-semibold text-gray-500 mb-1">After-Hours Work</div>
          <div className="text-3xl font-bold text-purple-600">{filteredWorkforce.filter(e => e.afterHoursWork > 0).length}</div>
          <p className="text-xs text-gray-500 mt-2">Users logging activity outside 9-5</p>
        </div>
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
           <h3 className="text-lg font-semibold text-gray-800 mb-4">Productivity Risk Users</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                 <tr>
                   <th className="p-3 font-semibold">User</th>
                   <th className="p-3 font-semibold">Focus Time</th>
                   <th className="p-3 font-semibold">Meetings</th>
                   <th className="p-3 font-semibold">Context Switches</th>
                   <th className="p-3 font-semibold">Risk Level</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredWorkforce.filter(e => e.productivityRisk === 'High').slice(0, 10).map(emp => (
                   <tr key={emp.id} className="border-b border-gray-50">
                     <td className="p-3 font-medium">{emp.name}</td>
                     <td className="p-3 text-red-600 font-semibold">{emp.focusTimeHours}h</td>
                     <td className="p-3">{emp.meetingsAttended}</td>
                     <td className="p-3">{emp.contextSwitchingScore}/100</td>
                     <td className="p-3"><span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">High</span></td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    );
  };

  const renderTeamHealth = () => {
    // Group by manager
    const managers = Array.from(new Set(filteredWorkforce.map(e => e.manager)));
    const teamStats = managers.map(mgr => {
      const team = filteredWorkforce.filter(e => e.manager === mgr);
      const active = team.filter(e => e.attendanceStatus !== 'Absent').length;
      const burnout = team.filter(e => e.burnoutRisk).length;
      const healthScore = Math.max(0, 100 - (burnout / team.length) * 100 - (team.filter(e => e.attendanceStatus === 'Absent').length / team.length) * 50);
      
      return { manager: mgr, teamSize: team.length, active, burnout, healthScore: Math.round(healthScore), department: team[0].department };
    });

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">Team Health Overview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Manager</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Team Size</th>
                  <th className="px-6 py-4 font-semibold">Active Today</th>
                  <th className="px-6 py-4 font-semibold">Burnout Risk</th>
                  <th className="px-6 py-4 font-semibold">Health Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teamStats.sort((a, b) => a.healthScore - b.healthScore).map((team, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{team.manager}</td>
                    <td className="px-6 py-4 text-gray-500">{team.department}</td>
                    <td className="px-6 py-4">{team.teamSize}</td>
                    <td className="px-6 py-4">{team.active} ({Math.round(team.active/team.teamSize*100)}%)</td>
                    <td className={`px-6 py-4 ${team.burnout > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}`}>{team.burnout}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div className={`h-2 rounded-full ${team.healthScore > 80 ? 'bg-green-500' : team.healthScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${team.healthScore}%` }}></div>
                        </div>
                        <span className="font-semibold text-gray-700">{team.healthScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // KPIs
  const activeWorkforce = filteredWorkforce.length;
  const checkedIn = filteredWorkforce.filter(e => e.attendanceStatus !== 'Absent').length;
  const availableNow = filteredWorkforce.filter(e => e.presenceState === 'Available').length;
  const inMeetings = filteredWorkforce.filter(e => e.presenceState === 'In Call' || e.presenceState === 'Busy').length;
  const idleUsers = filteredWorkforce.filter(e => e.presenceState === 'Away').length;
  const absentToday = filteredWorkforce.filter(e => e.attendanceStatus === 'Absent').length;
  const afterHours = filteredWorkforce.filter(e => e.afterHoursWork > 0).length;
  const burnoutRisk = filteredWorkforce.filter(e => e.burnoutRisk).length;

  return (
    <div className="animate-fade-in">
      <div className="page-header mb-6">
        <h2 className="page-title text-2xl font-bold text-gray-800">Workforce Intelligence</h2>
        <p className="page-subtitle text-gray-500">Comprehensive visibility into workforce collaboration, presence, and productivity patterns.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <Filter size={18} /> Global Workforce Filters
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-md p-1 border border-gray-300">
              <button onClick={() => setDataSource('Mock')} className={`px-3 py-1 text-sm font-semibold rounded transition ${dataSource === 'Mock' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>Mock Data</button>
              <button onClick={() => setDataSource('Production')} className={`flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded transition ${dataSource === 'Production' ? 'bg-green-100 shadow-sm text-green-800' : 'text-gray-500 hover:text-gray-700'}`}>
                <Database size={14} /> Production API
              </button>
            </div>
            <button onClick={resetFilters} className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition"><RotateCcw size={18} /></button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"><Save size={16}/> Save View</button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-[#0f6cbd] border border-transparent rounded hover:bg-[#0c5391] transition shadow-sm"><Download size={16}/> Export Report</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { label: 'Department', val: deptFilter, set: setDeptFilter, opts: ['All', ...Array.from(new Set(mockWorkforceData.map(e => e.department)))] },
            { label: 'Team', val: teamFilter, set: setTeamFilter, opts: ['All', ...Array.from(new Set(mockWorkforceData.map(e => e.team)))] },
            { label: 'Manager', val: managerFilter, set: setManagerFilter, opts: ['All', ...Array.from(new Set(mockWorkforceData.map(e => e.manager)))] },
            { label: 'Location', val: locationFilter, set: setLocationFilter, opts: ['All', ...Array.from(new Set(mockWorkforceData.map(e => e.location)))] },
            { label: 'Work Mode', val: workModeFilter, set: setWorkModeFilter, opts: ['All', 'Remote', 'Hybrid', 'Onsite'] },
            { label: 'Presence', val: presenceFilter, set: setPresenceFilter, opts: ['All', 'Available', 'Busy', 'In Call', 'Away', 'Offline', 'DND'] },
            { label: 'Attendance', val: attendanceFilter, set: setAttendanceFilter, opts: ['All', 'Present', 'Late', 'Absent', 'Early Logout'] },
            { label: 'Prod. Risk', val: riskFilter, set: setRiskFilter, opts: ['All', 'Low', 'Medium', 'High'] },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{f.label}</label>
              <select value={f.val} onChange={e => f.set(e.target.value)} className="w-full text-sm border border-gray-300 rounded p-1.5 bg-gray-50">
                {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {dataSource === 'Production' ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center animate-fade-in">
          <MonitorPlay size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Connecting to live workforce data...</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">Workforce data integrations (Teams Presence API, Entra Sign-ins, Viva Insights) are being configured by your administrator.</p>
          <div className="inline-block border border-gray-200 rounded p-4 text-sm text-left bg-gray-50">
            <div className="font-semibold mb-2">Integration Health:</div>
            <ul className="space-y-1 text-gray-600">
              <li><span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2"></span> Teams Presence API: Pending</li>
              <li><span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2"></span> Entra Sign-ins API: Pending</li>
              <li><span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2"></span> Viva Insights API: Pending</li>
              <li><span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2"></span> Intune Device API: Pending</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => resetFilters()}>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Active Workforce</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{activeWorkforce}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => {resetFilters(); setAttendanceFilter('Present');}}>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Checked In</div>
              <div className="text-2xl font-bold text-[#0f6cbd] mt-1">{checkedIn}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => {resetFilters(); setPresenceFilter('Available');}}>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Available Now</div>
              <div className="text-2xl font-bold text-green-600 mt-1">{availableNow}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => {resetFilters(); setPresenceFilter('In Call');}}>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">In Meetings</div>
              <div className="text-2xl font-bold text-orange-500 mt-1">{inMeetings}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => {resetFilters(); setPresenceFilter('Away');}}>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Idle Users</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">{idleUsers}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => {resetFilters(); setAttendanceFilter('Absent');}}>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Absent Today</div>
              <div className="text-2xl font-bold text-gray-600 mt-1">{absentToday}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => {resetFilters(); setActiveTab('productivity');}}>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">After-Hours</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">{afterHours}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => {resetFilters(); setRiskFilter('High');}}>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Burnout Risk</div>
              <div className="text-2xl font-bold text-red-700 mt-1">{burnoutRisk}</div>
            </div>
          </div>

          <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-lg px-2 pt-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'attendance', label: 'Attendance' },
              { id: 'presence', label: 'Presence' },
              { id: 'collaboration', label: 'Collaboration' },
              { id: 'productivity', label: 'Productivity Patterns' },
              { id: 'team-health', label: 'Team Health' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === tab.id ? 'border-[#0f6cbd] text-[#0f6cbd]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'attendance' && renderAttendance()}
            {activeTab === 'presence' && renderPresence()}
            {activeTab === 'collaboration' && renderCollaboration()}
            {activeTab === 'productivity' && renderProductivity()}
            {activeTab === 'team-health' && renderTeamHealth()}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkforceIntelligence;
