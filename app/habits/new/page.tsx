"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, ChevronDown, Clock } from "lucide-react";

/* ---------------- DATA ---------------- */

const newHabitCategories = ["Health", "Work", "Learning", "Personal"];
const frequencies = ["daily", "weekdays", "custom"];

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

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm
        rounded-xl border border-gray-200 dark:border-white/10
        bg-white dark:bg-white/[0.05]
        text-gray-800 dark:text-gray-200
        hover:border-indigo-400/40 transition"
      >
        {value}
        <ChevronDown size={16} className="opacity-60" />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full rounded-xl border 
          border-gray-200 dark:border-white/10
          bg-white dark:bg-gray-900 shadow-xl overflow-hidden animate-in fade-in zoom-in-95"
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

/* ---------------- TIME PICKER ---------------- */

function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];

  const [h, m] = value ? value.split(":") : ["08", "00"];

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm
        rounded-xl border border-gray-200 dark:border-white/10
        bg-white dark:bg-white/[0.05]
        text-gray-800 dark:text-gray-200"
      >
        <span>{value || "Select time"}</span>
        <Clock size={16} className="opacity-60" />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full rounded-xl border 
          border-gray-200 dark:border-white/10
          bg-white dark:bg-gray-900 shadow-xl p-3 animate-in fade-in zoom-in-95"
        >
          <div className="flex gap-2">
            <select
              value={h}
              onChange={(e) => onChange(`${e.target.value}:${m}`)}
              className="flex-1 rounded-lg bg-gray-100 dark:bg-white/10 p-2 text-sm"
            >
              {hours.map((hr) => (
                <option key={hr}>{hr}</option>
              ))}
            </select>

            <select
              value={m}
              onChange={(e) => onChange(`${h}:${e.target.value}`)}
              className="flex-1 rounded-lg bg-gray-100 dark:bg-white/10 p-2 text-sm"
            >
              {minutes.map((min) => (
                <option key={min}>{min}</option>
              ))}
            </select>
          </div>
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
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.05] px-4 py-2.5 text-sm"
          />
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Category
            </label>
            <Select
              value={category}
              onChange={setCategory}
              options={newHabitCategories}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Frequency
            </label>
            <Select
              value={frequency}
              onChange={(v) => setFrequency(v as any)}
              options={frequencies}
            />
          </div>
        </div>

        {frequency === "custom" && (
          <div>
            <input
              type="number"
              value={targetPerWeek}
              onChange={(e) => setTargetPerWeek(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm"
            />
          </div>
        )}

        {/* GRID */}
        <div className="grid sm:grid-cols-2 gap-4 items-end">
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
                value={targetCount}
                onChange={(e) => setTargetCount(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm"
              />
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Reminder
            </label>
            <TimePicker value={reminderTime} onChange={setReminderTime} />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <button
            onClick={submit}
            disabled={saving}
            className="w-full sm:w-auto px-5 py-2.5 text-sm rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center gap-2"
          >
            <Check size={14} />
            {saving ? "Saving..." : "Save Habit"}
          </button>

          <button
            onClick={() => router.push("/habits")}
            className="w-full sm:w-auto px-5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10"
          >
            <X size={14} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}