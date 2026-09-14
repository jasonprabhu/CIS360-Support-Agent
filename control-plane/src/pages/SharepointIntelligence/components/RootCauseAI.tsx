import { useSharePointData } from '../../../services/sharepointIntelligence/SharePointDataProvider';

const RootCauseAI = (/* { onDrilldown }: { onDrilldown?: (data: any) => void } */) => {
  const { data } = useSharePointData();
  const { rootCauseTimeline } = data;

  const getIcon = (type: string) => {
    switch(type) {
      case 'change': return <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center z-10 relative ring-4 ring-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></div>;
      case 'failure': return <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center z-10 relative ring-4 ring-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>;
      case 'ticket': return <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center z-10 relative ring-4 ring-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></div>;
      case 'impact': return <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center z-10 relative ring-4 ring-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-indigo-200 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4">
        <span className="bg-indigo-100 text-indigo-800 text-xs font-black uppercase px-3 py-1 rounded-full flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          AI Root Cause Detected
        </span>
      </div>
      
      <div className="p-8 pb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Cross-Service Intelligence</h2>
        <p className="text-sm font-semibold text-gray-600">
          "SharePoint access incidents increased 43% after a permission-group change affecting the Finance site."
        </p>
      </div>

      <div className="p-8 pt-4">
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6">
            {rootCauseTimeline.map((node, i) => (
              <div key={i} className="flex relative">
                <div className="mr-6 flex-shrink-0">
                  {getIcon(node.type)}
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex-1 mt-0.5 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-900 text-sm">{node.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{node.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-3 flex-wrap">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded shadow-sm transition-colors">Investigate Change</button>
          <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs px-4 py-2 rounded transition-colors">View Affected Users</button>
          <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs px-4 py-2 rounded transition-colors">Explain with AI</button>
        </div>
      </div>
    </div>
  );
};
export default RootCauseAI;
