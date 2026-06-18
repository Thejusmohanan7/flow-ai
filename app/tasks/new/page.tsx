"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Sparkles, Plus, Trash2, Flag } from "lucide-react";

const priorities = [
  { label: "Low", color: "bg-green-500" },
  { label: "Medium", color: "bg-yellow-500" },
  { label: "High", color: "bg-orange-500" },
  { label: "Critical", color: "bg-red-500" },
];

export default function CreateTaskPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");

  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const addSubtask = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks((prev) => [...prev, subtaskInput]);
    setSubtaskInput("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formattedSubtasks = subtasks.map((task) => ({
        title: task,
        completed: false,
      }));

      const payload = {
        title,
        description,
        priority,
        status,
        dueDate,
        subtasks: formattedSubtasks,
      };

      console.log("📦 Sending:", payload); // DEBUG

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // ❌ If API failed
      if (!res.ok) {
        console.error("❌ Failed:", data);
        alert("Failed to create task");
        setLoading(false);
        return;
      }

      // ✅ SUCCESS
      console.log("✅ Task saved:", data);

      // Reset form
      setTitle("");
      setDescription("");
      setSubtasks([]);
      setSubtaskInput("");

      // 👉 Redirect to dashboard
      router.push("/dashboard");

    } catch (error) {
      console.error("❌ Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Task</h1>
          <p className="text-muted-foreground mt-2">
            Organize work, deadlines and AI suggestions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">

            {/* Task Details */}
            <div className="rounded-2xl border p-6">
              <h2 className="font-semibold text-lg mb-5">Task Details</h2>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium">Task Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Design FlowAI Dashboard"
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Describe the task..."
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Priority */}
            <div className="rounded-2xl border p-6">
              <h2 className="font-semibold text-lg mb-5">Priority</h2>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {priorities.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setPriority(item.label)}
                    className={`rounded-xl border p-4 transition-all ${
                      priority === item.label
                        ? "border-blue-500 shadow-md scale-105"
                        : ""
                    }`}
                  >
                    <div
                      className={`h-3 w-3 rounded-full mx-auto mb-2 ${item.color}`}
                    />
                    <p>{item.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Subtasks */}
            <div className="rounded-2xl border p-6">
              <h2 className="font-semibold text-lg mb-5">Subtasks</h2>

              <div className="flex gap-2">
                <Input
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  placeholder="Add subtask"
                />
                <Button onClick={addSubtask}>
                  <Plus size={16} />
                </Button>
              </div>

              <div className="mt-5 space-y-3">
                {subtasks.map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between rounded-xl border p-3"
                  >
                    <span>{task}</span>

                    <button
                      onClick={() =>
                        setSubtasks(subtasks.filter((_, i) => i !== index))
                      }
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="rounded-2xl border p-6">
              <h2 className="font-semibold text-lg mb-5">Task Settings</h2>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-2 flex gap-2">
                    <Badge onClick={() => setStatus("todo")}>Todo</Badge>
                    <Badge onClick={() => setStatus("in-progress")} variant="secondary">
                      In Progress
                    </Badge>
                    <Badge onClick={() => setStatus("review")} variant="outline">
                      Review
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* AI */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                <h2 className="font-semibold">FlowAI Assistant</h2>
              </div>

              <p className="mt-3 text-sm text-blue-100">
                Get AI-powered suggestions for your task.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-4 mt-8">
          <div className="rounded-2xl border bg-background/95 backdrop-blur p-4 shadow-lg">
            <div className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>

              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Create Task"}
              </Button>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}