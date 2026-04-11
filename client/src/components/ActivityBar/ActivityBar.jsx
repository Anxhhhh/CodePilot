import React from 'react';

const ActivityBar = () => {
  return (
    <div className="w-16 bg-sidebar flex flex-col justify-between py-4 flex-shrink-0 border-r border-slate-800/50">
      <div className="flex flex-col items-center gap-6">
        <div className="text-accent cursor-pointer p-2 border-l-2 border-accent shadow-accent-glow transition-all duration-200">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 7H21M3 12H21M3 17H21" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="text-slate-500 hover:text-slate-300 cursor-pointer p-2 transition-all duration-200">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
        <div className="text-slate-500 hover:text-slate-300 cursor-pointer p-2 transition-all duration-200">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Z"/><path d="M4 12h16"/><path d="M12 2v20"/>
          </svg>
        </div>
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="text-slate-500 hover:text-slate-300 cursor-pointer p-2 transition-all duration-200">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ActivityBar;
