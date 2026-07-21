"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Circle,
  AlertCircle,
  CheckCircle2,
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

const formatTime12h = (dueTime?: string) => {
  if (!dueTime) return null;
  const [hStr, mStr] = dueTime.split(":");
  const h = Number(hStr);
  if (isNaN(h)) return null;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${mStr} ${period}`;
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

export default function CalendarView() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState(0); // -1 prev, 1 next, 0 initial

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) return;
        const data = await res.json();
        setTasks(data.data || []);
      } catch (err) {
        console.error("❌ Calendar tasks fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
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
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <AnimatePresence mode="wait">
          <motion.h2
            key={`${year}-${month}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="text-xl font-semibold font-heading text-gray-900 dark:text-white"
          >
            {MONTH_NAMES[month]} {year}
          </motion.h2>
        </AnimatePresence>

        <div className="flex items-center gap-1.5">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={goToPrevMonth}
            className="relative p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group overflow-hidden"
          >
            <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition bg-blue-500/10 blur-md" />
            <ChevronLeft size={16} className="relative z-10" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToToday}
            className="relative px-3 py-1.5 text-xs font-medium font-sans rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors overflow-hidden group"
          >
            <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition bg-blue-500/10 blur-md" />
            <span className="relative z-10">Today</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={goToNextMonth}
            className="relative p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group overflow-hidden"
          >
            <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition bg-blue-500/10 blur-md" />
            <ChevronRight size={16} className="relative z-10" />
          </motion.button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-medium font-sans text-gray-400 dark:text-gray-500 py-1"
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
              const isToday = isSameDay(date, today);
              const isSelected = selectedDate && isSameDay(date, selectedDate);

              const overdueCount = dayTasks.filter((t) => {
                if (t.status === "Done") return false;
                const due = parseDateOnly(t.dueDate);
                if (!due) return false;
                const cmp = new Date(due);
                cmp.setHours(0, 0, 0, 0);
                const todayZero = new Date();
                todayZero.setHours(0, 0, 0, 0);
                return cmp.getTime() < todayZero.getTime();
              }).length;

              const visibleTasks = dayTasks.slice(0, 3);
              const extraCount = dayTasks.length - visibleTasks.length;

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
                  className={`relative min-h-[72px] sm:min-h-[96px] flex flex-col items-start gap-1 rounded-lg border p-1.5 sm:p-2 text-left transition-colors ${
                    isSelected
                      ? "border-blue-500"
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

                  <span className="relative flex h-6 w-6 items-center justify-center">
                    {isToday && (
                      <motion.span
                        animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-blue-500"
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-mono ${
                        isToday
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                  </span>

                  <div className="flex flex-col gap-0.5 w-full">
                    {visibleTasks.map((t, i) => (
                      <motion.span
                        key={t._id}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.03 }}
                        className={`truncate text-[10px] sm:text-xs font-sans px-1 py-0.5 rounded ${
                          t.status === "Done"
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 line-through"
                            : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                        }`}
                      >
                        {t.title}
                      </motion.span>
                    ))}
                    {extraCount > 0 && (
                      <span className="text-[10px] sm:text-xs font-sans text-gray-400 dark:text-gray-500">
                        +{extraCount} more
                      </span>
                    )}
                  </div>

                  {overdueCount > 0 && (
                    <span className="mt-auto flex items-center gap-0.5 text-[10px] font-sans text-red-500">
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
          Loading tasks...
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
            className="mt-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold font-heading text-gray-900 dark:text-white">
                {selectedDate.toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </h3>
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={16} />
              </motion.button>
            </div>

            {selectedTasks.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-400 dark:text-gray-500 font-sans"
              >
                No tasks due on this day.
              </motion.p>
            ) : (
              <ul className="space-y-2">
                {selectedTasks.map((t, i) => {
                  const due = parseDateOnly(t.dueDate);
                  const todayZero = new Date();
                  todayZero.setHours(0, 0, 0, 0);
                  const dueZero = due ? new Date(due) : null;
                  if (dueZero) dueZero.setHours(0, 0, 0, 0);
                  const isOverdue =
                    t.status !== "Done" &&
                    dueZero !== null &&
                    dueZero.getTime() < todayZero.getTime();
                  const timeLabel = formatTime12h(t.dueTime);

                  return (
                    <motion.li
                      key={t._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ x: 2 }}
                      className="flex items-center justify-between gap-2 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-2 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {t.status === "Done" ? (
                          <CheckCircle2
                            size={15}
                            className="text-green-500 shrink-0"
                          />
                        ) : (
                          <Circle
                            size={15}
                            className={`shrink-0 ${
                              isOverdue ? "text-red-500" : "text-orange-400"
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
  );
}