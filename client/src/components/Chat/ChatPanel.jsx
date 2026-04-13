import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import * as fileService from '../../services/files/files.service';

const ChatPanel = ({ onFileSystemChange, onFileUpdated }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Try to parse a file_operation JSON from AI response
  const tryParseFileOperation = (text) => {
    try {
      // Strip any accidental markdown code fences
      const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.type === 'file_operation' && parsed.action && parsed.file) {
        return parsed;
      }
    } catch (_) {
      // Not a JSON file operation
    }
    return null;
  };

  const executeFileOperation = async (op) => {
    const { action, file, content } = op;
    try {
      switch (action) {
        case 'create':
          await fileService.createFile(file, content || '');
          toast.success(`✅ Created \`${file}\``);
          return `✅ File \`${file}\` has been created successfully.`;

        case 'update':
        case 'edit':
        case 'modify':
          await fileService.updateFile(file, content || '');
          toast.success(`✅ Updated \`${file}\``);
          // Notify parent so Editor can re-fetch the updated file
          if (onFileUpdated) onFileUpdated(file);
          return `✅ File \`${file}\` has been updated successfully.`;

        case 'delete':
          await fileService.deleteFile(file);
          toast.success(`✅ Deleted \`${file}\``);
          return `✅ File \`${file}\` has been deleted successfully.`;

        default:
          return `⚠️ Unknown action: ${action}`;
      }
    } catch (err) {
      // Show the full error so we can debug what's going wrong
      const msg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err) || 'Unknown error');
      toast.error(`Failed to ${action} \`${file}\``);
      console.error('[File Operation Error]', { action, file, err });
      return `❌ Failed to ${action} \`${file}\`\n\nError: ${msg}`;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.content }),
      });

      const result = await response.json();

      if (result.success && result.data && result.data.response) {
        const rawResponse = result.data.response;
        const fileOp = tryParseFileOperation(rawResponse);

        if (fileOp) {
          // Execute the file operation and show a human-friendly message
          const confirmationMessage = await executeFileOperation(fileOp);
          setMessages(prev => [...prev, { role: 'assistant', content: confirmationMessage, isFileOp: true }]);
          // Trigger sidebar refresh
          if (onFileSystemChange) onFileSystemChange();
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: rawResponse }]);
        }
      } else {
        const serverError = result.message || (result.data && result.data.error) || 'Internal Server Error';
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${serverError}` }]);
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: Could not connect to the server (${error.message}).` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-[340px] bg-sidebar flex flex-col flex-shrink-0 border-l border-slate-800/50">
      <div className="p-4 bg-midnight text-[11px] font-bold tracking-[0.15em] flex justify-between items-center text-slate-500 uppercase">
        AI Assistant
        <button
          onClick={() => setMessages([])}
          className="text-slate-600 hover:text-slate-400 transition-colors"
          title="Clear conversation"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto no-scrollbar">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center gap-3 mt-10 text-center px-2">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
              </svg>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Ask me anything, or give me instructions to <span className="text-accent">create</span>, <span className="text-accent">update</span>, or <span className="text-accent">delete</span> files.
            </p>
            <div className="flex flex-col gap-1.5 w-full mt-1">
              {[
                'Create index.html in webdev with a Hello World page',
                'Update webdev/index.html to add a nav bar',
                'Delete webdev/test.js',
              ].map(hint => (
                <button
                  key={hint}
                  onClick={() => setInput(hint)}
                  className="text-left text-xs text-slate-600 hover:text-slate-400 bg-slate-800/30 hover:bg-slate-800/60 px-3 py-2 rounded-lg transition-all duration-150 border border-slate-800/50"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          msg.role === 'user' ? (
            <div key={index} className="border-l-2 border-accent pl-3">
              <div className="text-[13px] leading-relaxed text-slate-200 whitespace-pre-wrap break-words">
                {msg.content}
              </div>
            </div>
          ) : (
            <div key={index} className={`p-3 rounded-lg border ${msg.isFileOp ? 'bg-accent/5 border-accent/20' : 'bg-slate-800/40 border-slate-700/30'}`}>
              <div className="text-[13px] leading-relaxed text-slate-400 whitespace-pre-wrap break-words">
                {msg.content}
              </div>
            </div>
          )
        ))}

        {isLoading && (
          <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/30">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-slate-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-midnight/50 backdrop-blur-sm shadow-2xl flex flex-col gap-3 border-t border-slate-800/50">
        <textarea
          placeholder="Ask anything or say 'Create a file...'"
          className="bg-transparent border-none text-slate-200 font-sans text-[13px] resize-none min-h-[60px] outline-none placeholder:text-slate-600 w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-between items-center">
          <div className="flex gap-2 text-slate-600 text-xs">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 font-mono text-[10px]">↵</kbd>
            <span>send</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 font-mono text-[10px]">⇧↵</kbd>
            <span>newline</span>
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`p-2 rounded-md transition-all duration-200 shadow-lg flex items-center justify-center ${
              isLoading || !input.trim()
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                : 'bg-accent hover:bg-accent-hover text-white shadow-accent/20'
            }`}
          >
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
