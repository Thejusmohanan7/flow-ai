"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Flame, Check } from "lucide-react";
import { toast } from "sonner";

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
  status: string;
};

type Note = {
  _id: string;
  title?: string;
  content: string;
};

type Completion = {
  date: string; // "YYYY-MM-DD"
  count?: number;
  note?: string;
};

type Habit = {
  _id: string;
  name: string;
  category: string;
  frequency: "daily" | "weekdays" | "custom";
  targetCount?: number;
  completions: Completion[];
  archived?: boolean;
};

/* ---------------- HABIT HELPERS ---------------- */

const toDateStr = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const todayStr = () => toDateStr(new Date());

const isScheduledOn = (habit: Habit, dateStr: string) => {
  if (habit.frequency === "daily") return true;
  if (habit.frequency === "weekdays") {
    const day = new Date(dateStr).getDay();
    return day !== 0 && day !== 6;
  }
  return true;
};

const getCompletion = (habit: Habit, dateStr: string) =>
  habit.completions.find((c) => c.date === dateStr);

const isDone = (habit: Habit, dateStr: string) => {
  const c = getCompletion(habit, dateStr);
  if (!c) return false;
  if (habit.targetCount) return (c.count || 0) >= habit.targetCount;
  return true;
};

/* ---------------- MAIN COMPONENT ---------------- */

export default function WorkspacePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, noteRes, habitRes] = await Promise.all([
          fetch("/api/tasks", { cache: "no-store" }),
          fetch("/api/notes", { cache: "no-store" }),
          fetch("/api/habits", { cache: "no-store" }),
        ]);

        const taskData = await taskRes.json();
        const noteData = await noteRes.json();
        const habitData = await habitRes.json();

        setTasks(taskData.data || []);
        setNotes(noteData.data || []);
        setHabits(habitData.data || []);
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
    return notes.filter(
      (n) =>
        n.content.toLowerCase().includes(query.toLowerCase()) ||
        (n.title || "").toLowerCase().includes(query.toLowerCase())
    );
  }, [notes, query]);

  const filteredHabits = useMemo(() => {
    return habits
      .filter((h) => !h.archived)
      .filter((h) => h.name.toLowerCase().includes(query.toLowerCase()));
  }, [habits, query]);

  /* ---------------- STATS ---------------- */

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const totalNotes = notes.length;

  const streak = completedTasks > 0 ? 3 : 0; // UI only

  const activeHabits = habits.filter((h) => !h.archived);
  const habitsScheduledToday = activeHabits.filter((h) =>
    isScheduledOn(h, todayStr())
  );
  const habitsDoneToday = habitsScheduledToday.filter((h) =>
    isDone(h, todayStr())
  );
  const habitCompletionPct =
    habitsScheduledToday.length === 0
      ? 0
      : Math.round(
          (habitsDoneToday.length / habitsScheduledToday.length) * 100
        );

  /* ---------------- QUICK TOGGLE ---------------- */

  const toggleHabitToday = async (habit: Habit) => {
    const date = todayStr();
    const existing = getCompletion(habit, date);
    const doneNow = isDone(habit, date);

    let newCompletions: Completion[];

    if (habit.targetCount) {
      const currentCount = existing?.count || 0;
      const nextCount = doneNow ? 0 : Math.min(currentCount + 1, habit.targetCount);
      newCompletions = existing
        ? habit.completions.map((c) =>
            c.date === date ? { ...c, count: nextCount } : c
          )
        : [...habit.completions, { date, count: 1 }];
    } else {
      newCompletions = doneNow
        ? habit.completions.filter((c) => c.date !== date)
        : [...habit.completions, { date }];
    }

    try {
      const res = await fetch(`/api/habits/${habit._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...habit, completions: newCompletions }),
      });

      if (res.ok) {
        const data = await res.json();
        setHabits((prev) =>
          prev.map((h) => (h._id === habit._id ? data.data : h))
        );
        toast.success(doneNow ? "Marked as not done" : "Marked as done");
      } else {
        const err = await res.json().catch(() => null);
        toast.error(err?.message || "Failed to update habit");
      }
    } catch (err) {
      console.error("Toggle habit error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

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
        <div
          className="text-xs px-3 py-1 rounded-full 
          bg-gray-100 dark:bg-white/10 text-gray-500"
        >
          Focus Mode
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />

        <Input
          placeholder="Search tasks, notes & habits..."
          value={query}
          onChange={(e: any) => setQuery(e.target.value)}
          className="ml-10"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
            <p className="text-xs text-gray-500">Habits Today</p>
            <h2 className="text-2xl font-semibold text-indigo-500 mt-1">
              {habitsDoneToday.length}/{habitsScheduledToday.length}
            </h2>
          </CardContent>
        </Card>

        <Card className="col-span-2 sm:col-span-2 lg:col-span-1">
          <CardContent>
            <p className="text-xs text-gray-500">Daily Streak</p>
            <h2 className="text-2xl font-semibold text-orange-500 mt-1">
              {streak} days
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* ANALYTICS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500">
              Habit Consistency
            </h3>

            <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all"
                style={{ width: `${habitCompletionPct}%` }}
              />
            </div>

            <p className="text-xs text-gray-500">
              {habitsDoneToday.length} of {habitsScheduledToday.length} habits
              done today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* TASKS */}
        <div>
          <h2 className="text-lg font-semibold text-indigo-500 mb-3">
             Today's Focus
          </h2>

          <div className="space-y-3 min-h-[120px] transition-all duration-200">
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
                      task.status === "Done"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {task.status === "Done" ? "Done" : "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* NOTES */}
        <div>
          <h2 className="text-lg font-semibold text-purple-500 mb-3">
             Recent Notes
          </h2>

          <div className="space-y-3 min-h-[120px] transition-all duration-200">
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
                  hover:shadow-sm transition"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {note.title?.trim() || "Untitled note"}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* HABITS */}
        <div className="md:col-span-2 lg:col-span-1">
          <h2 className="text-lg font-semibold text-orange-500 mb-3">
             Today's Habits
          </h2>

          <div className="space-y-3 min-h-[120px] transition-all duration-200">
            {filteredHabits.length === 0 ? (
              <p className="text-sm text-gray-500">No habits found</p>
            ) : (
              filteredHabits.map((habit) => {
                const scheduledToday = isScheduledOn(habit, todayStr());
                const doneToday = isDone(habit, todayStr());
                const currentCount =
                  getCompletion(habit, todayStr())?.count || 0;

                return (
                  <div
                    key={habit._id}
                    className="p-4 rounded-xl border border-gray-200 dark:border-white/10 
                    bg-white dark:bg-white/5 
                    hover:shadow-sm transition flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm truncate">{habit.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {habit.category}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleHabitToday(habit)}
                      disabled={!scheduledToday}
                      className={`shrink-0 flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full transition ${
                        doneToday
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                      } ${
                        !scheduledToday ? "opacity-40 cursor-not-allowed" : ""
                      }`}
                    >
                      {doneToday ? (
                        <Check size={12} />
                      ) : (
                        <Flame size={12} />
                      )}
                      {habit.targetCount
                        ? `${currentCount}/${habit.targetCount}`
                        : doneToday
                        ? "Done"
                        : "Mark"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}