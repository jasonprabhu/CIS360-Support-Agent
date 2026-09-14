import { useSharePointData } from '../../../services/sharepointIntelligence/SharePointDataProvider';

const WhoHasAccess = () => {
  const { data } = useSharePointData();
  const { accessPath } = data;

  const getIcon = (type: string) => {
    switch(type) {
      case 'User': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
      case 'Group': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
      case 'Site': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
      case 'Folder': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
      case 'File': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        Who Has Access?
      </h2>
      <p className="text-sm text-gray-500 mb-6">Instantly map how a specific user is gaining access to a sensitive file.</p>
      
      <div className="flex gap-2 mb-8">
        <input 
          type="text" 
          value="Finance / Budget / FY2026.xlsx" 
          readOnly
          className="flex-1 border border-gray-300 rounded-md text-sm pl-4 py-2 bg-gray-50 text-gray-900" 
        />
        <button className="px-4 py-2 bg-indigo-600 text-white font-bold text-sm rounded-md hover:bg-indigo-700 transition-colors">
          Analyze Access
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 relative overflow-hidden">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Access Relationship Path</h3>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative z-10">
          {accessPath.map((node, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center w-full">
              {/* The Node */}
              <div className="bg-white border-2 border-indigo-200 rounded-lg p-4 shadow-sm flex flex-col items-center justify-center w-40 h-32 hover:border-indigo-500 transition-colors z-20">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-2">
                  {getIcon(node.type)}
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase text-center">{node.type}</p>
                <p className="text-sm font-bold text-gray-900 text-center leading-tight mt-1">{node.name}</p>
                {node.role && (
                  <span className="mt-2 bg-green-100 text-green-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                    {node.role}
                  </span>
                )}
              </div>
              
              {/* The Arrow (except for last item) */}
              {i < accessPath.length - 1 && (
                <div className="h-8 md:h-0 w-0 md:w-full border-l-2 md:border-l-0 md:border-t-2 border-dashed border-indigo-300 relative flex-1">
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 border-t-2 border-r-2 border-indigo-300 transform rotate-45"></div>
                  <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 border-b-2 border-r-2 border-indigo-300 transform rotate-45"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default WhoHasAccess;
