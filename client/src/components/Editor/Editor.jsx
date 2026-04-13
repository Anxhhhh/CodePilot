import React, { useState, useEffect } from 'react';

const Editor = ({ activeFile, fileUpdateKey }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activeFile) {
      loadFileContent();
    }
  }, [activeFile, fileUpdateKey]);

  const loadFileContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/files/read?name=${activeFile}`);
      const result = await response.json();
      if (result.success) {
        setContent(result.data.content);
      }
    } catch (error) {
      console.error('Error loading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!activeFile) return;
    setSaving(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/files/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: activeFile, content })
      });
      if (response.ok) {
        // Show success state briefly if needed
      }
    } catch (error) {
      console.error('Error saving file:', error);
    } finally {
      setSaving(false);
    }
  };

  const lineCount = content.split('\n').length;

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-editor text-slate-500 font-medium italic">
        Select a file to start editing
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-editor overflow-hidden">
      <div className="h-10 flex items-center justify-between bg-sidebar border-b border-slate-800/50 px-4">
        <div className="flex items-center gap-2">
          <div className="h-full flex items-center gap-2 px-4 bg-editor text-slate-200 text-xs cursor-pointer border-t border-accent relative min-w-[120px] py-3.5">
            <span className="truncate">{activeFile}</span>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`px-3 py-1 text-xs font-bold rounded transition-all ${
            saving 
              ? 'bg-slate-700 text-slate-400' 
              : 'bg-accent hover:bg-accent-hover text-white shadow-accent-glow'
          }`}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="flex-1 flex font-mono text-sm leading-relaxed overflow-hidden">
        <div className="w-12 bg-sidebar text-right pr-4 py-4 text-slate-600 select-none border-r border-slate-800/30">
          {Array.from({ length: Math.max(lineCount, 1) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="flex-1 relative">
          <textarea
            className="absolute inset-0 w-full h-full bg-transparent text-slate-300 p-4 resize-none outline-none caret-accent selection:bg-accent/30"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck="false"
          />
          {loading && (
            <div className="absolute inset-0 bg-editor/50 flex items-center justify-center backdrop-blur-sm">
              <span className="text-accent animate-pulse">Loading {activeFile}...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
