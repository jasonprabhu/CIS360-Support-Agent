import { useWorkplaceIntelligence } from '../../../services/workplaceIntelligence/WorkplaceIntelligenceProvider';

const WorkplacePulseHero = () => {
  const { data } = useWorkplaceIntelligence();
  const { healthScore, domains } = data.pulse;

  return (
    <div className="bg-[#0B1120] rounded-2xl p-8 shadow-lg border border-indigo-900/50 mb-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="text-center mb-10 relative z-10">
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">Workplace Pulse</h2>
        <p className="text-sm text-indigo-300 mt-1">Cross-domain Intelligence Map</p>
      </div>

      <div className="relative h-[400px] flex items-center justify-center max-w-4xl mx-auto z-10">
        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <g stroke="#4f46e5" strokeWidth="1" strokeDasharray="4 4" opacity="0.4">
            {/* Top */}
            <line x1="50%" y1="50%" x2="50%" y2="15%" />
            {/* Top Right */}
            <line x1="50%" y1="50%" x2="80%" y2="35%" />
            {/* Bottom Right */}
            <line x1="50%" y1="50%" x2="80%" y2="65%" />
            {/* Bottom */}
            <line x1="50%" y1="50%" x2="50%" y2="85%" />
            {/* Bottom Left */}
            <line x1="50%" y1="50%" x2="20%" y2="65%" />
            {/* Top Left */}
            <line x1="50%" y1="50%" x2="20%" y2="35%" />
          </g>
        </svg>

        {/* Center Node */}
        <div className="absolute z-20 flex flex-col items-center justify-center w-40 h-40 bg-indigo-950 border-2 border-indigo-500 rounded-full shadow-[0_0_30px_rgba(79,70,229,0.3)]">
          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">CIS360</span>
          <span className="text-4xl font-black text-white">{healthScore}%</span>
          <span className="text-[10px] font-bold text-indigo-400 uppercase mt-1">Workplace Health</span>
        </div>

        {/* Orbiting Nodes (Approximated positions for a hex layout) */}
        {domains.map((domain, index) => {
          const positions = [
            'top-[5%] left-1/2 -translate-x-1/2',
            'top-[25%] right-[10%]',
            'bottom-[25%] right-[10%]',
            'bottom-[5%] left-1/2 -translate-x-1/2',
            'bottom-[25%] left-[10%]',
            'top-[25%] left-[10%]',
          ];
          const posClass = positions[index];
          
          return (
            <div key={domain.name} className={`absolute z-20 w-32 h-32 bg-slate-900 border border-slate-700 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer ${posClass} group hover:border-indigo-400 hover:shadow-[0_0_20px_rgba(79,70,229,0.2)]`}>
              {domain.alerts > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white z-30 animate-pulse">
                  {domain.alerts}
                </div>
              )}
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider text-center px-2">{domain.name}</span>
              <span className="text-2xl font-black text-white mt-1">{domain.health}%</span>
              <div className="flex flex-col items-center mt-1">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${domain.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {domain.trend}
                </span>
                <span className="text-[9px] text-slate-500 font-medium truncate w-24 text-center mt-0.5">{domain.signal}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkplacePulseHero;
