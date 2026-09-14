import { useIdentityData } from '../../../services/identityIntelligence/IdentityDataProvider';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const UserExperience = () => {
  const { data } = useIdentityData();
  const { experienceScore } = data;

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 85) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center lg:col-span-1">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Identity Experience Score</h3>
        <div className="text-6xl font-bold text-gray-900 my-4">{experienceScore.overall}</div>
        <p className="text-sm text-gray-500 text-center px-4">Based on authentication success, MFA friction, and account lockout rates.</p>
        
        <div className="w-full mt-8 space-y-3">
          {experienceScore.byDepartment.map(dept => (
            <div key={dept.name} className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-600">{dept.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${dept.score}%`, backgroundColor: getScoreColor(dept.score) }}></div>
                </div>
                <span className="font-bold text-gray-900 w-6 text-right">{dept.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Support Intelligence</h3>
          <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-1 rounded">12 Repeat Problem Users</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-100 p-3 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Auth Tickets</p>
              <p className="text-xl font-bold text-gray-900 mt-1">42</p>
            </div>
            <div className="text-red-500 text-xs font-semibold bg-red-50 px-2 py-1 rounded">↑ 12%</div>
          </div>
          <div className="border border-gray-100 p-3 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">MFA Resets</p>
              <p className="text-xl font-bold text-gray-900 mt-1">18</p>
            </div>
            <div className="text-green-500 text-xs font-semibold bg-green-50 px-2 py-1 rounded">↓ 4%</div>
          </div>
        </div>

        <div className="flex-1 min-h-[150px]">
          <p className="text-xs font-medium text-gray-500 mb-2">Identity-related Tickets (14 days)</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={experienceScore.ticketTrend}>
              <XAxis dataKey="date" hide />
              <Tooltip />
              <Line type="monotone" dataKey="tickets" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserExperience;
