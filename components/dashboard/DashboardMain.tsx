"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Pencil, X, Calendar } from "lucide-react";
import StatsCards from "./StatsCards";

type TaskType = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  subtasks?: { title: string; completed: boolean }[];
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

const getDueDateInfo = (dueDate: string, status: string) => {
  const due = parseDateOnly(dueDate);
  if (!due) return null;

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
    return { label: formatted, className: "bg-gray-100 text-gray-400" };
  }

  if (diffDays < 0) {
    return { label: `Overdue Â· ${formatted}`, className: "bg-red-500 text-white" };
  }

  if (diffDays === 0) {
    return { label: "Due Today", className: "bg-orange-500 text-white" };
  }

  if (diffDays <= 2) {
    return { label: `Due ${formatted}`, className: "bg-yellow-500 text-black" };
  }

  return { label: formatted, className: "bg-gray-100 text-gray-600" };
};

export default function DashboardMain({ tasks }: { tasks: TaskType[] }) {
  const [taskList, setTaskList] = useState<TaskType[]>(tasks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

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

  const startEdit = (task: TaskType) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEdit = async (task: TaskType) => {
    if (!editTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    const res = await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...task,
        title: editTitle.trim(),
        description: editDescription.trim(),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setTaskList((prev) =>
        prev.map((t) => (t._id === task._id ? data.data : t))
      );
      setEditingId(null);
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
          className="border p-2 rounded w-full"
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {sortedTasks.map((task) => {
            const dueDateInfo = getDueDateInfo(task.dueDate, task.status);
            const isEditing = editingId === task._id;

            return (
              <motion.div
                key={task._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className={`bg-white border p-4 rounded-xl shadow-sm transition-colors duration-300 ${
                  task.status === "Done" ? "border-green-500 bg-green-50" : ""
                }`}
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border p-2 rounded w-full text-lg font-semibold"
                      placeholder="Task title"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="border p-2 rounded w-full text-sm text-gray-600"
                      rows={2}
                      placeholder="Description"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h2
                        className={`text-lg font-semibold transition-colors ${
                          task.status === "Done" ? "line-through text-gray-400" : ""
                        }`}
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

                    <p className="text-sm text-gray-600">{task.description}</p>

                    {task.subtasks && task.subtasks.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {task.subtasks.map((sub, idx) => (
                          <li
                            key={idx}
                            className={`text-sm ${
                              sub.completed
                                ? "text-gray-400 line-through"
                                : "text-gray-600"
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
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {task.priority}
                  </span>

                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {task.status}
                  </span>

                  {dueDateInfo && (
                    <span
                      className={`px-2 py-1 rounded flex items-center gap-1 ${dueDateInfo.className}`}
                    >
                      <Calendar size={11} />
                      {dueDateInfo.label}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(task)}
                        className="px-3 py-1 text-xs bg-green-500 text-white rounded flex items-center gap-1"
                      >
                        <Check size={12} />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-xs border rounded hover:bg-gray-100 flex items-center gap-1"
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
                          className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                        >
                          {s}
                        </button>
                      ))}

                      <button
                        onClick={() => startEdit(task)}
                        className="px-2 py-1 text-xs border rounded hover:bg-gray-100 flex items-center gap-1"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>

                      <button
                        onClick={() => deleteTask(task._id)}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded"
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