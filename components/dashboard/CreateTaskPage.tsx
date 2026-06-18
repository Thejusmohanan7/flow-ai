"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Plus,
  Trash2,
  Flag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const priorities = ["Low", "Medium", "High", "Critical"];

export default function CreateTaskPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");

  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);

  const addSubtask = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks((prev) => [...prev, subtaskInput]);
    setSubtaskInput("");
  };

  const handleSubmit = async () => {
    try {
      const formattedSubtasks = subtasks.map((task) => ({
        title: task,
        completed: false,
      }));

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          status,
          dueDate,
          subtasks: formattedSubtasks,
        }),
      });

      const data = await res.json();
      console.log("✅ Task saved:", data);

      // 🔥 REDIRECT TO DASHBOARD
      router.push("/dashboard");
      router.refresh();

    } catch (error) {
      console.error("❌ Error saving task:", error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-6">Create New Task</h1>

        <div className="space-y-6">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />

          {/* Priority */}
          <div className="flex gap-2">
            {priorities.map((p) => (
              <Badge key={p} onClick={() => setPriority(p)}>
                {p}
              </Badge>
            ))}
          </div>

          {/* Subtasks */}
          <div className="flex gap-2">
            <Input
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              placeholder="Subtask"
            />
            <Button onClick={addSubtask}>
              <Plus size={16} />
            </Button>
          </div>

          {subtasks.map((task, i) => (
            <div key={i} className="flex justify-between border p-2">
              {task}
              <Trash2
                size={16}
                onClick={() =>
                  setSubtasks(subtasks.filter((_, index) => index !== i))
                }
              />
            </div>
          ))}

          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <Button onClick={handleSubmit}>
            <Flag className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      </motion.div>
    </div>
  );
}