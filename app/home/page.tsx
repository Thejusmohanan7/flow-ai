"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

/* ---------------- UI FALLBACK COMPONENTS ---------------- */

function Card({ children, className = "" }: any) {
  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-white/10 
      bg-white dark:bg-white/5 ${className}`}
    >
      {children}
    </div>
  );
}

function CardContent({ children, className = "" }: any) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

function Input(props: any) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-gray-200 dark:border-white/10 
      bg-white dark:bg-white/5 px-3 py-2 text-sm outline-none 
      focus:ring-2 focus:ring-gray-300 dark:focus:ring-white/20"
    />
  );
}

/* ---------------- TYPES ---------------- */

type Task = {
  _id: string;
  title: string;
  completed?: boolean;
};

type Note = {
  _id: string;
  content: string;
};

/* ---------------- MAIN COMPONENT ---------------- */

export default function WorkspacePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, noteRes] = await Promise.all([
          fetch("/api/tasks"),
          fetch("/api/notes"),
        ]);

        const taskData = await taskRes.json();
        const noteData = await noteRes.json();

        setTasks(taskData.data || []);
        setNotes(noteData.data || []);
      } catch (err) {
        console.error("Workspace fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------------- SEARCH ---------------- */

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) =>
      t.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [tasks, query]);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) =>
      n.content.toLowerCase().includes(query.toLowerCase())
    );
  }, [notes, query]);

  /* ---------------- STATS ---------------- */

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalNotes = notes.length;

  const streak = completedTasks > 0 ? 3 : 0; // UI only

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        Loading workspace...
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight 
            bg-gradient-to-r from-indigo-500 to-purple-500 
            bg-clip-text text-transparent"
          >
            Workspace
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your productivity hub ⚡
          </p>
        </div>

        <div
          className="text-xs px-3 py-1 rounded-full 
          bg-gray-100 dark:bg-white/10 text-gray-500"
        >
          Focus Mode
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

        <Input
          placeholder="Search tasks & notes..."
          value={query}
          onChange={(e: any) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <p className="text-xs text-gray-500">Total Tasks</p>
            <h2 className="text-2xl font-semibold mt-1">{totalTasks}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-xs text-gray-500">Completed</p>
            <h2 className="text-2xl font-semibold text-green-500 mt-1">
              {completedTasks}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-xs text-gray-500">Notes</p>
            <h2 className="text-2xl font-semibold text-purple-500 mt-1">
              {totalNotes}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-xs text-gray-500">Daily Streak 🔥</p>
            <h2 className="text-2xl font-semibold text-orange-500 mt-1">
              {streak} days
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* ANALYTICS */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500">
              Task Completion
            </h3>

            <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all"
                style={{
                  width:
                    totalTasks === 0
                      ? "0%"
                      : `${(completedTasks / totalTasks) * 100}%`,
                }}
              />
            </div>

            <p className="text-xs text-gray-500">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500">
              Notes Activity
            </h3>

            <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all"
                style={{
                  width: `${Math.min(totalNotes * 10, 100)}%`,
                }}
              />
            </div>

            <p className="text-xs text-gray-500">
              {totalNotes} notes created
            </p>
          </CardContent>
        </Card>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* TASKS */}
        <div>
          <h2 className="text-lg font-semibold text-indigo-500 mb-3">
            🔥 Today’s Focus
          </h2>

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <p className="text-sm text-gray-500">
                No tasks found
              </p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-white/10 
                  bg-white dark:bg-white/5 
                  hover:shadow-sm transition flex justify-between"
                >
                  <span className="text-sm">{task.title}</span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      task.completed
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {task.completed ? "Done" : "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* NOTES */}
        <div>
          <h2 className="text-lg font-semibold text-purple-500 mb-3">
            📝 Recent Notes
          </h2>

          <div className="space-y-3">
            {filteredNotes.length === 0 ? (
              <p className="text-sm text-gray-500">
                No notes found
              </p>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note._id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-white/10 
                  bg-white dark:bg-white/5 
                  hover:shadow-sm transition text-sm text-gray-600 dark:text-gray-300"
                >
                  {note.content}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}