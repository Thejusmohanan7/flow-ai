"use client";

import { useEffect, useState } from "react";

export default function TaskTable() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  if (tasks.length === 0) {
    return <p>No tasks yet 🚀</p>;
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      {tasks.map((task) => (
        <div key={task._id} className="border-b py-3">
          <p className="font-bold">{task.title}</p>
          <p className="text-sm text-gray-500">{task.description}</p>
        </div>
      ))}
    </div>
  );
}