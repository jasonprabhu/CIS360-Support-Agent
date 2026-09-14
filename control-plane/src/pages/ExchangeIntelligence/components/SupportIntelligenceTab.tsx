import { useExchangeData } from '../../../services/exchangeIntelligence/ExchangeDataProvider';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';

const SupportIntelligenceTab = () => {
  const { data } = useExchangeData();
  const { supportIntelligence } = data;

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Open Exchange Tickets</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{supportIntelligence.openTickets}</p>
          </div>
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Avg Resolution Time</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{supportIntelligence.avgResolutionHours} <span className="text-lg text-gray-500">hours</span></p>
          </div>
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Exchange Ticket Volume Trend (14 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={supportIntelligence.ticketTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="tickets" stroke="#6366f1" fill="url(#colorTickets)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Issue Categories</h3>
          </div>
          <div className="flex-1 p-0">
            <ul className="divide-y divide-gray-100">
              {supportIntelligence.topCategories.map((cat, i) => (
                <li key={i} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{cat.category}</p>
                    <p className={"text-xs mt-1 font-medium " + (cat.trend > 0 ? 'text-red-500' : 'text-green-500')}>
                      {cat.trend > 0 ? '↑' : '↓'} {Math.abs(cat.trend)}% vs last week
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-indigo-600">{cat.count}</p>
                    <p className="text-xs text-gray-500">tickets</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SupportIntelligenceTab;
