import { useSharePointData } from '../../../services/sharepointIntelligence/SharePointDataProvider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const LifecycleIntelligence = () => {
  const { data } = useSharePointData();
  const { lifecycleAging } = data;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Content Lifecycle Intelligence</h2>
      <p className="text-sm text-gray-500 mb-6">Data aging funnel to identify candidates for archival.</p>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={lifecycleAging} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="range" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val + ' TB'} />
            <Tooltip cursor={{fill: '#f3f4f6'}} formatter={(value) => [value + ' TB', 'Storage Consumed']} />
            <Bar dataKey="tb" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-center gap-4 border-t border-gray-100 pt-6">
        <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-bold px-4 py-2 rounded-lg transition-colors border border-indigo-200">
          Filter: Content older than 1 year
        </button>
      </div>
    </div>
  );
};
export default LifecycleIntelligence;
