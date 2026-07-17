"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";

import {
  Sparkles,
  Plus,
  Trash2,
  CalendarIcon,
} from "lucide-react";

const priorities = [
  { label: "Low", color: "bg-green-500" },
  { label: "Medium", color: "bg-yellow-500" },
  { label: "High", color: "bg-orange-500" },
  { label: "Critical", color: "bg-red-500" },
];

const statuses = ["Todo", "In Progress", "Done"];

export default function CreateTaskPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Todo");
  const [dueDate, setDueDate] = useState("");

  const [date, setDate] = useState<Date | undefined>();

  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const addSubtask = () => {
    const trimmed = subtaskInput.trim();
    if (!trimmed) return;
    setSubtasks((prev) => [...prev, trimmed]);
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

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create task");
        return;
      }

      setTitle("");
      setDescription("");
      setSubtasks([]);
      setSubtaskInput("");

      router.push("/dashboard");
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Create New Task
            </h1>
            <p className="text-muted-foreground mt-2">
              Organize work, deadlines and AI suggestions.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">

            {/* LEFT */}
            <div className="space-y-6 lg:col-span-2">

              {/* TASK DETAILS */}
              <div className="rounded-2xl border bg-background/60 backdrop-blur-xl p-6 shadow-sm dark:shadow-lg">
                <h2 className="font-semibold text-lg mb-5">Task Details</h2>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium">Task Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Design FlowAI Dashboard"
                      className="mt-2 bg-background border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      placeholder="Describe the task..."
                      className="mt-2 bg-background border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* PRIORITY */}
              <div className="rounded-2xl border bg-background/60 backdrop-blur-xl p-6 shadow-sm dark:shadow-lg">
                <h2 className="font-semibold text-lg mb-5">Priority</h2>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {priorities.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setPriority(item.label)}
                      className={`rounded-xl border p-4 transition-all hover:scale-105
                        ${
                          priority === item.label
                            ? "border-blue-500 bg-blue-500/10 shadow-md"
                            : "border-border hover:bg-muted"
                        }
                      `}
                    >
                      <div
                        className={`h-3 w-3 rounded-full mx-auto mb-2 ${item.color}`}
                      />
                      <p>{item.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* SUBTASKS */}
              <div className="rounded-2xl border bg-background/60 backdrop-blur-xl p-6 shadow-sm dark:shadow-lg">
                <h2 className="font-semibold text-lg mb-5">Subtasks</h2>

                <div className="flex gap-2">
                  <Input
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSubtask();
                      }
                    }}
                    placeholder="Add subtask"
                    className="bg-background border-border"
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
                      className="flex items-center justify-between rounded-xl border bg-background px-4 py-3 hover:bg-muted transition"
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

              <div className="rounded-2xl border bg-background/60 backdrop-blur-xl p-6 shadow-sm dark:shadow-lg">
                <h2 className="font-semibold text-lg mb-5">Task Settings</h2>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <div className="mt-2 flex gap-2">
                      {statuses.map((s) => (
                        <Badge
                          key={s}
                          onClick={() => setStatus(s)}
                          variant={status === s ? "default" : "outline"}
                          className="cursor-pointer"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* CALENDAR */}
                  <div>
                    <label className="text-sm font-medium">Due Date</label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="mt-2 w-full justify-start text-left font-normal bg-background border-border"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selected) => {
                            setDate(selected);
                            setDueDate(selected ? format(selected, "yyyy-MM-dd") : "");
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* AI CARD */}
              <div className="rounded-2xl border bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-6">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} />
                  <h2 className="font-semibold">FlowAI Assistant</h2>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">
                  Get AI-powered suggestions for your task.
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="sticky bottom-4 mt-8">
            <div className="rounded-2xl border bg-background/80 backdrop-blur p-4 shadow-md">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? "Saving..." : "Create Task"}
                </Button>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}