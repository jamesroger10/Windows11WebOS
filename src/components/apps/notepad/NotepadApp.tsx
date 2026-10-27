import React, { useState, useEffect } from 'react';
import { useFileSystemStore } from '../../../stores/useFileSystemStore';

interface NotepadAppProps {
  windowId: string;
  customData?: {
    fileId?: string;
    title?: string;
    content?: string;
  };
}

export const NotepadApp: React.FC<NotepadAppProps> = ({ customData }) => {
  const { updateFileContent } = useFileSystemStore();
  const [content, setContent] = useState(customData?.content || '');
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    if (customData?.content !== undefined) {
      setContent(customData.content);
    }
  }, [customData]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    if (customData?.fileId) {
      updateFileContent(customData.fileId, content);
      setIsSaved(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1f1f24] text-zinc-200 text-xs overflow-hidden select-text">
      {/* Menu Bar */}
      <div className="flex items-center gap-3 px-3 py-1 bg-[#25252d] border-b border-white/[0.06] select-none text-[12px]">
        <button onClick={handleSave} className="px-2 py-0.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white">
          File
        </button>
        <button className="px-2 py-0.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white">
          Edit
        </button>
        <button className="px-2 py-0.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white">
          View
        </button>
        {customData?.fileId && (
          <button
            onClick={handleSave}
            className={`ml-auto px-2 py-0.5 rounded text-[11px] ${
              isSaved ? 'text-zinc-500' : 'bg-sky-500 text-white'
            }`}
          >
            {isSaved ? 'Saved' : 'Save (Ctrl+S)'}
          </button>
        )}
      </div>

      {/* Editor Area */}
      <textarea
        value={content}
        onChange={handleTextChange}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            handleSave();
          }
        }}
        placeholder="Type something here..."
        className="flex-1 w-full bg-transparent p-4 outline-none resize-none font-mono text-[13px] text-zinc-100 placeholder-zinc-500 selection:bg-sky-500/40"
      />

      {/* Status Bar */}
      <div className="h-6 shrink-0 bg-[#19191e] border-t border-white/[0.06] px-3 flex items-center justify-between text-[11px] text-zinc-400 select-none">
        <div>Ln {content.split('\n').length}, Col {content.length}</div>
        <div className="flex items-center gap-4">
          <span>{content.length} characters</span>
          <span>UTF-8</span>
          <span>Windows (CRLF)</span>
        </div>
      </div>
    </div>
  );
};
