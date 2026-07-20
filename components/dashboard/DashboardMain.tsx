"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Pencil, X, Calendar, Timer, Plus, Trash2 } from "lucide-react";
import StatsCards from "./StatsCards";

type Subtask = { title: string; completed: boolean };

type TaskType = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  dueTime?: string;
  subtasks?: Subtask[];
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

const parseDueDateTime = (dueDate: string, dueTime?: string): Date | null => {
  const datePart = parseDateOnly(dueDate);
  if (!datePart || !dueTime) return null;

  const [h, m] = dueTime.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return null;

  const target = new Date(datePart);
  target.setHours(h, m, 0, 0);
  return target;
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

const isDueToday = (dueDate: string) => {
  const due = parseDateOnly(dueDate);
  if (!due) return false;
  const today = new Date();
  return (
    due.getFullYear() === today.getFullYear() &&
    due.getMonth() === today.getMonth() &&
    due.getDate() === today.getDate()
  );
};

const getDueDateInfo = (dueDate: string, dueTime: string | undefined, status: string) => {
  const due = parseDateOnly(dueDate);
  if (!due) return null;

  const timeLabel = formatTime12h(dueTime);
  const suffix = timeLabel ? ` · ${timeLabel}` : "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formatted = due.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

  if (status === "Done") {
    return {
      label: formatted + suffix,
      className: "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500",
    };
  }

  if (diffDays < 0) {
    return {
      label: `Overdue · ${formatted}${suffix}`,
      className: "bg-red-500 text-white",
    };
  }

  if (diffDays === 0) {
    return { label: `Due Today${suffix}`, className: "bg-orange-500 text-white" };
  }

  if (diffDays <= 2) {
    return { label: `Due ${formatted}${suffix}`, className: "bg-yellow-500 text-black" };
  }

  return {
    label: formatted + suffix,
    className: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
  };
};

/* ---------------- LIVE COUNTDOWN ---------------- */
function CountdownTimer({ target }: { target: Date }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500 text-white text-xs font-mono">
        <Timer size={11} />
        Overdue
      </span>
    );
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let label: string;
  if (days > 0) label = `${days}d ${hours}h left`;
  else if (hours > 0) label = `${hours}h ${minutes}m left`;
  else if (minutes > 0) label = `${minutes}m ${seconds}s left`;
  else label = `${seconds}s left`;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-mono">
      <Timer size={11} />
      {label}
    </span>
  );
}

export default function DashboardMain({ tasks }: { tasks: TaskType[] }) {
  const [taskList, setTaskList] = useState<TaskType[]>(tasks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editDueTime, setEditDueTime] = useState("");
  const [editSubtasks, setEditSubtasks] = useState<Subtask[]>([]);
  const [editSubtaskInput, setEditSubtaskInput] = useState("");

  const filteredTasks = useMemo(() => {
    return taskList.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());

      const matchFilter = filter === "All" ? true : t.status === filter;

      return matchSearch && matchFilter;
    });
  }, [taskList, search, filter]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      const aToday = isDueToday(a.dueDate) ? 0 : 1;
      const bToday = isDueToday(b.dueDate) ? 0 : 1;
      return aToday - bToday;
    });
  }, [filteredTasks]);

  const deleteTask = async (id: string) => {
    const confirmDelete = confirm("Delete this task?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setTaskList((prev) => prev.filter((t) => t._id !== id));
      alert("Task deleted successfully");
    } else {
      alert("Failed to delete task");
    }
  };

  const updateStatus = async (task: TaskType, status: string) => {
    const res = await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...task,
        status,
      }),
    });

    if (res.ok) {
      const data = await res.json();

      setTaskList((prev) =>
        prev.map((t) => (t._id === task._id ? data.data : t))
      );

      alert(`Status updated to ${status}`);
    } else {
      alert("Failed to update task");
    }
  };

  /* ---------------- INLINE EDIT ---------------- */
  const startEdit = (task: TaskType) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(task.dueDate || "");
    setEditDueTime(task.dueTime || "");
    setEditSubtasks(task.subtasks ? task.subtasks.map((s) => ({ ...s })) : []);
    setEditSubtaskInput("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditDueDate("");
    setEditDueTime("");
    setEditSubtasks([]);
    setEditSubtaskInput("");
  };

  const addEditSubtask = () => {
    const trimmed = editSubtaskInput.trim();
    if (!trimmed) return;
    setEditSubtasks((prev) => [...prev, { title: trimmed, completed: false }]);
    setEditSubtaskInput("");
  };

  const removeEditSubtask = (index: number) => {
    setEditSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEditSubtaskTitle = (index: number, value: string) => {
    setEditSubtasks((prev) =>
      prev.map((s, i) => (i === index ? { ...s, title: value } : s))
    );
  };

  const saveEdit = async (task: TaskType) => {
    if (!editTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    const cleanedSubtasks = editSubtasks
      .map((s) => ({ title: s.title.trim(), completed: s.completed }))
      .filter((s) => s.title.length > 0);

    const res = await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...task,
        title: editTitle.trim(),
        description: editDescription.trim(),
        dueDate: editDueDate,
        dueTime: editDueTime,
        subtasks: cleanedSubtasks,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setTaskList((prev) =>
        prev.map((t) => (t._id === task._id ? data.data : t))
      );
      cancelEdit();
    } else {
      alert("Failed to update task");
    }
  };

  return (
    <div>
      <StatsCards tasks={taskList} />

      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 p-2 rounded w-full font-sans"
        />

        <select
          className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded font-sans"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option className="dark:bg-gray-800">All</option>
          <option className="dark:bg-gray-800">Todo</option>
          <option className="dark:bg-gray-800">In Progress</option>
          <option className="dark:bg-gray-800">Done</option>
        </select>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {sortedTasks.map((task) => {
            const dueDateInfo = getDueDateInfo(task.dueDate, task.dueTime, task.status);
            const countdownTarget = parseDueDateTime(task.dueDate, task.dueTime);
            const isEditing = editingId === task._id;
            const titleColorClass =
              task.status === "Done"
                ? "line-through text-gray-400 dark:text-gray-500"
                : "text-gray-900 dark:text-white";

            return (
              <motion.div
                key={task._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-sm transition-colors duration-300 ${
                  task.status === "Done"
                    ? "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20"
                    : ""
                }`}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 font-sans">
                        Title
                      </label>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-2 rounded w-full text-lg font-semibold font-heading"
                        placeholder="Task title"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 font-sans">
                        Description
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-2 rounded w-full text-sm font-sans"
                        rows={2}
                        placeholder="Description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 font-sans">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          className="mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-2 rounded w-full text-sm font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 font-sans">
                          Due Time
                        </label>
                        <input
                          type="time"
                          value={editDueTime}
                          onChange={(e) => setEditDueTime(e.target.value)}
                          className="mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-2 rounded w-full text-sm font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 font-sans">
                        Subtasks
                      </label>

                      <div className="mt-1 space-y-2">
                        {editSubtasks.map((sub, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              value={sub.title}
                              onChange={(e) => updateEditSubtaskTitle(idx, e.target.value)}
                              className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-1.5 rounded text-sm font-sans"
                            />
                            <button
                              type="button"
                              onClick={() => removeEditSubtask(idx)}
                              className="text-red-500 hover:text-red-600 shrink-0"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}

                        <div className="flex items-center gap-2">
                          <input
                            value={editSubtaskInput}
                            onChange={(e) => setEditSubtaskInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addEditSubtask();
                              }
                            }}
                            placeholder="Add subtask"
                            className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-1.5 rounded text-sm font-sans"
                          />
                          <button
                            type="button"
                            onClick={addEditSubtask}
                            className="shrink-0 rounded bg-gray-900 dark:bg-gray-700 p-1.5 text-white"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h2
                        className={`text-lg font-semibold font-heading tracking-tight transition-colors ${titleColorClass}`}
                      >
                        {task.title}
                      </h2>

                      <AnimatePresence>
                        {task.status === "Done" && (
                          <motion.span
                            initial={{ scale: 0, rotate: -45, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white"
                          >
                            <Check size={12} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 font-sans">
                      {task.description}
                    </p>

                    {task.subtasks && task.subtasks.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {task.subtasks.map((sub, idx) => (
                          <li
                            key={idx}
                            className={`text-sm font-sans ${
                              sub.completed
                                ? "text-gray-400 dark:text-gray-500 line-through"
                                : "text-gray-600 dark:text-gray-300"
                            }`}
                          >
                            {sub.title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}

                <div className="flex gap-2 mt-2 text-xs flex-wrap">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded font-sans">
                    {task.priority}
                  </span>

                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded font-sans">
                    {task.status}
                  </span>

                  {dueDateInfo && (
                    <span
                      className={`px-2 py-1 rounded flex items-center gap-1 font-mono ${dueDateInfo.className}`}
                    >
                      <Calendar size={11} />
                      {dueDateInfo.label}
                    </span>
                  )}

                  {countdownTarget && task.status !== "Done" && (
                    <CountdownTimer target={countdownTarget} />
                  )}
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(task)}
                        className="px-3 py-1 text-xs bg-green-500 text-white rounded flex items-center gap-1 font-sans"
                      >
                        <Check size={12} />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-xs border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1 font-sans"
                      >
                        <X size={12} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {["Todo", "In Progress", "Done"].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(task, s)}
                          className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700 font-sans"
                        >
                          {s}
                        </button>
                      ))}

                      <button
                        onClick={() => startEdit(task)}
                        className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1 font-sans"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>

                      <button
                        onClick={() => deleteTask(task._id)}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded font-sans"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}