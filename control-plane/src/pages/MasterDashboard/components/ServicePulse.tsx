import { useWorkplaceIntelligence } from '../../../services/workplaceIntelligence/WorkplaceIntelligenceProvider';

const ServicePulse = () => {
  const { data } = useWorkplaceIntelligence();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 overflow-hidden">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Digital Workplace Service Pulse</h3>
      <div className="flex overflow-x-auto pb-2 gap-4 snap-x hide-scrollbar">
        {data.services.map((service, i) => (
          <div key={i} className="min-w-[160px] flex-1 bg-gray-50 border border-gray-100 rounded-lg p-4 snap-start hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{service.name}</span>
              <span className="text-lg font-black text-gray-800">{service.health}%</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${service.trend.includes('↑') ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {service.trend}
              </span>
              <span className="text-[10px] font-medium text-gray-500 truncate ml-2" title={service.signal}>{service.signal}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicePulse;
