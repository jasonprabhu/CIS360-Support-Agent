const IntelligenceMap = () => {
  return (
    <div className="bg-[#0B1120] rounded-xl shadow-lg border border-indigo-900/50 p-6 relative overflow-hidden h-[300px]">
      <div className="absolute inset-0 bg-indigo-900/10 blur-xl"></div>
      
      <div className="relative z-10 flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Workplace Intelligence Map</h2>
          <p className="text-xs text-indigo-300">Cross-service correlations.</p>
        </div>
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center -mt-4">
        <svg className="w-full h-full max-w-lg" viewBox="0 0 400 200">
          {/* Edges */}
          <g stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6">
            <line x1="200" y1="40" x2="100" y2="100" />
            <line x1="200" y1="40" x2="300" y2="100" />
            <line x1="100" y1="100" x2="150" y2="160" />
            <line x1="300" y1="100" x2="250" y2="160" />
            <line x1="150" y1="160" x2="250" y2="160" />
            <line x1="100" y1="100" x2="300" y2="100" />
          </g>

          {/* Nodes */}
          <g className="cursor-pointer">
            <circle cx="200" cy="40" r="22" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
            <text x="200" y="44" textAnchor="middle" fill="#c7d2fe" fontSize="10" fontWeight="bold">Identity</text>
          </g>

          <g className="cursor-pointer">
            <circle cx="100" cy="100" r="26" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
            <text x="100" y="98" textAnchor="middle" fill="#c7d2fe" fontSize="10" fontWeight="bold">Teams &</text>
            <text x="100" y="110" textAnchor="middle" fill="#c7d2fe" fontSize="10" fontWeight="bold">Exchange</text>
          </g>

          <g className="cursor-pointer">
            <circle cx="300" cy="100" r="26" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
            <text x="300" y="98" textAnchor="middle" fill="#c7d2fe" fontSize="10" fontWeight="bold">Apps &</text>
            <text x="300" y="110" textAnchor="middle" fill="#c7d2fe" fontSize="10" fontWeight="bold">Flows</text>
          </g>

          <g className="cursor-pointer">
            <circle cx="150" cy="160" r="20" fill="#1e1b4b" stroke="#10b981" strokeWidth="2" />
            <text x="150" y="164" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold">Support</text>
          </g>

          <g className="cursor-pointer">
            <circle cx="250" cy="160" r="20" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
            <text x="250" y="164" textAnchor="middle" fill="#e9d5ff" fontSize="9" fontWeight="bold">Agents</text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default IntelligenceMap;
