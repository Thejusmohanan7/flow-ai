"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import {
  Check,
  Flame,
  Trophy,
  Trash2,
  Archive,
  ArchiveRestore,
  Bell,
  StickyNote,
  Plus,
  X,
} from "lucide-react";

type Completion = {
  date: string; // "YYYY-MM-DD"
  count?: number;
  note?: string;
};

type HabitType = {
  _id: string;
  name: string;
  category: string;
  color?: string;
  frequency: "daily" | "weekdays" | "custom";
  targetPerWeek?: number; // used when frequency === "custom"
  targetCount?: number; // e.g. drink water 8x/day
  reminderTime?: string;
  startDate?: string; // "YYYY-MM-DD" — when tracking begins
  completions: Completion[];
  archived?: boolean;
  createdAt: string;
};

const categories = ["All", "Health", "Work", "Learning", "Personal"];
const milestones = [100, 30, 7]; // checked highest-first

/* ---------------- DATE HELPERS ---------------- */
const toDateStr = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const todayStr = () => toDateStr(new Date());

const formatDateLabel = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const formatReminderTime = (value?: string) => {
  if (!value) return null;
  const [hStr, mStr] = value.split(":");
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return value;
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2, "0")}:${mStr} ${period}`;
};

const lastNDays = (n: number) => {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(toDateStr(d));
  }
  return days;
};

const isScheduledOn = (habit: HabitType, dateStr: string) => {
  if (habit.startDate && dateStr < habit.startDate) return false;
  if (habit.frequency === "daily") return true;
  if (habit.frequency === "weekdays") {
    const day = new Date(dateStr).getDay();
    return day !== 0 && day !== 6;
  }
  return true; // custom (X times/week) — any day is eligible
};

/* ---------------- COMPLETION HELPERS ---------------- */
const getCompletion = (habit: HabitType, dateStr: string) =>
  habit.completions.find((c) => c.date === dateStr);

const isDone = (habit: HabitType, dateStr: string) => {
  const c = getCompletion(habit, dateStr);
  if (!c) return false;
  if (habit.targetCount) return (c.count || 0) >= habit.targetCount;
  return true;
};

/* ---------------- STREAK CALCULATION ---------------- */
const computeStreaks = (habit: HabitType) => {
  const sortedDates = [...habit.completions]
    .filter((c) => isDone(habit, c.date))
    .map((c) => c.date)
    .sort();

  if (sortedDates.length === 0) return { current: 0, longest: 0 };

  const doneSet = new Set(sortedDates);

  let longest = 0;
  let run = 0;
  const first = new Date(sortedDates[0]);
  const last = new Date();
  const cursor = new Date(first);

  while (cursor <= last) {
    const dStr = toDateStr(cursor);
    if (isScheduledOn(habit, dStr)) {
      if (doneSet.has(dStr)) {
        run += 1;
        longest = Math.max(longest, run);
      } else {
        run = 0;
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  let current = 0;
  const back = new Date();
  while (true) {
    const dStr = toDateStr(back);
    if (isScheduledOn(habit, dStr)) {
      if (doneSet.has(dStr)) {
        current += 1;
      } else if (dStr === todayStr()) {
        // today not done yet doesn't break the streak — just isn't counted
      } else {
        break;
      }
    }
    back.setDate(back.getDate() - 1);
    if (back < first) break;
  }

  return { current, longest };
};

const completionRate = (habit: HabitType, days: number) => {
  const range = lastNDays(days);
  const scheduledDays = range.filter((d) => isScheduledOn(habit, d));
  if (scheduledDays.length === 0) return 0;
  const doneDays = scheduledDays.filter((d) => isDone(habit, d));
  return Math.round((doneDays.length / scheduledDays.length) * 100);
};

const highestMilestoneHit = (streak: number) =>
  milestones.find((m) => streak >= m) || null;

/* ---------------- HEATMAP ---------------- */
function Heatmap({ habit }: { habit: HabitType }) {
  const days = lastNDays(35);

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((d) => {
        const scheduled = isScheduledOn(habit, d);
        const done = isDone(habit, d);
        const isToday = d === todayStr();

        let cellClass = "bg-gray-100 dark:bg-gray-700"; // unscheduled / empty
        if (scheduled && done) {
          cellClass = "bg-green-500 dark:bg-green-500";
        } else if (scheduled && !done && d < todayStr()) {
          cellClass = "bg-red-100 dark:bg-red-900/40";
        }

        return (
          <div
            key={d}
            title={d}
            className={`h-3 w-3 rounded-sm ${cellClass} ${
              isToday ? "ring-1 ring-blue-500" : ""
            }`}
          />
        );
      })}
    </div>
  );
}

/* ---------------- WEEKLY SUMMARY ---------------- */
function WeeklySummary({ habits }: { habits: HabitType[] }) {
  const active = habits.filter((h) => !h.archived);
  const week = lastNDays(7);

  let scheduled = 0;
  let done = 0;

  active.forEach((h) => {
    week.forEach((d) => {
      if (isScheduledOn(h, d)) {
        scheduled += 1;
        if (isDone(h, d)) done += 1;
      }
    });
  });

  const pct = scheduled > 0 ? Math.round((done / scheduled) * 100) : 0;

  return (
    <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 font-sans">
            This week
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white font-heading">
            {done}/{scheduled}{" "}
            <span className="text-base font-normal text-gray-500 dark:text-gray-400">
              habits completed
            </span>
          </p>
        </div>
        <div className="text-3xl font-bold text-green-500 font-heading">{pct}%</div>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
        <div
          className="h-2 rounded-full bg-green-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function Habits({ habits }: { habits: HabitType[] }) {
  const [habitList, setHabitList] = useState<HabitType[]>(habits);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showArchived, setShowArchived] = useState(false);
  const [noteDraftId, setNoteDraftId] = useState<string | null>(null);
  const [noteDraftText, setNoteDraftText] = useState("");

  const filteredHabits = useMemo(() => {
    return habitList.filter((h) => {
      const matchCategory = categoryFilter === "All" || h.category === categoryFilter;
      const matchArchived = showArchived ? true : !h.archived;
      return matchCategory && matchArchived;
    });
  }, [habitList, categoryFilter, showArchived]);

  const toggleToday = async (habit: HabitType, note?: string) => {
    const date = todayStr();
    const existing = getCompletion(habit, date);
    const doneNow = isDone(habit, date);

    let newCompletions: Completion[];

    if (habit.targetCount) {
      const currentCount = existing?.count || 0;
      const nextCount = doneNow ? 0 : Math.min(currentCount + 1, habit.targetCount);
      newCompletions = existing
        ? habit.completions.map((c) =>
            c.date === date ? { ...c, count: nextCount, note: note ?? c.note } : c
          )
        : [...habit.completions, { date, count: 1, note }];
    } else {
      newCompletions = doneNow
        ? habit.completions.filter((c) => c.date !== date)
        : [...habit.completions, { date, note }];
    }

    try {
      const res = await fetch(`/api/habits/${habit._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...habit, completions: newCompletions }),
      });

      if (res.ok) {
        const data = await res.json();
        setHabitList((prev) => prev.map((h) => (h._id === habit._id ? data.data : h)));
        toast.success(
          habit.targetCount
            ? "Progress updated"
            : doneNow
            ? "Marked as not done"
            : "Marked as done"
        );
      } else {
        const err = await res.json().catch(() => null);
        toast.error(err?.message || "Failed to update habit");
      }
    } catch (error) {
      console.error("Toggle habit error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const toggleArchive = async (habit: HabitType) => {
    try {
      const res = await fetch(`/api/habits/${habit._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...habit, archived: !habit.archived }),
      });

      if (res.ok) {
        const data = await res.json();
        setHabitList((prev) => prev.map((h) => (h._id === habit._id ? data.data : h)));
        toast.success(habit.archived ? "Habit unarchived" : "Habit archived");
      } else {
        const err = await res.json().catch(() => null);
        toast.error(err?.message || "Failed to update habit");
      }
    } catch (error) {
      console.error("Toggle archive error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const deleteHabit = async (id: string) => {
    if (!confirm("Delete this habit? This removes its full history.")) return;

    try {
      const res = await fetch(`/api/habits/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHabitList((prev) => prev.filter((h) => h._id !== id));
        toast.success("Habit deleted");
      } else {
        const err = await res.json().catch(() => null);
        toast.error(err?.message || "Failed to delete habit");
      }
    } catch (error) {
      console.error("Delete habit error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const saveNote = (habit: HabitType) => {
    toggleToday(habit, noteDraftText.trim() || undefined);
    setNoteDraftId(null);
    setNoteDraftText("");
  };

  return (
    <div>
      <WeeklySummary habits={habitList} />

      <div className="flex gap-3 mb-6 flex-wrap items-center justify-between">
        <div className="flex gap-3 flex-wrap items-center">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded font-sans"
          >
            {categories.map((c) => (
              <option key={c} className="dark:bg-gray-800">
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowArchived((s) => !s)}
            className="flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-600 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-sans"
          >
            {showArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
            {showArchived ? "Hide archived" : "Show archived"}
          </button>
        </div>

        <Link
          href="/habits/new"
          className="flex items-center gap-1 rounded-full bg-gray-900 dark:bg-white px-4 py-2 text-xs font-medium text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 font-sans"
        >
          <Plus size={14} />
          New habit
        </Link>
      </div>

      {filteredHabits.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
            No habits yet. Create your first one to start tracking streaks.
          </p>
          <Link
            href="/habits/new"
            className="mt-4 inline-flex items-center gap-1 rounded-full bg-gray-900 dark:bg-white px-4 py-2 text-xs font-medium text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 font-sans"
          >
            <Plus size={14} />
            New habit
          </Link>
        </div>
      )}

      <div className="grid gap-4">
        <AnimatePresence>
          {filteredHabits.map((habit) => {
            const { current, longest } = computeStreaks(habit);
            const rate7 = completionRate(habit, 7);
            const rate30 = completionRate(habit, 30);
            const milestone = highestMilestoneHit(current);
            const doneToday = isDone(habit, todayStr());
            const scheduledToday = isScheduledOn(habit, todayStr());
            const atRisk = scheduledToday && !doneToday && current > 0;
            const addingNote = noteDraftId === habit._id;

            return (
              <motion.div
                key={habit._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-sm ${
                  habit.archived ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-semibold font-heading text-gray-900 dark:text-white truncate">
                        {habit.name}
                      </h2>

                      <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-sans">
                        {habit.category}
                      </span>

                      {habit.startDate && habit.startDate > todayStr() && (
                        <span className="px-2 py-0.5 text-xs rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-sans">
                          Starts {formatDateLabel(habit.startDate)}
                        </span>
                      )}

                      {milestone && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-sans">
                          <Trophy size={11} />
                          {milestone}-day streak
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex gap-2 flex-wrap text-xs">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 font-mono">
                        <Flame size={11} />
                        {current} current
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono">
                        <Trophy size={11} />
                        {longest} best
                      </span>
                      <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono">
                        7d: {rate7}%
                      </span>
                      <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono">
                        30d: {rate30}%
                      </span>
                      {habit.reminderTime && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono">
                          <Bell size={11} />
                          {formatReminderTime(habit.reminderTime)}
                        </span>
                      )}
                    </div>

                    {atRisk && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400 font-sans">
                        Complete today to keep your {current}-day streak.
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => toggleArchive(habit)}
                      className="rounded-full p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      aria-label={habit.archived ? "Unarchive habit" : "Archive habit"}
                    >
                      {habit.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                    </button>
                    <button
                      onClick={() => deleteHabit(habit._id)}
                      className="rounded-full p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                      aria-label="Delete habit"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <Heatmap habit={habit} />
                </div>

                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => toggleToday(habit)}
                    disabled={!scheduledToday}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium font-sans transition-colors ${
                      doneToday
                        ? "bg-green-500 text-white"
                        : "border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    } ${!scheduledToday ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <Check size={13} />
                    {habit.targetCount
                      ? `${getCompletion(habit, todayStr())?.count || 0}/${habit.targetCount} today`
                      : doneToday
                      ? "Done today"
                      : "Mark done"}
                  </button>

                  <button
                    onClick={() => {
                      setNoteDraftId(addingNote ? null : habit._id);
                      setNoteDraftText("");
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-sans"
                  >
                    <StickyNote size={13} />
                    Add note
                  </button>
                </div>

                {addingNote && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      value={noteDraftText}
                      onChange={(e) => setNoteDraftText(e.target.value)}
                      placeholder="e.g. ran 5k, felt great"
                      className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-1.5 rounded text-sm font-sans"
                    />
                    <button
                      onClick={() => saveNote(habit)}
                      className="px-2 py-1.5 rounded bg-gray-900 dark:bg-gray-700 text-white"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setNoteDraftId(null)}
                      className="px-2 py-1.5 rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {getCompletion(habit, todayStr())?.note && !addingNote && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic font-sans">
                    "{getCompletion(habit, todayStr())?.note}"
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}