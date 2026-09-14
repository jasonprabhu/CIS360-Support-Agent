interface Exchange360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: any;
}

const Exchange360Modal = ({ isOpen, onClose, payload }: Exchange360ModalProps) => {
  if (!isOpen || !payload) return null;

  const { type, data } = payload;

  const getTitle = () => {
    if (type === 'insight') return "Insight Investigation";
    if (type === 'forwarding') return "Rule Disablement: " + data.user;
    if (type === 'appMailbox') return "App Mailbox Details: " + data.accountName;
    return 'Exchange Deep Dive';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div 
        className="absolute inset-0 bg-gray-900 bg-opacity-25 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right h-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900 truncate pr-4">{getTitle()}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto bg-white">
          {type === 'insight' && (
            <div className="space-y-6">
              <div className="border-l-4 border-indigo-500 pl-4 py-1">
                <p className="text-sm font-semibold text-gray-900">{data.message}</p>
                <p className="text-xs text-gray-500 mt-1">Detected {data.timestamp}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase">Automated Action</p>
                <p className="text-sm text-gray-700 mt-2">CIS360 will automatically execute the necessary PowerShell scripts via Exchange Online to remediate this finding.</p>
              </div>
            </div>
          )}

          {type === 'forwarding' && (
            <div className="space-y-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <p className="text-sm text-red-800 font-semibold mb-2">Security Risk Detected</p>
                <p className="text-sm text-red-700">Corporate mail is being automatically forwarded to <strong>{data.target}</strong>.</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 text-sm">User</span>
                  <span className="font-medium text-gray-900 text-sm">{data.user}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 text-sm">Department</span>
                  <span className="font-medium text-gray-900 text-sm">{data.dept}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 text-sm">Created</span>
                  <span className="font-medium text-gray-900 text-sm">{data.created}</span>
                </div>
              </div>
            </div>
          )}

          {type === 'appMailbox' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">
                  {data.accountName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{data.accountName}</h4>
                  <p className="text-sm text-gray-500">{data.type} • {data.department}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Daily Volume</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{data.dailyVolume.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                  <p className={"text-lg font-bold mt-1 " + (data.throttled ? 'text-red-600' : 'text-green-600')}>{data.throttled ? 'Throttled' : 'Healthy'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm">
            {type === 'forwarding' ? 'Execute Disable Rule' : 'Execute Remediation'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Exchange360Modal;
