import { useSharePointData } from '../../../services/sharepointIntelligence/SharePointDataProvider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const OneDriveIntelligence = () => {
  const { data } = useSharePointData();
  const { oneDriveDistribution } = data;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-2">OneDrive Intelligence</h2>
      <p className="text-sm text-gray-500 mb-6">User adoption and storage footprint</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Provisioned Users</p>
              <p className="text-2xl font-black text-gray-900 mt-1">4,192</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Active Users (30d)</p>
              <p className="text-2xl font-black text-gray-900 mt-1">3,420</p>
            </div>
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Sync Issues</p>
              <p className="text-2xl font-black text-red-600 mt-1">24</p>
            </div>
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">OneDrive Storage Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={oneDriveDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="range" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {oneDriveDistribution.map((entry, index) => (
                    <Cell key={"cell-" + index} fill={entry.range === '> 500 GB' ? '#ef4444' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OneDriveIntelligence;
