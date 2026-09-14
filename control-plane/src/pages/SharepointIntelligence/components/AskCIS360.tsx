const AskCIS360 = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl shadow-lg p-1">
      <div className="bg-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-white/10 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-shrink-0 text-indigo-200">
          <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
        </div>
        <div className="flex-1 w-full relative">
          <input 
            type="text" 
            placeholder="Ask CIS360 about your content... (e.g., 'Show me sites with unusual download activity')"
            className="w-full bg-white/20 border border-white/30 text-white placeholder-indigo-200 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all text-sm sm:text-base"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-indigo-200 transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
export default AskCIS360;
