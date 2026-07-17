"use client";

import { useMemo, useState } from "react";
import StatsCards from "./StatsCards";

type TaskType = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
};

export default function DashboardMain({ tasks }: { tasks: TaskType[] }) {
  const [taskList, setTaskList] = useState<TaskType[]>(tasks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  /* ---------------- FILTER + SEARCH ---------------- */
  const filteredTasks = useMemo(() => {
    return taskList.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());

      const matchFilter = filter === "All" ? true : t.status === filter;

      return matchSearch && matchFilter;
    });
  }, [taskList, search, filter]);

  /* ---------------- DELETE ---------------- */
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

  /* ---------------- STATUS UPDATE ---------------- */
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

  return (
    <div>
      {/* STATS */}
      <StatsCards tasks={taskList} />

      {/* SEARCH + FILTER */}
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

      {/* TASK LIST */}
      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="bg-white border p-4 rounded-xl shadow-sm"
          >
            <h2 className="text-lg font-semibold">{task.title}</h2>

            <p className="text-sm text-gray-600">{task.description}</p>

            <div className="flex gap-2 mt-2 text-xs">
              <span className="px-2 py-1 bg-gray-100 rounded">
                {task.priority}
              </span>

              <span className="px-2 py-1 bg-gray-100 rounded">
                {task.status}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-4 flex-wrap">
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
                onClick={() => deleteTask(task._id)}
                className="px-3 py-1 text-xs bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}