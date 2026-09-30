import { useWorkplaceIntelligence } from '../../../services/workplaceIntelligence/WorkplaceIntelligenceProvider';

const IntelligenceDeepDiveModal = () => {
  const { 
    selectedScenario, 
    isDeepDiveOpen, 
    setIsDeepDiveOpen, 
    remediationStatus, 
    executeRemediation, 
    resetRemediation 
  } = useWorkplaceIntelligence();

  if (!isDeepDiveOpen || !selectedScenario) return null;

  const { signal, pattern, insight, recommendation, action } = selectedScenario;

  const handleClose = () => {
    setIsDeepDiveOpen(false);
    resetRemediation();
  };

  const handleExecute = () => {
    executeRemediation(selectedScenario.id);
  };

  // Find max value in telemetry for relative bar scaling
  const maxTelemetryVal = Math.max(...pattern.telemetryPoints.map(p => Math.max(p.value, p.baseline)), 1);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${
              selectedScenario.category === 'Critical' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
              selectedScenario.category === 'Attention' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
              'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 uppercase tracking-wider">
                  {selectedScenario.domain}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedScenario.timestamp}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {selectedScenario.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-medium">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{insight.confidence}% AI Diagnostic Confidence</span>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body: Two Column Layout */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-900/60">

          {/* Causal 5-Stage Stepper Banner */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <span className="text-rose-400 font-bold text-xs">1. SIGNAL</span>
              <span className="text-[10px] text-slate-400 truncate">Anomaly</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-indigo-400 font-bold text-xs">2. PATTERN</span>
              <span className="text-[10px] text-slate-400 truncate">Correlation</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="text-amber-400 font-bold text-xs">3. INSIGHT</span>
              <span className="text-[10px] text-slate-400 truncate">Root Cause</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
              <span className="text-sky-400 font-bold text-xs">4. REC.</span>
              <span className="text-[10px] text-slate-400 truncate">Deflection</span>
            </div>
            <div className="col-span-2 md:col-span-1 flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-emerald-400 font-bold text-xs">5. ACTION</span>
              <span className="text-[10px] text-slate-400 truncate">1-Click Fix</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column (Stage 1 & 2: Telemetry, Signals, Metrics) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Stage 1: The Signal */}
              <div className="p-4 bg-slate-800/70 border border-slate-700/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    Stage 1: Real-Time Signal
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {signal.metricBadge}
                  </span>
                </div>
                <h4 className="font-semibold text-white text-sm">
                  {signal.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {signal.description}
                </p>
                <div className="pt-2 border-t border-slate-700/60 flex flex-col gap-1 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Impacted Scope:</span>
                    <span className="font-medium text-slate-200">{signal.affectedScope}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Business Impact:</span>
                    <span className="font-medium text-amber-300 text-right">{signal.impactSummary}</span>
                  </div>
                </div>
              </div>

              {/* Stage 2: Pattern & Telemetry Curve */}
              <div className="p-4 bg-slate-800/70 border border-slate-700/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Stage 2: Telemetry Pattern
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {pattern.affectedUsersCount} Users Impacted
                  </span>
                </div>

                <div className="text-xs text-indigo-200 font-medium">
                  {pattern.title}
                </div>

                {/* Telemetry Bar Visualization */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span>Timeline (UTC)</span>
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-rose-500 rounded-sm" /> Anomaly
                      <span className="inline-block w-2 h-2 bg-slate-600 rounded-sm" /> Baseline
                    </span>
                  </div>
                  {pattern.telemetryPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px]">
                      <span className="w-20 text-[10px] text-slate-400 truncate">{pt.label}</span>
                      <div className="flex-1 bg-slate-900 rounded-full h-3 overflow-hidden flex items-center px-1 border border-slate-800">
                        <div 
                          className="bg-rose-500 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, (pt.value / maxTelemetryVal) * 100)}%` }} 
                        />
                      </div>
                      <span className="w-8 text-right font-mono text-[10px] text-slate-300 font-semibold">{pt.value}</span>
                    </div>
                  ))}
                </div>

                {/* Related Components */}
                <div className="pt-2 border-t border-slate-700/60">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Correlated Components:</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {pattern.relatedComponents.map((comp, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-[10px] text-slate-300">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (Stage 3, 4, 5: Insight, Recommendation & 1-Click Action) */}
            <div className="lg:col-span-7 space-y-5">

              {/* Stage 3: Generative AI Root-Cause Insight */}
              <div className="p-5 bg-gradient-to-br from-slate-800/90 to-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859h4z" />
                    </svg>
                    Stage 3: AI Causal Insight & Root Cause
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                    Risk: {insight.riskLevel}
                  </span>
                </div>

                <h4 className="font-bold text-white text-base">
                  {insight.title}
                </h4>

                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-700/60">
                  {insight.causalExplanation}
                </p>

                {/* Technical Diagnostic Facts */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Diagnostic Evidence:</span>
                  {insight.technicalFacts.map((fact, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-indigo-400 font-bold">✓</span>
                      <span className="font-mono text-[11px]">{fact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage 4: Strategic Recommendations & ROI Deflection */}
              <div className="p-4 bg-slate-800/70 border border-slate-700/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Stage 4: Proactive Recommendation
                  </span>
                </div>

                <h4 className="font-semibold text-white text-sm">
                  {recommendation.title}
                </h4>

                <ul className="space-y-1.5 text-xs text-slate-300">
                  {recommendation.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-sky-400 font-bold">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>

                {/* Deflection Forecast Badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60">
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700 text-center">
                    <div className="text-emerald-400 font-bold text-sm">~{recommendation.ticketDeflectionForecast}</div>
                    <div className="text-[10px] text-slate-400">Tickets Deflected</div>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700 text-center">
                    <div className="text-indigo-400 font-bold text-sm">{recommendation.downtimeAvoidedHours} hrs</div>
                    <div className="text-[10px] text-slate-400">Downtime Avoided</div>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700 text-center">
                    <div className="text-violet-400 font-bold text-sm">{recommendation.laborHoursSaved} hrs</div>
                    <div className="text-[10px] text-slate-400">Support Hours Saved</div>
                  </div>
                </div>
              </div>

              {/* Stage 5: 1-Click Autonomous Action */}
              <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-slate-800/80 to-slate-900 border border-emerald-500/40 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Stage 5: Autonomous Action & Audit
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Target: {action.affectedResource}
                  </span>
                </div>

                {remediationStatus === 'idle' && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    <div className="text-xs text-slate-300">
                      Click below to execute autonomous remediation and auto-generate an ITIL change audit record.
                    </div>
                    <button
                      onClick={handleExecute}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <span>{action.label}</span>
                    </button>
                  </div>
                )}

                {remediationStatus === 'executing' && (
                  <div className="p-4 bg-slate-900 rounded-lg border border-emerald-500/30 flex items-center gap-3 animate-pulse">
                    <svg className="animate-spin h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <div className="text-xs text-emerald-300">
                      Executing automated remediation orchestrator across target components...
                    </div>
                  </div>
                )}

                {remediationStatus === 'success' && (
                  <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-lg space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs">
                      <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Remediation Completed Successfully!</span>
                    </div>
                    <p className="text-xs text-slate-200">
                      {action.successMessage}
                    </p>
                    <div className="pt-2 border-t border-emerald-500/30 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>ServiceNow Audit Record: <strong className="text-emerald-300">{action.auditNumber}</strong></span>
                      <span className="text-emerald-400 font-sans">✓ Telemetry Returned to Normal</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span>CIS360 Workplace Intelligence Engine v2.4 (Proactive Mode)</span>
          </div>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium"
          >
            Close Deep-Dive
          </button>
        </div>

      </div>
    </div>
  );
};

export default IntelligenceDeepDiveModal;
