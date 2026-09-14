import { useSharePointData } from '../../../services/sharepointIntelligence/SharePointDataProvider';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const ContentActivity = () => {
  const { data } = useSharePointData();
  const { contentActivity } = data;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Content Activity</h2>
          <p className="text-sm text-gray-500">Global file interactions across SharePoint and OneDrive</p>
        </div>
        <select className="border border-gray-300 rounded-md text-sm py-1.5 px-3 bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          <option>7 Days</option>
          <option>30 Days</option>
          <option>90 Days</option>
        </select>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={contentActivity} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViewed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorModified" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? (val / 1000) + 'k' : val} />
            <Tooltip />
            <Legend iconType="circle" />
            <Area type="monotone" dataKey="viewed" name="Files Viewed" stroke="#6366f1" fillOpacity={1} fill="url(#colorViewed)" />
            <Area type="monotone" dataKey="modified" name="Files Modified" stroke="#10b981" fillOpacity={1} fill="url(#colorModified)" />
            <Area type="monotone" dataKey="shared" name="Files Shared" stroke="#f59e0b" fill="none" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default ContentActivity;
