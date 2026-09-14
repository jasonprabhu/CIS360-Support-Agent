interface Identity360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: any;
}

const Identity360Modal = ({ isOpen, onClose, payload }: Identity360ModalProps) => {
  if (!isOpen || !payload) return null;

  const { type, data } = payload;

  const getTitle = () => {
    if (type === 'insight') return \`Insight: \${data.severity}\`;
    if (type === 'kpi') return \`Metric Deep Dive: \${data.title}\`;
    if (type === 'issue') return \`Issue Investigation: \${data.userName}\`;
    return 'Identity deep dive';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900 bg-opacity-25 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Slide-over Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900 truncate pr-4">{getTitle()}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto bg-white">
          
          {/* Dynamic Content based on Type */}
          {type === 'insight' && (
            <div className="space-y-6">
              <div className="border-l-4 border-indigo-500 pl-4 py-1">
                <p className="text-sm font-semibold text-gray-900">{data.message}</p>
                <p className="text-xs text-gray-500 mt-1">Detected {data.timestamp}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Impact Analysis</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{data.impact}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Affected Entities (Mock)</p>
                <ul className="space-y-2">
                  {[1,2,3].map(i => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-700 p-2 hover:bg-gray-50 rounded">
                      <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">U</div>
                      User {i} @ company.com
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {type === 'kpi' && (
            <div className="space-y-6">
              <div className="text-center pb-6 border-b border-gray-100">
                <p className="text-sm text-gray-500 mb-2">{data.title}</p>
                <p className="text-5xl font-bold text-gray-900">{data.value}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-4">Metric details and historical tabular data would appear here, allowing the admin to export or slice the data by department.</p>
              </div>
            </div>
          )}

          {type === 'issue' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xl font-bold">
                  {data.userName.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{data.userName}</p>
                  <p className="text-sm text-gray-500">ID: {data.userId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">Issue</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{data.issue}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">Risk Level</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{data.risk}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">Age</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{data.ageDays} days</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">Business Impact</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{data.impact}</p>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
                <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">Recommended Action</p>
                <p className="text-sm text-indigo-800">{data.recommendedAction}</p>
              </div>
            </div>
          )}
          
        </div>
        
        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm">
            Execute Automation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Identity360Modal;
