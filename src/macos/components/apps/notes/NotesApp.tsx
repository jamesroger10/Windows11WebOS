import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Folder,
  CheckSquare,
  Bold,
  Italic,
  Underline,
  List,
} from 'lucide-react';

interface NoteItem {
  id: string;
  title: string;
  date: string;
  body: string;
}

interface NotesAppProps {
  customData?: { title?: string; content?: string };
}

export const NotesApp: React.FC<NotesAppProps> = ({ customData }) => {
  const [notes, setNotes] = useState<NoteItem[]>([
    {
      id: 'note-1',
      title: customData?.title || 'Welcome to Notes',
      date: 'Today, 9:41 AM',
      body:
        customData?.content ||
        `macOS 27 Liquid Glass Notes App.
- Clean Apple typography
- Markdown-style drafting
- Instant state syncing`,
    },
    {
      id: 'note-2',
      title: 'Project Roadmap 2027',
      date: 'Yesterday',
      body: `Key Milestones:
1. Complete hypervisor acceleration layer
2. Transition UI to ultra-vibrant materials
3. Finalize zero-latency multi-tasking`,
    },
    {
      id: 'note-3',
      title: 'Shopping List',
      date: 'Oct 24',
      body: `- Studio Display 5K
- Magic Keyboard with Touch ID
- Magic Mouse (Space Black)`,
    },
  ]);

  const [activeNoteId, setActiveNoteId] = useState<string>('note-1');

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleCreateNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'New Note',
      date: 'Just now',
      body: '',
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    if (notes.length <= 1) return;
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    setActiveNoteId(remaining[0].id);
  };

  const handleUpdateBody = (text: string) => {
    const lines = text.split('\n');
    const firstLine = lines[0]?.trim() || 'New Note';
    setNotes(
      notes.map((n) =>
        n.id === activeNoteId ? { ...n, body: text, title: firstLine, date: 'Just now' } : n
      )
    );
  };

  return (
    <div
      className="flex-1 flex h-full bg-[#1e1e24] text-white select-none overflow-hidden"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
    >
      {/* Left Column: Note List */}
      <div className="w-56 bg-[#1a1a20] border-r border-white/[0.08] flex flex-col shrink-0 text-xs">
        {/* Top actions */}
        <div className="h-10 px-3 border-b border-white/[0.08] flex items-center justify-between">
          <span className="font-semibold text-zinc-300">All iCloud</span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCreateNote}
              className="p-1.5 rounded hover:bg-white/10 text-amber-400"
              title="New Note"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => handleDeleteNote(activeNoteId)}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-red-400"
              title="Delete Note"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Notes Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notes.map((note) => {
            const isSelected = note.id === activeNoteId;
            return (
              <button
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`w-full p-2.5 rounded-xl text-left transition-colors ${
                  isSelected ? 'bg-[#f4ca38] text-black font-semibold shadow-sm' : 'hover:bg-white/5 text-zinc-200'
                }`}
              >
                <div className="text-xs truncate">{note.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] ${isSelected ? 'text-zinc-800' : 'text-zinc-400'}`}>
                    {note.date}
                  </span>
                  <span
                    className={`text-[10.5px] truncate ${
                      isSelected ? 'text-zinc-700' : 'text-zinc-500'
                    }`}
                  >
                    {note.body.slice(0, 30)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Note Editor */}
      <div className="flex-1 flex flex-col bg-[#1e1e24] p-5 overflow-hidden">
        {/* Formatting Bar */}
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/[0.08] text-zinc-400">
          <button className="p-1 rounded hover:bg-white/10 hover:text-white">
            <Bold size={14} />
          </button>
          <button className="p-1 rounded hover:bg-white/10 hover:text-white">
            <Italic size={14} />
          </button>
          <button className="p-1 rounded hover:bg-white/10 hover:text-white">
            <Underline size={14} />
          </button>
          <div className="w-px h-4 bg-white/20 mx-1" />
          <button className="p-1 rounded hover:bg-white/10 hover:text-white">
            <List size={14} />
          </button>
          <button className="p-1 rounded hover:bg-white/10 hover:text-white">
            <CheckSquare size={14} />
          </button>
          <span className="ml-auto text-[11px] text-zinc-500">{activeNote?.date}</span>
        </div>

        {/* Textarea */}
        <textarea
          value={activeNote?.body || ''}
          onChange={(e) => handleUpdateBody(e.target.value)}
          placeholder="Start typing your note..."
          className="flex-1 w-full bg-transparent border-none outline-none text-zinc-100 text-sm leading-relaxed resize-none font-sans"
        />
      </div>
    </div>
  );
};
