import { usePowerPlatformData } from '../../../services/powerPlatformIntelligence/PowerPlatformDataProvider';

const MakersTab = () => {
  const { data } = usePowerPlatformData();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6">Maker Activity Profiles</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.makers.map((maker, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-5 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">{maker.type}</h4>
              <p className="text-3xl font-black text-indigo-600">{maker.count.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MakersTab;
