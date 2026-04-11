import React from 'react';

const ChatPanel = () => {
  return (
    <div className="w-[340px] bg-sidebar flex flex-col flex-shrink-0 border-l border-slate-800/50">
      <div className="p-4 bg-midnight text-[11px] font-bold tracking-[0.15em] flex justify-between items-center text-slate-500 uppercase">
        AI Assistant
        <button className="text-accent hover:text-accent-hover transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5v14"/>
          </svg>
        </button>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        <div className="border-l-2 border-accent pl-3">
          <div className="text-[13px] leading-relaxed text-slate-200">
            How do I center a div in this layout?
          </div>
        </div>
        <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/30">
          <div className="text-[13px] leading-relaxed text-slate-400">
            To center a div in this "Architectural Brutalism" system, utilize the <span className="text-accent font-mono">display: flex</span> with <span className="text-accent font-mono">align-items: center</span> and <span className="text-accent font-mono">justify-content: center</span> on the parent container.
          </div>
        </div>
      </div>
      <div className="p-4 bg-midnight/50 backdrop-blur-sm shadow-2xl flex flex-col gap-3 border-t border-slate-800/50">
        <textarea 
          placeholder="Ask anything..." 
          className="bg-transparent border-none text-slate-200 font-sans text-[13px] resize-none min-height-[60px] outline-none placeholder:text-slate-600 w-full"
        ></textarea>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 text-slate-500">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </div>
          <button className="bg-accent hover:bg-accent-hover text-white p-2 rounded-md transition-all duration-200 shadow-lg shadow-accent/20 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
