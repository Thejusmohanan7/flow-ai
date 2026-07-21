"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Pin, ArrowLeft } from "lucide-react";

const colorOrder = ["yellow", "blue", "green", "purple", "orange", "gray"];

const colorSwatch: Record<string, string> = {
  yellow: "bg-yellow-400",
  blue: "bg-blue-400",
  green: "bg-green-400",
  purple: "bg-purple-400",
  orange: "bg-orange-400",
  gray: "bg-gray-400",
};

const previewStyle: Record<string, { bg: string; border: string }> = {
  yellow: { bg: "bg-yellow-50 dark:bg-yellow-900/10", border: "border-yellow-200 dark:border-yellow-900/40" },
  blue: { bg: "bg-blue-50 dark:bg-blue-900/10", border: "border-blue-200 dark:border-blue-900/40" },
  green: { bg: "bg-green-50 dark:bg-green-900/10", border: "border-green-200 dark:border-green-900/40" },
  purple: { bg: "bg-purple-50 dark:bg-purple-900/10", border: "border-purple-200 dark:border-purple-900/40" },
  orange: { bg: "bg-orange-50 dark:bg-orange-900/10", border: "border-orange-200 dark:border-orange-900/40" },
  gray: { bg: "bg-gray-50 dark:bg-gray-800", border: "border-gray-200 dark:border-gray-700" },
};

export default function NewNotePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [color, setColor] = useState("yellow");
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);

  // grammar check state
  const [checkingGrammar, setCheckingGrammar] = useState(false);
  const [grammarSuggestion, setGrammarSuggestion] = useState<{
    correctedText: string;
    corrections: string[];
  } | null>(null);
  const [grammarError, setGrammarError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount =
    content.trim().length > 0 ? content.trim().split(/\s+/).length : 0;

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Title cannot be empty");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          pinned,
          color,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save note");
        return;
      }

      router.push("/notes");
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleCheckGrammar = async () => {
    if (!content.trim()) return;

    try {
      setCheckingGrammar(true);
      setGrammarError(null);
      setGrammarSuggestion(null);

      const res = await fetch("/api/ai-grammercheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGrammarError(data.message || "Grammar check failed");
        return;
      }

      if (data.hasChanges) {
        setGrammarSuggestion({
          correctedText: data.correctedText,
          corrections: data.corrections,
        });
      } else {
        setGrammarSuggestion(null);
        setGrammarError("No issues found ✓");
      }
    } catch (error) {
      setGrammarError("Something went wrong");
    } finally {
      setCheckingGrammar(false);
    }
  };

  const applyGrammarSuggestion = () => {
    if (grammarSuggestion) {
      setContent(grammarSuggestion.correctedText);
      setGrammarSuggestion(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (!fileList || fileList.length === 0) return;

    const newFiles = Array.from(fileList);

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const preview = previewStyle[color] || previewStyle.gray;

  return (
    <div className="p-6 space-y-6 font-sans">
      {/* HEADER */}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EDITOR */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h2 className="text-xl font-semibold font-heading bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Create Note
          </h2>

          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white font-heading outline-none focus:border-blue-500"
          />

          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white outline-none resize-none focus:border-blue-500"
          />

          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {wordCount} words
          </p>

          {/* Grammar check controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCheckGrammar}
              disabled={checkingGrammar || !content.trim()}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition disabled:opacity-50"
            >
              {checkingGrammar ? "Checking..." : "Check Grammar & Spelling"}
            </button>
            {grammarError && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {grammarError}
              </span>
            )}
          </div>

          {grammarSuggestion && (
            <div className="border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-3 space-y-2">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                Suggested corrections:
              </p>
              <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {grammarSuggestion.correctedText}
              </p>
              {grammarSuggestion.corrections.length > 0 && (
                <ul className="text-xs text-gray-500 dark:text-gray-400 list-disc list-inside">
                  {grammarSuggestion.corrections.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={applyGrammarSuggestion}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-green-500 text-white hover:bg-green-600 transition"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => setGrammarSuggestion(null)}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div>
            <p className="text-sm mb-2 text-gray-700 dark:text-gray-300">Note Color:</p>
            <div className="flex gap-2">
              {colorOrder.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full ${colorSwatch[c]} transition-transform ${
                    color === c
                      ? "scale-110 ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900"
                      : "hover:scale-105"
                  }`}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
              dragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-700"
            }`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Drag & drop files or click to upload
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              (Attachments aren't saved yet — coming soon)
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 py-1 rounded flex justify-between"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    className="text-red-500 shrink-0 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PREVIEW */}
        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold font-heading mb-3 text-gray-900 dark:text-white">
            Preview
          </h2>

          <div className={`${preview.bg} ${preview.border} border p-4 rounded-lg shadow-sm space-y-3`}>
            <h3 className="text-xl font-bold font-heading text-gray-900 dark:text-white">
              {title || "Untitled Note"}
            </h3>

            <p className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300">
              {content || "Start typing..."}
            </p>

            {files.length > 0 && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Attachments:
                </p>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  {files.map((file, index) => (
                    <li key={index}>📎 {file.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {pinned && (
              <span className="inline-flex items-center gap-1 text-xs bg-yellow-400 text-black px-2 py-1 rounded">
                <Pin size={11} className="fill-current" />
                Pinned
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:scale-105 transition disabled:opacity-60 disabled:hover:scale-100"
          >
            {saving ? "Saving..." : "Save Note"}
          </button>

          <button
            onClick={() => setPinned(!pinned)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
              pinned
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}
          >
            <Pin size={13} className={pinned ? "fill-current" : ""} />
            {pinned ? "Pinned" : "Pin"}
          </button>
        </div>
      </div>
    </div>
  );
}