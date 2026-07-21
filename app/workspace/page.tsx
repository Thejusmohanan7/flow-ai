"use client";

import { useEffect, useState } from "react";

export default function Workspace() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, noteRes] = await Promise.all([
          fetch("/api/tasks"),
          fetch("/api/notes"),
        ]);

        const taskData = await taskRes.json();
        const noteData = await noteRes.json();

        setTasks(Array.isArray(taskData.data) ? taskData.data : []);
        setNotes(Array.isArray(noteData.data) ? noteData.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        Loading workspace...
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="p-6 space-y-8 bg-white dark:bg-slate-950 min-h-screen transition-colors">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Workspace
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your productivity overview
          </p>
        </div>

        <div className="text-xs px-3 py-1 rounded-full border 
          border-gray-200 text-gray-600
          dark:border-white/10 dark:text-gray-300">
          Focus Mode
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Tasks" value={totalTasks} />
        <StatCard title="Completed" value={completedTasks} />
        <StatCard title="Notes" value={notes.length} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* TASKS */}
        <div className="space-y-4">
          <SectionHeader title="Tasks" />

          <div className="space-y-3">
            {tasks.length === 0 && (
              <EmptyState text="No tasks yet" />
            )}

            {tasks.slice(0, 5).map((task) => (
              <div
                key={task._id}
                className="group flex items-center justify-between p-4 rounded-xl border
                bg-white border-gray-200
                hover:shadow-sm hover:bg-gray-50

                dark:bg-white/5 dark:border-white/10
                dark:hover:bg-white/10

                transition-all duration-200"
              >
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {task.title}
                </h3>

                <span
                  className={`text-xs px-2 py-1 rounded-md font-medium ${
                    task.completed
                      ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300"
                  }`}
                >
                  {task.completed ? "Done" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* NOTES */}
        <div className="space-y-4">
          <SectionHeader title="Notes" />

          <div className="space-y-3">
            {notes.length === 0 && (
              <EmptyState text="No notes yet" />
            )}

            {notes.slice(0, 5).map((note) => (
              <div
                key={note._id}
                className="p-4 rounded-xl border
                bg-white border-gray-200
                hover:shadow-sm hover:bg-gray-50

                dark:bg-white/5 dark:border-white/10
                dark:hover:bg-white/10

                transition-all duration-200"
              >
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {note.title}
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* STAT CARD */
function StatCard({ title, value }: any) {
  return (
    <div
      className="p-4 rounded-xl border
      bg-gray-50 border-gray-200
      dark:bg-white/5 dark:border-white/10

      hover:shadow-sm transition"
    >
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
        {value}
      </h2>
    </div>
  );
}

/* SECTION HEADER */
function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
      {title}
    </h2>
  );
}

/* EMPTY STATE */
function EmptyState({ text }: { text: string }) {
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {text}
    </p>
  );
}