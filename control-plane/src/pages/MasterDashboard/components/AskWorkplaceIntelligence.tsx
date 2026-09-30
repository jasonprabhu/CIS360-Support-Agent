import { useState } from 'react';
import { useWorkplaceIntelligence } from '../../../services/workplaceIntelligence/WorkplaceIntelligenceProvider';
import type { IntelligenceScenario } from '../../../services/workplaceIntelligence/types';

const AskWorkplaceIntelligence = () => {
  const { data, setSelectedScenario, setIsDeepDiveOpen, resetRemediation } = useWorkplaceIntelligence();
  const [searchQuery, setSearchQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSelectScenario = (scenario: IntelligenceScenario) => {
    setIsThinking(true);
    setSearchQuery(scenario.query);
    resetRemediation();

    setTimeout(() => {
      setSelectedScenario(scenario);
      setIsDeepDiveOpen(true);
      setIsThinking(false);
    }, 450);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Match query against scenarios or default to the most relevant one
    const lower = searchQuery.toLowerCase();
    const matched = data.scenarios.find(s => 
      s.query.toLowerCase().includes(lower) || 
      s.title.toLowerCase().includes(lower) || 
      s.domain.toLowerCase().includes(lower)
    ) || data.scenarios[0];

    handleSelectScenario(matched);
  };

  return (
    <div className="mb-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Autonomous Workplace Intelligence
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Ask CIS360:</span>
            <span className="text-indigo-200 font-medium text-lg">"Tell me what is happening across our digital workplace"</span>
          </h2>
        </div>

        {/* Causal Chain Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-900/40 border border-indigo-400/20 text-xs text-indigo-200">
          <span className="text-indigo-300 font-semibold">Signal</span>
          <span className="text-slate-500">➔</span>
          <span className="text-indigo-300 font-semibold">Pattern</span>
          <span className="text-slate-500">➔</span>
          <span className="text-amber-300 font-semibold">Insight</span>
          <span className="text-slate-500">➔</span>
          <span className="text-emerald-300 font-semibold">Action</span>
        </div>
      </div>

      {/* Query Search Form */}
      <form onSubmit={handleCustomSubmit} className="relative mt-4">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-indigo-400">
            {isThinking ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask anything (e.g. 'Why is there a spike in failed flows?' or 'Explain Exchange auth issues')..."
            className="w-full pl-12 pr-28 py-3.5 bg-slate-800/80 border border-indigo-500/30 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={isThinking}
            className="absolute right-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-xs rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isThinking ? 'Analyzing...' : 'Investigate'}
          </button>
        </div>
      </form>

      {/* 1-Click Interactive Demo Scenario Chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Quick Scenarios:</span>
        {data.scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => handleSelectScenario(scenario)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-indigo-900/60 border border-slate-700 hover:border-indigo-400/50 text-slate-200 hover:text-white transition-all shadow-sm active:scale-95 group"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              scenario.category === 'Critical' ? 'bg-rose-500' :
              scenario.category === 'Attention' ? 'bg-amber-500' : 'bg-indigo-400'
            }`} />
            <span className="group-hover:underline">{scenario.domain}:</span>
            <span className="text-slate-300 font-normal truncate max-w-[240px] md:max-w-[320px]">
              "{scenario.query}"
            </span>
            <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AskWorkplaceIntelligence;
