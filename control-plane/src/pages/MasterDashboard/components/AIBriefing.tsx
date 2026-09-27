import { useWorkplaceIntelligence } from '../../../services/workplaceIntelligence/WorkplaceIntelligenceProvider';

const AIBriefing = () => {
  const { data } = useWorkplaceIntelligence();

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-100 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg className="w-24 h-24 text-indigo-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="3"/></svg>
      </div>

      <div className="relative z-10">
        <h2 className="text-lg font-black text-indigo-900 tracking-tight mb-2">Today's Workplace Briefing</h2>
        <div className="inline-block px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full mb-4 uppercase tracking-wider">
          {data.briefing.length} areas require attention
        </div>

        <ul className="space-y-3 mb-6">
          {data.briefing.map((point, i) => (
            <li key={i} className="flex gap-3 text-sm text-indigo-900/80 font-medium leading-relaxed">
              <span className="text-indigo-500 mt-1">•</span>
              {point}
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          <button className="flex-1 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">Investigate</button>
          <button className="flex-1 py-2 bg-white text-indigo-700 border border-indigo-200 text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-50 transition-colors">View Evidence</button>
        </div>
      </div>
    </div>
  );
};

export default AIBriefing;
