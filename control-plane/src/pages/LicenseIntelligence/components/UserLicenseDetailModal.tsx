import { useState } from 'react';
import type { LicenseUser } from '../../../data/mockLicenseData';

interface UserLicenseDetailModalProps {
  user: LicenseUser | null;
  onClose: () => void;
  onReclaimCopilot?: (userId: string) => void;
  onDowngradeSku?: (userId: string, targetSku: string) => void;
}

export const UserLicenseDetailModal = ({ 
  user, 
  onClose,
  onReclaimCopilot,
  onDowngradeSku 
}: UserLicenseDetailModalProps) => {
  const [actionDone, setActionDone] = useState<string | null>(null);

  if (!user) return null;

  const { components, optimizationRecommendation } = user;

  const handleAction = (actionType: string) => {
    setActionDone(actionType);
    if (actionType === 'reclaim-copilot' && onReclaimCopilot) {
      onReclaimCopilot(user.id);
    } else if (actionType === 'downgrade-e3' && onDowngradeSku) {
      onDowngradeSku(user.id, 'E3');
    } else if (actionType === 'downgrade-f3' && onDowngradeSku) {
      onDowngradeSku(user.id, 'F3');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[92vh] border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-white font-bold text-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{user.name}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  user.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {user.status}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {user.userType}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                {user.email} • {user.department} • {user.country}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50">

          {/* Top Quick Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Overall Score</div>
              <div className="flex items-center gap-2 mt-1">
                <div className={`text-2xl font-black ${
                  user.utilizationScore > 70 ? 'text-emerald-600' : user.utilizationScore > 30 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {user.utilizationScore}%
                </div>
                <span className="text-[10px] text-slate-500">Utilization</span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Monthly Cost</div>
              <div className="text-2xl font-black text-slate-900 mt-1">${user.monthlyCost}.00</div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Last Activity</div>
              <div className="text-xs font-bold text-slate-700 mt-2 truncate">
                {new Date(user.lastActivity).toLocaleDateString()}
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Assigned SKUs</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.assignedLicenses.map(lic => (
                  <span key={lic} className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                    {lic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Optimization Recommendation Box */}
          {optimizationRecommendation && optimizationRecommendation.action !== 'Optimal' && (
            <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border border-amber-300 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-black text-[10px] uppercase tracking-wider">
                    AI License Optimization Recommendation
                  </span>
                  <span className="text-xs font-black text-emerald-700">
                    Save ${optimizationRecommendation.monthlySavings}.00 / month (${optimizationRecommendation.monthlySavings * 12}/yr)
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700">
                  {optimizationRecommendation.rationale}
                </p>
              </div>

              {actionDone ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Action Queued</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {optimizationRecommendation.action === 'Reclaim Copilot' && (
                    <button
                      onClick={() => handleAction('reclaim-copilot')}
                      className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap"
                    >
                      ⚡ Reclaim Copilot (Save $30/mo)
                    </button>
                  )}
                  {optimizationRecommendation.action === 'Downgrade to E3' && (
                    <button
                      onClick={() => handleAction('downgrade-e3')}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap"
                    >
                      ⚡ Downgrade E5 ➔ E3 (Save $15/mo)
                    </button>
                  )}
                  {optimizationRecommendation.action === 'Downgrade to F3' && (
                    <button
                      onClick={() => handleAction('downgrade-f3')}
                      className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap"
                    >
                      ⚡ Switch to F3 Web Tier (Save $30/mo)
                    </button>
                  )}
                  {optimizationRecommendation.action === 'Reclaim All (Dormant)' && (
                    <button
                      onClick={() => handleAction('reclaim-all')}
                      className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap"
                    >
                      ⚡ Reclaim Inactive License (Save ${user.monthlyCost}/mo)
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Granular Component-by-Component Utilization Cards */}
          <div>
            <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider mb-3">
              Detailed Subscription Component Telemetry
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* 1. Microsoft 365 Copilot */}
              <div className={`p-4 rounded-xl border ${
                components?.copilot?.assigned ? (
                  components.copilot.status === 'Dormant' ? 'bg-rose-50/70 border-rose-200' :
                  components.copilot.status === 'Low Usage' ? 'bg-amber-50/70 border-amber-200' : 'bg-emerald-50/70 border-emerald-200'
                ) : 'bg-slate-100/70 border-slate-200 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🤖</span>
                    <span className="font-bold text-sm text-slate-900">Microsoft 365 Copilot</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    components?.copilot?.status === 'Active' ? 'bg-emerald-200 text-emerald-900' :
                    components?.copilot?.status === 'Low Usage' ? 'bg-amber-200 text-amber-900' :
                    components?.copilot?.status === 'Dormant' ? 'bg-rose-200 text-rose-900' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {components?.copilot?.status || 'Not Assigned'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Prompts (Last 30d)</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">
                      {components?.copilot?.promptsThisMonth ?? 0}
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Last Prompt</div>
                    <div className="text-xs font-bold text-slate-700 mt-1 truncate">
                      {components?.copilot?.lastPromptDate ? (
                        components.copilot.lastPromptDate.includes('Never') ? components.copilot.lastPromptDate : new Date(components.copilot.lastPromptDate).toLocaleDateString()
                      ) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Office Desktop Apps (Word, Excel, PowerPoint) */}
              <div className={`p-4 rounded-xl border ${
                components?.officeApps?.mode === 'Desktop + Web' ? 'bg-emerald-50/70 border-emerald-200' :
                components?.officeApps?.mode === 'Web Only' ? 'bg-amber-50/70 border-amber-200' : 'bg-rose-50/70 border-rose-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    <span className="font-bold text-sm text-slate-900">Office Apps (Word, Excel, PPT)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    components?.officeApps?.mode === 'Desktop + Web' ? 'bg-emerald-200 text-emerald-900' :
                    components?.officeApps?.mode === 'Web Only' ? 'bg-amber-200 text-amber-900' : 'bg-rose-200 text-rose-900'
                  }`}>
                    {components?.officeApps?.mode || 'Inactive'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Desktop App Launches</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">
                      {components?.officeApps?.desktopLaunches30d ?? 0} / mo
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Web App Sessions</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">
                      {components?.officeApps?.webAppSessions30d ?? 0} / mo
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Microsoft Teams */}
              <div className="p-4 rounded-xl border bg-white border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💬</span>
                    <span className="font-bold text-sm text-slate-900">Microsoft Teams</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    components?.teams?.status === 'High Activity' ? 'bg-indigo-100 text-indigo-900' :
                    components?.teams?.status === 'Moderate' ? 'bg-sky-100 text-sky-900' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {components?.teams?.status || 'Inactive'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-slate-600">
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Active Days</div>
                    <div className="text-sm font-black text-slate-800">{components?.teams?.activeDays30d ?? 0} d</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Calls Attended</div>
                    <div className="text-sm font-black text-slate-800">{components?.teams?.callsAttended30d ?? 0}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Chats Sent</div>
                    <div className="text-sm font-black text-slate-800">{components?.teams?.chatsSent30d ?? 0}</div>
                  </div>
                </div>
              </div>

              {/* 4. Exchange Online Mailbox */}
              <div className="p-4 rounded-xl border bg-white border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✉️</span>
                    <span className="font-bold text-sm text-slate-900">Exchange Online</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900">
                    {components?.exchange?.status || 'Active'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-slate-600">
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Sent (30d)</div>
                    <div className="text-sm font-black text-slate-800">{components?.exchange?.emailsSent30d ?? 0}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Received (30d)</div>
                    <div className="text-sm font-black text-slate-800">{components?.exchange?.emailsReceived30d ?? 0}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Storage Used</div>
                    <div className="text-sm font-black text-slate-800">{components?.exchange?.mailboxUsedGb ?? 0} GB</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            User ID: {user.id} • Cost Center: {user.costCenter}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
