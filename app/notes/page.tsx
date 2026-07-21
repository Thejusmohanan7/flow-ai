"use client";

import { useEffect, useState } from "react";
import NotesMain from "@/components/notes/notes";

type NoteType = {
  _id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/notes");

      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await res.json();
      setNotes(data.data || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-400 font-sans">
        Loading notes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 font-sans">
        {error}
        <button
          onClick={fetchNotes}
          className="block mt-3 px-3 py-1 border rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return <NotesMain notes={notes} />;
}