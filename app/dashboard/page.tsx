"use client";

import { useEffect, useState } from "react";
import DashboardMain from "@/components/dashboard/DashboardMain";

type TaskType = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/tasks");

      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await res.json();
      setTasks(data.data || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
        <button
          onClick={fetchTasks}
          className="block mt-3 px-3 py-1 border rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <DashboardMain
      tasks={tasks}
    />
  );
}