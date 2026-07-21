"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Pencil, Check, X, StickyNote, Pin, ArrowLeft } from "lucide-react";

type NoteType = {
  _id: string;
  title: string;
  content: string;
  color: string;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
};

const noteColors: Record<string, { bg: string; border: string; dot: string }> = {
  yellow: {
    bg: "bg-yellow-50 dark:bg-yellow-900/10",
    border: "border-yellow-200 dark:border-yellow-900/40",
    dot: "bg-yellow-400",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/10",
    border: "border-blue-200 dark:border-blue-900/40",
    dot: "bg-blue-400",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/10",
    border: "border-green-200 dark:border-green-900/40",
    dot: "bg-green-400",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/10",
    border: "border-purple-200 dark:border-purple-900/40",
    dot: "bg-purple-400",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/10",
    border: "border-orange-200 dark:border-orange-900/40",
    dot: "bg-orange-400",
  },
  gray: {
    bg: "bg-gray-50 dark:bg-gray-800",
    border: "border-gray-200 dark:border-gray-700",
    dot: "bg-gray-400",
  },
};

const colorOrder = ["yellow", "blue", "green", "purple", "orange", "gray"];

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

export default function NotesMain({ notes }: { notes: NoteType[] }) {
  const [noteList, setNoteList] = useState<NoteType[]>(notes);

  const [composerOpen, setComposerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newColor, setNewColor] = useState("yellow");
  const [newPinned, setNewPinned] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editColor, setEditColor] = useState("yellow");
  const [editPinned, setEditPinned] = useState(false);

  const sortedNotes = useMemo(() => {
    return [...noteList].sort((a, b) => {
      const aPinned = a.pinned ? 0 : 1;
      const bPinned = b.pinned ? 0 : 1;
      return aPinned - bPinned;
    });
  }, [noteList]);

  const resetComposer = () => {
    setNewTitle("");
    setNewContent("");
    setNewColor("yellow");
    setNewPinned(false);
    setComposerOpen(false);
  };

  const addNote = async () => {
    if (!newTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          color: newColor,
          pinned: newPinned,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create note");
        return;
      }

      setNoteList((prev) => [data.data, ...prev]);
      resetComposer();
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id: string) => {
    const confirmDelete = confirm("Delete this note?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });

    if (res.ok) {
      setNoteList((prev) => prev.filter((n) => n._id !== id));
    } else {
      alert("Failed to delete note");
    }
  };

  const startEdit = (note: NoteType) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditColor(note.color || "yellow");
    setEditPinned(!!note.pinned);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    setEditColor("yellow");
    setEditPinned(false);
  };

  const saveEdit = async (note: NoteType) => {
    if (!editTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    const res = await fetch(`/api/notes/${note._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...note,
        title: editTitle.trim(),
        content: editContent.trim(),
        color: editColor,
        pinned: editPinned,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setNoteList((prev) =>
        prev.map((n) => (n._id === note._id ? data.data : n))
      );
      cancelEdit();
    } else {
      alert("Failed to update note");
    }
  };

  const togglePin = async (note: NoteType) => {
    const res = await fetch(`/api/notes/${note._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...note, pinned: !note.pinned }),
    });

    if (res.ok) {
      const data = await res.json();
      setNoteList((prev) =>
        prev.map((n) => (n._id === note._id ? data.data : n))
      );
    } else {
      alert("Failed to update note");
    }
  };

  return (
    <div className="w-full">

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* <h1 className="text-xl font-bold font-heading tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            Notes
          </h1> */}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-sans">
            {noteList.length} {noteList.length === 1 ? "note" : "notes"}
          </p>
        </div>

        {/* {!composerOpen && (
          <button
            onClick={() => setComposerOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-transform hover:scale-105 font-sans sm:self-auto sm:py-2"
          >
            <Plus size={16} />
            New Note
          </button>
        )} */}
      </div>

      <AnimatePresence>
        {composerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-6 overflow-hidden"
          >
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Note title"
                  className="min-w-0 flex-1 border-none bg-transparent text-base font-semibold font-heading text-gray-900 dark:text-white outline-none placeholder-gray-400 dark:placeholder-gray-500 sm:text-lg"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setNewPinned((p) => !p)}
                  className={`shrink-0 rounded-full p-1.5 transition-colors ${
                    newPinned
                      ? "bg-yellow-400 text-black"
                      : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  aria-label="Toggle pin"
                >
                  <Pin size={15} className={newPinned ? "fill-current" : ""} />
                </button>
              </div>

              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write something..."
                rows={3}
                className="mt-2 w-full border-none bg-transparent text-sm font-sans text-gray-700 dark:text-gray-300 outline-none placeholder-gray-400 dark:placeholder-gray-500 resize-none"
              />

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1.5">
                  {colorOrder.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      className={`h-6 w-6 shrink-0 rounded-full ${noteColors[c].dot} transition-transform ${
                        newColor === c
                          ? "scale-110 ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800"
                          : "hover:scale-105"
                      }`}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={resetComposer}
                    className="flex-1 rounded-full border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 font-sans sm:flex-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addNote}
                    disabled={saving}
                    className="flex-1 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60 font-sans sm:flex-none"
                  >
                    {saving ? "Saving..." : "Save Note"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {sortedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-16 text-center">
          <StickyNote className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
          <p className="text-sm font-medium text-gray-900 dark:text-white font-sans">
            No notes yet
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-sans">
            Tap "New Note" to jot something down.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <AnimatePresence>
            {sortedNotes.map((note) => {
              const colors = noteColors[note.color] || noteColors.gray;
              const isEditing = editingId === note._id;

              return (
                <motion.div
                  key={note._id}
                  layout
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className={`relative min-w-0 rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md ${colors.bg} ${colors.border}`}
                >
                  {note.pinned && !isEditing && (
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-black shadow">
                      <Pin size={12} className="fill-current" />
                    </span>
                  )}

                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="min-w-0 flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-sm font-semibold font-heading text-gray-900 dark:text-white outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setEditPinned((p) => !p)}
                          className={`shrink-0 rounded-full p-1.5 transition-colors ${
                            editPinned
                              ? "bg-yellow-400 text-black"
                              : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          aria-label="Toggle pin"
                        >
                          <Pin size={14} className={editPinned ? "fill-current" : ""} />
                        </button>
                      </div>

                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-sm font-sans text-gray-900 dark:text-white outline-none resize-none"
                      />

                      <div className="flex items-center gap-1.5">
                        {colorOrder.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setEditColor(c)}
                            className={`h-5 w-5 shrink-0 rounded-full ${noteColors[c].dot} transition-transform ${
                              editColor === c ? "scale-110 ring-2 ring-gray-400" : ""
                            }`}
                            aria-label={`Color ${c}`}
                          />
                        ))}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => saveEdit(note)}
                          className="inline-flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white hover:bg-green-600 font-sans"
                        >
                          <Check size={12} />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="inline-flex items-center gap-1 rounded-full border border-gray-300 dark:border-gray-600 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700 font-sans"
                        >
                          <X size={12} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="min-w-0 text-sm font-semibold font-heading text-gray-900 dark:text-white line-clamp-1">
                          {note.title}
                        </h3>
                        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${colors.dot}`} />
                      </div>

                      {note.content && (
                        <p className="mt-1.5 text-sm font-sans text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-6 break-words">
                          {note.content}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
                          {formatRelativeTime(note.updatedAt || note.createdAt)}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => togglePin(note)}
                            className={`rounded-full p-1.5 transition-colors ${
                              note.pinned
                                ? "text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                                : "text-gray-400 hover:bg-white/60 dark:hover:bg-gray-700"
                            }`}
                            aria-label="Toggle pin"
                          >
                            <Pin size={13} className={note.pinned ? "fill-current" : ""} />
                          </button>
                          <button
                            onClick={() => startEdit(note)}
                            className="rounded-full p-1.5 text-gray-500 dark:text-gray-400 transition-colors hover:bg-white/60 dark:hover:bg-gray-700"
                            aria-label="Edit note"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => deleteNote(note._id)}
                            className="rounded-full p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/30"
                            aria-label="Delete note"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}