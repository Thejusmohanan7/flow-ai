"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, ChevronDown, Clock } from "lucide-react";

/* ---------------- DATA ---------------- */

const newHabitCategories = ["Health", "Work", "Learning", "Personal"];
const frequencies = ["daily", "weekdays", "custom"];

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

/* ---------------- CUSTOM SELECT ---------------- */

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm
        rounded-xl border border-gray-200 dark:border-white/10
        bg-white dark:bg-white/[0.05]
        text-gray-800 dark:text-gray-200
        hover:border-indigo-400/40 transition"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={16} className="opacity-60 shrink-0 ml-2" />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border 
          border-gray-200 dark:border-white/10
          bg-white dark:bg-gray-900 shadow-xl animate-in fade-in zoom-in-95"
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`px-4 py-2 text-sm cursor-pointer transition
              ${
                value === opt
                  ? "bg-indigo-500/10 text-indigo-500"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- TIME PICKER (12h + AM/PM) ---------------- */

function to12Hour(value: string) {
  if (!value) return { h: "08", m: "00", period: "AM" as "AM" | "PM" };
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

  const displayLabel = value ? `${h}:${m} ${period}` : "Select time";

  const update = (newH: string, newM: string, newPeriod: "AM" | "PM") => {
    onChange(to24Hour(newH, newM, newPeriod));
  };

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm
        rounded-xl border border-gray-200 dark:border-white/10
        bg-white dark:bg-white/[0.05]
        text-gray-800 dark:text-gray-200"
      >
        <span className="truncate">{displayLabel}</span>
        <Clock size={16} className="opacity-60 shrink-0 ml-2" />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full rounded-xl border 
          border-gray-200 dark:border-white/10
          bg-white dark:bg-gray-900 shadow-xl p-3 animate-in fade-in zoom-in-95"
        >
          <div className="grid grid-cols-3 gap-2">
            <select
              value={h}
              onChange={(e) => update(e.target.value, m, period)}
              className="w-full rounded-lg bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-100 p-2 text-sm"
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
              className="w-full rounded-lg bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-100 p-2 text-sm"
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
              className="w-full rounded-lg bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-100 p-2 text-sm"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 w-full text-xs py-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 font-medium"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- MAIN ---------------- */

export default function NewHabitPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Personal");
  const [frequency, setFrequency] = useState<"daily" | "weekdays" | "custom">(
    "daily"
  );
  const [targetPerWeek, setTargetPerWeek] = useState(3);
  const [useTargetCount, setUseTargetCount] = useState(false);
  const [targetCount, setTargetCount] = useState(1);
  const [reminderTime, setReminderTime] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Habit name is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/habits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          name: name.trim(),
          category,
          frequency,
          targetPerWeek: frequency === "custom" ? targetPerWeek : undefined,
          targetCount: useTargetCount ? targetCount : undefined,
          reminderTime: reminderTime || undefined,
        }),
      });

      if (res.ok) {
        toast.success("Habit saved successfully");
        router.push("/habits");
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        toast.error(err?.message || "Failed to create habit");
      }
    } catch (err) {
      console.error("Create habit error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          New Habit
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Build consistency with small actions
        </p>
      </div>

      {/* CARD */}
      <div className="rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur shadow-sm p-5 sm:p-6 space-y-5">
        {/* NAME */}
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400">
            Habit Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.05] px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Category
            </label>
            <div className="mt-1">
              <Select
                value={category}
                onChange={setCategory}
                options={newHabitCategories}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Frequency
            </label>
            <div className="mt-1">
              <Select
                value={frequency}
                onChange={(v) => setFrequency(v as any)}
                options={frequencies}
              />
            </div>
          </div>
        </div>

        {frequency === "custom" && (
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Times per week
            </label>
            <input
              type="number"
              min={1}
              max={7}
              value={targetPerWeek}
              onChange={(e) => setTargetPerWeek(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-white/[0.05]"
            />
          </div>
        )}

        {/* GRID */}
        <div className="grid sm:grid-cols-2 gap-4 items-start">
          <div>
            <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <input
                type="checkbox"
                checked={useTargetCount}
                onChange={(e) => setUseTargetCount(e.target.checked)}
                className="accent-indigo-500"
              />
              Track count
            </label>

            {useTargetCount && (
              <input
                type="number"
                min={1}
                value={targetCount}
                onChange={(e) => setTargetCount(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-white/[0.05]"
              />
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Reminder
            </label>
            <div className="mt-1">
              <TimePicker value={reminderTime} onChange={setReminderTime} />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <button
            onClick={submit}
            disabled={saving}
            className="w-full sm:w-auto px-5 py-2.5 text-sm rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Check size={14} />
            {saving ? "Saving..." : "Save Habit"}
          </button>

          <button
            onClick={() => router.push("/habits")}
            className="w-full sm:w-auto px-5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 flex items-center justify-center gap-2"
          >
            <X size={14} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}