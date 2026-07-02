import { useState, useEffect } from 'react';
import { Clock, Play, Square, Coffee, CheckCircle, List, Users } from 'lucide-react';

const MyWorkdayTab = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/workday/me');
      const data = await res.json();
      if (data.status === 'success') {
        setStatus(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch workday status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleAction = async (endpoint: string) => {
    try {
      const res = await fetch(`/api/workday/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: 'CurrentUser' })
      });
      const data = await res.json();
      alert(data.message);
      fetchStatus();
    } catch (err) {
      console.error(err);
      alert('Action failed');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Workday Status...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Workday</h2>
        <p className="text-gray-500">Manage your presence, attendance, and work hours.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm font-semibold text-gray-500 mb-1">Today's Status</div>
            <div className="text-xl font-bold text-green-600 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              {status?.todayStatus || 'Offline'}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-500 mb-1">Checked In Time</div>
            <div className="text-xl font-bold text-gray-900">{status?.checkedInTime || '--:--'}</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-500 mb-1">Total Worked Hours</div>
            <div className="text-xl font-bold text-[#0f6cbd]">{status?.totalWorkedHours || '0h 0m'}</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-500 mb-1">Current Break Status</div>
            <div className="text-xl font-bold text-gray-900">{status?.currentBreakStatus || 'None'}</div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
          Last Check-Out: {status?.lastCheckOut || 'N/A'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleAction('checkin')} className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition">
              <Play size={24} className="mb-2 text-green-600" />
              <span className="font-semibold">Check In</span>
            </button>
            <button onClick={() => handleAction('checkout')} className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 transition">
              <Square size={24} className="mb-2 text-gray-500" />
              <span className="font-semibold">Check Out</span>
            </button>
            <button onClick={() => handleAction('break/start')} className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition">
              <Coffee size={24} className="mb-2 text-orange-500" />
              <span className="font-semibold">Start Break</span>
            </button>
            <button onClick={() => handleAction('break/end')} className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-[#f0f6fc] hover:border-[#0f6cbd] hover:text-[#0f6cbd] transition">
              <CheckCircle size={24} className="mb-2 text-[#0f6cbd]" />
              <span className="font-semibold">End Break</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">My Reports</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <List size={20} className="text-[#0f6cbd]" />
                <span className="font-semibold text-gray-700">My Attendance History</span>
              </div>
              <span className="text-sm text-gray-500">View</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-[#0f6cbd]" />
                <span className="font-semibold text-gray-700">My Work Hours</span>
              </div>
              <span className="text-sm text-gray-500">View</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-[#0f6cbd]" />
                <span className="font-semibold text-gray-700">My Team Status</span>
              </div>
              <span className="text-sm text-gray-500">View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWorkdayTab;
