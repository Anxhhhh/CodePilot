import React, { useState, useEffect } from 'react';

const FileIcon = ({ filename }) => {
  const extension = filename.split('.').pop().toLowerCase();
  
  const iconMap = {
    html: { color: 'text-orange-500', path: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
    css: { color: 'text-blue-400', path: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
    js: { color: 'text-yellow-400', path: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
    jsx: { color: 'text-cyan-400', path: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
    json: { color: 'text-yellow-500', path: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
    md: { color: 'text-slate-400', path: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
    default: { color: 'text-slate-500', path: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' }
  };

  const selected = iconMap[extension] || iconMap.default;

  return (
    <svg className={`${selected.color} ml-0.5`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      {extension === 'js' && <text x="7" y="17" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">JS</text>}
      {extension === 'jsx' && <text x="7" y="17" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none">JSX</text>}
      {extension === 'html' && <text x="7" y="17" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none">5</text>}
      {extension === 'css' && <text x="7" y="17" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none">#</text>}
      {extension === 'json' && <text x="7" y="17" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none">{}</text>}
    </svg>
  );
};


const Sidebar = ({ onFileSelect, activeFile, refreshKey }) => {
  const [files, setFiles] = useState([]);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [targetParent, setTargetParent] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState(new Set());

  const toggleFolder = (folderName) => {
    setCollapsedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderName)) {
        newSet.delete(folderName);
      } else {
        newSet.add(folderName);
      }
      return newSet;
    });
  };

  const isVisible = (fileName) => {
    const parts = fileName.split('/');
    let currentPath = '';
    for (let i = 0; i < parts.length - 1; i++) {
      currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
      if (collapsedFolders.has(currentPath)) {
        return false;
      }
    }
    return true;
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/folder/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '' }) // Recursive read from root
      });
      const result = await response.json();
      if (result.success && result.data && Array.isArray(result.data.data)) {
        setFiles(result.data.data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [refreshKey]);


  const handleCreate = async (e) => {
    if (e.key === 'Enter' && inputValue) {
      const fullName = targetParent ? `${targetParent}/${inputValue}` : inputValue;
      const endpoint = isCreatingFile 
        ? `http://localhost:8000/api/v1/files/create?name=${fullName}`
        : 'http://localhost:8000/api/v1/folder/create';
      
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isCreatingFile ? { body: '' } : { name: fullName })
      };

      try {
        const response = await fetch(endpoint, options);
        if (response.ok) {
          setInputValue('');
          setIsCreatingFile(false);
          setIsCreatingFolder(false);
          setTargetParent('');
          fetchFiles();
        }
      } catch (error) {
        console.error('Error creating:', error);
      }
    } else if (e.key === 'Escape') {
      setIsCreatingFile(false);
      setIsCreatingFolder(false);
      setTargetParent('');
      setInputValue('');
    }
  };

  const startCreation = (type, parent = '') => {
    if (type === 'file') setIsCreatingFile(true);
    else setIsCreatingFolder(true);
    setTargetParent(parent);
    setIsCollapsed(false);
    if (parent) {
      setCollapsedFolders(prev => {
        const newSet = new Set(prev);
        newSet.delete(parent);
        return newSet;
      });
    }
  };

  const getIndent = (name) => {
    return (name.split('/').length - 1) * 12;
  };

  const getName = (name) => {
    return name.split('/').pop();
  };

  return (
    <div className="w-64 bg-sidebar flex flex-col flex-shrink-0 border-r border-slate-800/50 h-full">
      <div className="p-4 text-[11px] font-bold tracking-widest text-slate-500 uppercase flex justify-between items-center">
        Explorer
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="group flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800/30 cursor-pointer hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`${isCollapsed ? '' : 'rotate-90'} transition-transform duration-200`}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
            MYCODEPIOLET
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); startCreation('file'); }}
              className="hover:text-white transition-colors p-0.5" title="New File"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); startCreation('folder'); }}
              className="hover:text-white transition-colors p-0.5" title="New Folder"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="17" x2="12" y2="11"/><line x1="9" y1="14" x2="15" y2="14"/>
              </svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); fetchFiles(); }} className="hover:text-white transition-colors p-0.5" title="Refresh">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
              </svg>
            </button>
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="py-1">
            {(isCreatingFile || isCreatingFolder) && !targetParent && (
              <div className="flex items-center gap-2 px-4 py-1">
                {isCreatingFile ? (
                  <svg className="text-slate-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                ) : (
                  <svg className="text-accent" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                )}
                <input 
                  autoFocus
                  className="bg-slate-800/50 text-slate-200 text-sm outline-none px-1 rounded-sm w-full border border-accent/30"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleCreate}
                  onBlur={() => { setIsCreatingFile(false); setIsCreatingFolder(false); setInputValue(''); }}
                />
              </div>
            )}

            {files.filter(file => isVisible(file.name)).map((file, i) => (
              <React.Fragment key={i}>
                <div 
                  onClick={() => {
                    if (file.type === 'file') onFileSelect(file.name);
                    else if (file.type === 'folder') toggleFolder(file.name);
                  }}
                  style={{ paddingLeft: `${16 + getIndent(file.name)}px` }}
                  className={`flex items-center justify-between pr-4 py-1 text-sm transition-colors duration-150 group cursor-pointer ${
                    activeFile === file.name 
                      ? 'bg-accent/20 text-accent border-r-2 border-accent' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {file.type === 'folder' ? (
                      <>
                        <svg 
                          className={`min-w-[12px] opacity-70 transition-transform duration-200 ${collapsedFolders.has(file.name) ? '' : 'rotate-90'}`} 
                          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        >
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                        <svg className="text-accent ml-0.5" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                      </>
                    ) : (
                      <>
                        <div className="min-w-[12px]"></div>
                        <FileIcon filename={file.name} />
                      </>
                    )}
                    <span className="truncate">{getName(file.name)}</span>
                  </div>
                  
                  {file.type === 'folder' && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); startCreation('file', file.name); }}
                        className="hover:text-white p-0.5" title="New File"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); startCreation('folder', file.name); }}
                        className="hover:text-white p-0.5" title="New Folder"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="17" x2="12" y2="11"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
                      </button>
                    </div>
                  )}
                </div>

                {(isCreatingFile || isCreatingFolder) && targetParent === file.name && (
                  <div className="flex items-center gap-2 pl-8 pr-4 py-1" style={{ paddingLeft: `${16 + getIndent(file.name) + 16}px` }}>
                    {isCreatingFile ? (
                      <FileIcon filename={inputValue || 'temp'} />
                    ) : (
                      <svg className="text-accent" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                    )}
                    <input 
                      autoFocus
                      className="bg-slate-800/50 text-slate-200 text-sm outline-none px-1 rounded-sm w-full border border-accent/30"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleCreate}
                      onBlur={() => { setIsCreatingFile(false); setIsCreatingFolder(false); setTargetParent(''); setInputValue(''); }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
