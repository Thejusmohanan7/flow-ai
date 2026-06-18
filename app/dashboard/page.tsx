"use client";

import { useEffect, useState } from "react";
import DashboardMain from "@/components/dashboard/DashboardMain";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        setTasks(data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  return <DashboardMain tasks={tasks} />;
}