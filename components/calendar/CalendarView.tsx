"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Circle,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Users,
  Clock,
  Repeat,
  ListChecks,
} from "lucide-react";

type TaskType = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  dueTime?: string;
};

type Recurrence = "none" | "weekdays" | "monsat" | "custom";

type MeetingType = {
  _id: string;
  title: string;
  date: string; // "YYYY-MM-DD" — start date
  time?: string; // "HH:mm"
  recurrence: Recurrence;
  recurrenceDays: number[]; // 0=Sun ... 6=Sat, used when recurrence === "custom"
};

/* ---------------- DATE HELPERS ---------------- */
const parseDateOnly = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    if (y && m && d) return new Date(y, m - 1, d);
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? null : fallback;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const startOfDay = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const toDateStr = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const formatTime12h = (dueTime?: string) => {
  if (!dueTime) return null;
  const [hStr, mStr] = dueTime.split(":");
  const h = Number(hStr);
  if (isNaN(h)) return null;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${mStr} ${period}`;
};

// Does this meeting occur on the given date?
// Recurrence (weekdays / mon-sat / custom) only applies within the single
// week that contains the meeting's start date — it does not repeat into
// future weeks.
const meetingOccursOn = (meeting: MeetingType, date: Date) => {
  const start = parseDateOnly(meeting.date);
  if (!start) return false;

  if (meeting.recurrence === "none") {
    return isSameDay(date, start);
  }

  // Sunday of the start date's week, through Saturday of that same week.
  const weekStart = new Date(start);
  weekStart.setDate(start.getDate() - start.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const target = startOfDay(date).getTime();
  if (
    target < startOfDay(weekStart).getTime() ||
    target > startOfDay(weekEnd).getTime()
  ) {
    return false;
  }

  const day = date.getDay(); // 0=Sun ... 6=Sat

  switch (meeting.recurrence) {
    case "weekdays":
      return day >= 1 && day <= 5;
    case "monsat":
      return day >= 1 && day <= 6;
    case "custom":
      return meeting.recurrenceDays.includes(day);
    default:
      return isSameDay(date, start);
  }
};

const recurrenceLabel = (meeting: MeetingType) => {
  switch (meeting.recurrence) {
    case "weekdays":
      return "Mon–Fri this week";
    case "monsat":
      return "Mon–Sat this week";
    case "custom": {
      const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return (
        meeting.recurrenceDays
          .slice()
          .sort()
          .map((d) => names[d])
          .join(", ") + " this week"
      );
    }
    default:
      return null;
  }
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type DayCell = {
  date: Date;
  inCurrentMonth: boolean;
};

const buildMonthGrid = (year: number, month: number): DayCell[] => {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();

  const gridStart = new Date(year, month, 1 - startWeekday);

  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    cells.push({ date, inCurrentMonth: date.getMonth() === month });
  }
  return cells;
};

/* ---------------- CLICK OUTSIDE HOOK ---------------- */
function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutside();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);

  return ref;
}

/* ---------------- TIME PICKER (12h + AM/PM) ---------------- */
function to12Hour(value: string) {
  if (!value) return { h: "09", m: "00", period: "AM" as "AM" | "PM" };
  const [hStr, mStr] = value.split(":");
  let h = parseInt(hStr, 10);
  const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return { h: h.toString().padStart(2, "0"), m: mStr, period };
}

function to24Hour(h: string, m: string, period: "AM" | "PM") {
  let hour = parseInt(h, 10);
  if (period === "AM") {
    if (hour === 12) hour = 0;
  } else {
    if (hour !== 12) hour += 12;
  }
  return `${hour.toString().padStart(2, "0")}:${m}`;
}

function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  const hours12 = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];

  const { h, m, period } = to12Hour(value);
  const displayLabel = value ? `${h}:${m} ${period}` : "Set time";

  const update = (newH: string, newM: string, newPeriod: "AM" | "PM") => {
    onChange(to24Hour(newH, newM, newPeriod));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm rounded-md px-2.5 py-1.5 font-mono hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
      >
        <Clock size={13} className="opacity-60 shrink-0" />
        {displayLabel}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl p-3 w-48"
          >
            <div className="grid grid-cols-3 gap-2">
              <select
                value={h}
                onChange={(e) => update(e.target.value, m, period)}
                className="w-full rounded-lg bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-100 p-1.5 text-sm"
              >
                {hours12.map((hr) => (
                  <option key={hr} value={hr}>
                    {hr}
                  </option>
                ))}
              </select>

              <select
                value={m}
                onChange={(e) => update(h, e.target.value, period)}
                className="w-full rounded-lg bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-100 p-1.5 text-sm"
              >
                {minutes.map((min) => (
                  <option key={min} value={min}>
                    {min}
                  </option>
                ))}
              </select>

              <select
                value={period}
                onChange={(e) => update(h, m, e.target.value as "AM" | "PM")}
                className="w-full rounded-lg bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-100 p-1.5 text-sm"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 w-full text-xs py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- RECURRENCE SELECT ---------------- */
const recurrenceOptions: { value: Recurrence; label: string }[] = [
  { value: "none", label: "Does not repeat" },
  { value: "weekdays", label: "Weekdays (Mon–Fri)" },
  { value: "monsat", label: "Mon–Sat" },
  { value: "custom", label: "Custom days" },
];

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function RecurrenceSelect({
  value,
  onChange,
  customDays,
  onCustomDaysChange,
}: {
  value: Recurrence;
  onChange: (val: Recurrence) => void;
  customDays: number[];
  onCustomDaysChange: (days: number[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  const currentLabel =
    recurrenceOptions.find((o) => o.value === value)?.label ?? "Does not repeat";

  const toggleDay = (day: number) => {
    if (customDays.includes(day)) {
      onCustomDaysChange(customDays.filter((d) => d !== day));
    } else {
      onCustomDaysChange([...customDays, day].sort());
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm rounded-md px-2.5 py-1.5 font-sans hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
      >
        <Repeat size={13} className="opacity-60 shrink-0" />
        <span className="truncate max-w-[140px]">{currentLabel}</span>
        <ChevronDown size={13} className="opacity-60 shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
          >
            {recurrenceOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  if (opt.value !== "custom") setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-sm text-left font-sans transition-colors ${
                  value === opt.value
                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {opt.label}
              </button>
            ))}

            {value === "custom" && (
              <div className="border-t border-gray-100 dark:border-gray-800 p-3">
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2 font-sans">
                  Repeats on
                </p>
                <div className="flex gap-1">
                  {DAY_LABELS.map((label, day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`h-7 w-7 rounded-full text-xs font-medium font-sans transition-colors ${
                        customDays.includes(day)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CalendarView() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [meetings, setMeetings] = useState<MeetingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState(0); // -1 prev, 1 next, 0 initial

  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [formExpanded, setFormExpanded] = useState(false);
  const [showManageMeetings, setShowManageMeetings] = useState(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingTime, setNewMeetingTime] = useState("");
  const [newMeetingRecurrence, setNewMeetingRecurrence] = useState<Recurrence>("none");
  const [newMeetingCustomDays, setNewMeetingCustomDays] = useState<number[]>([]);
  const [savingMeeting, setSavingMeeting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, meetingRes] = await Promise.all([
          fetch("/api/tasks", { cache: "no-store" }),
          fetch("/api/meetings", { cache: "no-store" }),
        ]);
        const taskData = await taskRes.json();
        const meetingData = await meetingRes.json();
        setTasks(taskData.data || []);
        setMeetings(meetingData.data || []);
      } catch (err) {
        console.error("❌ Calendar fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = useMemo(() => new Date(), []);

  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, TaskType[]>();
    for (const task of tasks) {
      const due = parseDateOnly(task.dueDate);
      if (!due) continue;
      const key = `${due.getFullYear()}-${due.getMonth()}-${due.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(task);
    }
    return map;
  }, [tasks]);

  const getTasksForDate = (date: Date) => {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return tasksByDay.get(key) || [];
  };

  // Recurring meetings can appear on many days, so we check occurrence
  // per-date rather than grouping by exact date match.
  const getMeetingsForDate = (date: Date) =>
    meetings.filter((m) => meetingOccursOn(m, date));

  const goToPrevMonth = () => {
    setDirection(-1);
    setViewDate(new Date(year, month - 1, 1));
  };
  const goToNextMonth = () => {
    setDirection(1);
    setViewDate(new Date(year, month + 1, 1));
  };
  const goToToday = () => {
    setDirection(0);
    setViewDate(new Date());
    setSelectedDate(new Date());
  };

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const selectedMeetings = selectedDate ? getMeetingsForDate(selectedDate) : [];

  const resetMeetingForm = () => {
    setNewMeetingTitle("");
    setNewMeetingTime("");
    setNewMeetingRecurrence("none");
    setNewMeetingCustomDays([]);
  };

  const createMeeting = async () => {
    if (!selectedDate) return;
    if (!newMeetingTitle.trim()) {
      toast.error("Meeting title is required");
      return;
    }
    if (newMeetingRecurrence === "custom" && newMeetingCustomDays.length === 0) {
      toast.error("Pick at least one day for a custom recurrence");
      return;
    }

    setSavingMeeting(true);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newMeetingTitle.trim(),
          date: toDateStr(selectedDate),
          time: newMeetingTime || undefined,
          recurrence: newMeetingRecurrence,
          recurrenceDays: newMeetingCustomDays,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMeetings((prev) => [...prev, data.data]);
        toast.success("Meeting added");
        resetMeetingForm();
        setShowAddMeeting(false);
        setFormExpanded(false);
      } else {
        const err = await res.json().catch(() => null);
        toast.error(err?.message || "Failed to add meeting");
      }
    } catch (err) {
      console.error("Create meeting error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSavingMeeting(false);
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      const res = await fetch(`/api/meetings/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMeetings((prev) => prev.filter((m) => m._id !== id));
        toast.success("Meeting deleted");
      } else {
        const err = await res.json().catch(() => null);
        toast.error(err?.message || "Failed to delete meeting");
      }
    } catch (err) {
      console.error("Delete meeting error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const gridVariants = {
    enter: (dir: number) => ({
      x: dir === 0 ? 0 : dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir === 0 ? 0 : dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 sm:p-5 md:p-6 shadow-sm transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <AnimatePresence mode="wait">
            <motion.h2
              key={`${year}-${month}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="text-lg sm:text-xl font-semibold font-heading text-gray-900 dark:text-white"
            >
              {MONTH_NAMES[month]} {year}
            </motion.h2>
          </AnimatePresence>

          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={goToPrevMonth}
              aria-label="Previous month"
              className="relative p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group overflow-hidden"
            >
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition bg-blue-500/10 blur-md" />
              <ChevronLeft size={16} className="relative z-10" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToToday}
              className="relative px-3 py-1.5 text-xs font-medium font-sans rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors overflow-hidden group"
            >
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition bg-blue-500/10 blur-md" />
              <span className="relative z-10">Today</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={goToNextMonth}
              aria-label="Next month"
              className="relative p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group overflow-hidden"
            >
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition bg-blue-500/10 blur-md" />
              <ChevronRight size={16} className="relative z-10" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowManageMeetings((s) => !s)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium font-sans rounded-lg border transition-colors ${
                showManageMeetings
                  ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ListChecks size={14} />
              Manage meetings
            </motion.button>
          </div>
        </div>

        {/* Manage all meetings panel */}
        <AnimatePresence>
          {showManageMeetings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-4"
            >
              <div className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 sm:p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mb-3">
                  All meetings ({meetings.length}) — delete any duplicates or leftovers here.
                </p>

                {meetings.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-gray-500 font-sans">
                    No meetings created yet.
                  </p>
                ) : (
                  <ul className="space-y-2 max-h-72 overflow-y-auto">
                    {[...meetings]
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map((m) => {
                        const timeLabel = formatTime12h(m.time);
                        const recLabel = recurrenceLabel(m);
                        const startLabel = (() => {
                          const d = parseDateOnly(m.date);
                          return d
                            ? d.toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : m.date;
                        })();

                        return (
                          <li
                            key={m._id}
                            className="flex items-center justify-between gap-2 border border-blue-100 dark:border-blue-900/40 bg-white dark:bg-gray-800 rounded-lg px-3 py-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Users size={15} className="text-blue-500 dark:text-blue-400 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-sans truncate text-gray-900 dark:text-white">
                                  {m.title}
                                </p>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-sans">
                                  Starts {startLabel}
                                  {timeLabel ? ` · ${timeLabel}` : ""}
                                  {recLabel ? ` · ${recLabel}` : ""}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => deleteMeeting(m._id)}
                              aria-label="Delete meeting"
                              className="shrink-0 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="text-center text-[10px] sm:text-xs font-medium font-sans text-gray-400 dark:text-gray-500 py-1"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Month grid with slide transition */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={`${year}-${month}`}
              custom={direction}
              variants={gridVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="grid grid-cols-7 gap-1 sm:gap-2"
            >
              {grid.map(({ date, inCurrentMonth }, idx) => {
                const dayTasks = getTasksForDate(date);
                const dayMeetings = getMeetingsForDate(date);
                const isToday = isSameDay(date, today);
                const isSelected = selectedDate && isSameDay(date, selectedDate);

                const overdueCount = dayTasks.filter((t) => {
                  if (t.status === "Done") return false;
                  const due = parseDateOnly(t.dueDate);
                  if (!due) return false;
                  return startOfDay(due).getTime() < startOfDay(today).getTime();
                }).length;

                const combinedItems = [
                  ...dayMeetings.map((m) => ({ kind: "meeting" as const, item: m })),
                  ...dayTasks.map((t) => ({ kind: "task" as const, item: t })),
                ];
                const visibleItems = combinedItems.slice(0, 3);
                const extraCount = combinedItems.length - visibleItems.length;

                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.18, delay: Math.min(idx * 0.006, 0.15) }}
                    whileHover={{
                      y: -2,
                      boxShadow: "0 8px 20px -6px rgba(59, 130, 246, 0.25)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedDate(date)}
                    className={`relative min-h-[64px] sm:min-h-[88px] md:min-h-[96px] flex flex-col items-start gap-1 rounded-lg border p-1 sm:p-1.5 md:p-2 text-left transition-colors bg-white dark:bg-gray-800/60 ${
                      isSelected
                        ? "border-blue-500 dark:border-blue-500"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                    } ${!inCurrentMonth ? "opacity-40" : ""}`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="selected-day-highlight"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="absolute inset-0 rounded-lg bg-blue-50 dark:bg-blue-900/20 -z-10"
                      />
                    )}

                    <span className="relative flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center">
                      {isToday && (
                        <motion.span
                          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 rounded-full bg-blue-500"
                        />
                      )}
                      <span
                        className={`relative z-10 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[10px] sm:text-xs font-mono ${
                          isToday
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {date.getDate()}
                      </span>
                    </span>

                    <div className="flex flex-col gap-0.5 w-full">
                      {visibleItems.map((entry, i) =>
                        entry.kind === "meeting" ? (
                          <motion.span
                            key={`m-${entry.item._id}-${idx}`}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.03 }}
                            className="truncate text-[9px] sm:text-[10px] md:text-xs font-sans px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          >
                            {entry.item.title}
                          </motion.span>
                        ) : (
                          <motion.span
                            key={`t-${entry.item._id}`}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.03 }}
                            className={`truncate text-[9px] sm:text-[10px] md:text-xs font-sans px-1 py-0.5 rounded ${
                              entry.item.status === "Done"
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 line-through"
                                : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                            }`}
                          >
                            {entry.item.title}
                          </motion.span>
                        )
                      )}
                      {extraCount > 0 && (
                        <span className="text-[9px] sm:text-[10px] md:text-xs font-sans text-gray-400 dark:text-gray-500">
                          +{extraCount} more
                        </span>
                      )}
                    </div>

                    {overdueCount > 0 && (
                      <span className="mt-auto flex items-center gap-0.5 text-[9px] sm:text-[10px] font-sans text-red-500 dark:text-red-400">
                        <AlertCircle size={10} />
                        {overdueCount} overdue
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {loading && (
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="mt-4 text-center text-sm text-gray-400 dark:text-gray-500 font-sans"
          >
            Loading calendar...
          </motion.p>
        )}

        {/* Selected day panel */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="mt-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 sm:p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
                <h3 className="text-sm font-semibold font-heading text-gray-900 dark:text-white">
                  {selectedDate.toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setShowAddMeeting((s) => {
                        if (s) setFormExpanded(false);
                        return !s;
                      })
                    }
                    className="flex items-center gap-1 text-xs font-medium font-sans px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  >
                    <Plus size={12} />
                    Meeting
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.15, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSelectedDate(null);
                      setShowAddMeeting(false);
                      setFormExpanded(false);
                      resetMeetingForm();
                    }}
                    aria-label="Close day details"
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Quick add meeting form */}
              <AnimatePresence>
                {showAddMeeting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    onAnimationComplete={(definition: any) => {
                      // Only mark expanded once the enter animation (height -> "auto")
                      // finishes, not the exit animation (height -> 0).
                      if (definition?.height === "auto") {
                        setFormExpanded(true);
                      } else {
                        setFormExpanded(false);
                      }
                    }}
                    style={{ overflow: formExpanded ? "visible" : "hidden" }}
                    className="mb-3"
                  >
                    <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5">
                      <input
                        value={newMeetingTitle}
                        onChange={(e) => setNewMeetingTitle(e.target.value)}
                        placeholder="Meeting title"
                        className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm rounded-md px-2.5 py-1.5 font-sans"
                      />

                      <div className="flex flex-wrap items-center gap-2">
                        <TimePicker value={newMeetingTime} onChange={setNewMeetingTime} />
                        <RecurrenceSelect
                          value={newMeetingRecurrence}
                          onChange={setNewMeetingRecurrence}
                          customDays={newMeetingCustomDays}
                          onCustomDaysChange={setNewMeetingCustomDays}
                        />
                      </div>

                      <button
                        onClick={createMeeting}
                        disabled={savingMeeting}
                        className="self-start px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 font-sans"
                      >
                        {savingMeeting ? "Adding..." : "Add meeting"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedTasks.length === 0 && selectedMeetings.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-400 dark:text-gray-500 font-sans"
                >
                  Nothing scheduled on this day.
                </motion.p>
              ) : (
                <ul className="space-y-2">
                  {selectedMeetings.map((m, i) => {
                    const timeLabel = formatTime12h(m.time);
                    const recLabel = recurrenceLabel(m);
                    return (
                      <motion.li
                        key={m._id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ x: 2 }}
                        className="flex items-center justify-between gap-2 border border-blue-100 dark:border-blue-900/40 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Users size={15} className="text-blue-500 dark:text-blue-400 shrink-0" />
                          <span className="text-sm font-sans truncate text-gray-900 dark:text-white">
                            {m.title}
                          </span>
                          {timeLabel && (
                            <span className="text-xs font-mono text-gray-400 dark:text-gray-500 shrink-0">
                              {timeLabel}
                            </span>
                          )}
                          {recLabel && (
                            <span className="text-[10px] font-sans px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shrink-0">
                              {recLabel}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => deleteMeeting(m._id)}
                          aria-label="Delete meeting"
                          className="shrink-0 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.li>
                    );
                  })}

                  {selectedTasks.map((t, i) => {
                    const due = parseDateOnly(t.dueDate);
                    const dueZero = due ? startOfDay(due) : null;
                    const isOverdue =
                      t.status !== "Done" &&
                      dueZero !== null &&
                      dueZero.getTime() < startOfDay(today).getTime();
                    const timeLabel = formatTime12h(t.dueTime);

                    return (
                      <motion.li
                        key={t._id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (selectedMeetings.length + i) * 0.05 }}
                        whileHover={{ x: 2 }}
                        className="flex items-center justify-between gap-2 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {t.status === "Done" ? (
                            <CheckCircle2
                              size={15}
                              className="text-green-500 dark:text-green-400 shrink-0"
                            />
                          ) : (
                            <Circle
                              size={15}
                              className={`shrink-0 ${
                                isOverdue
                                  ? "text-red-500 dark:text-red-400"
                                  : "text-orange-400 dark:text-orange-400"
                              }`}
                            />
                          )}
                          <span
                            className={`text-sm font-sans truncate ${
                              t.status === "Done"
                                ? "line-through text-gray-400 dark:text-gray-500"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {t.title}
                          </span>
                          {timeLabel && (
                            <span className="text-xs font-mono text-gray-400 dark:text-gray-500 shrink-0">
                              {timeLabel}
                            </span>
                          )}
                        </div>

                        <span
                          className={`shrink-0 text-[10px] font-sans px-2 py-0.5 rounded-full ${
                            t.status === "Done"
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                              : isOverdue
                              ? "bg-red-500 text-white"
                              : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                          }`}
                        >
                          {t.status === "Done"
                            ? "Done"
                            : isOverdue
                            ? "Overdue"
                            : "Due"}
                        </span>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}