"use client";

import {
  CheckCircle2,
  FolderKanban,
  TrendingUp,
  ClipboardList,
  Sparkles,
  ArrowUpRight,
  Clock3,
} from "lucide-react";

const stats = [
  {
    title: "Total Tasks",
    value: "24",
    icon: ClipboardList,
  },
  {
    title: "Completed",
    value: "18",
    icon: CheckCircle2,
  },
  {
    title: "Projects",
    value: "6",
    icon: FolderKanban,
  },
  {
    title: "Productivity",
    value: "86%",
    icon: TrendingUp,
  },
];

const tasks = [
  "Design Dashboard UI",
  "Setup Authentication",
  "Create Project Module",
  "Deploy FlowAI",
];

const activities = [
  "Completed Dashboard Design",
  "Created Project Workspace",
  "Generated Weekly AI Report",
  "Updated Task Priority",
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome Back 👋
            </h1>
            <p className="mt-2 text-blue-100">
              You have 5 tasks pending today and 2 upcoming deadlines.
            </p>
          </div>

          <button className="rounded-xl bg-white px-5 py-3 font-medium text-blue-600 transition hover:scale-105">
            Ask FlowAI
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {item.title}
                  </p>
                  <h3 className="mt-2 text-3xl font-bold">
                    {item.value}
                  </h3>
                </div>

                <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tasks */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">
              Today's Tasks
            </h2>
            <ArrowUpRight size={18} />
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task}
                className="flex items-center gap-3 rounded-xl border p-3 dark:border-slate-700"
              >
                <input type="checkbox" />
                <span>{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant */}
        <div className="rounded-2xl border bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white shadow-sm lg:col-span-1">
          <div className="flex items-center gap-2">
            <Sparkles size={22} />
            <h2 className="font-semibold">
              FlowAI Assistant
            </h2>
          </div>

          <p className="mt-4 text-blue-100">
            What would you like help with today?
          </p>

          <div className="mt-6 space-y-3">
            <button className="w-full rounded-xl bg-white/10 px-4 py-3 text-left backdrop-blur hover:bg-white/20">
              Generate Project Plan
            </button>

            <button className="w-full rounded-xl bg-white/10 px-4 py-3 text-left backdrop-blur hover:bg-white/20">
              Create Tasks
            </button>

            <button className="w-full rounded-xl bg-white/10 px-4 py-3 text-left backdrop-blur hover:bg-white/20">
              Weekly Report
            </button>
          </div>
        </div>

        {/* Projects */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">
              Projects
            </h2>
            <FolderKanban size={18} />
          </div>

          <div className="space-y-5">
            {[
              { name: "FlowAI SaaS", progress: 80 },
              { name: "Landing Page", progress: 60 },
              { name: "Task Module", progress: 40 },
            ].map((project) => (
              <div key={project.name}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{project.name}</span>
                  <span>{project.progress}%</span>
                </div>

                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{
                      width: `${project.progress}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-5 font-semibold">
            Recent Activity
          </h2>

          <div className="space-y-4">
            {activities.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <CheckCircle2
                  size={18}
                  className="text-green-500"
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deadlines */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-5 font-semibold">
            Upcoming Deadlines
          </h2>

          <div className="space-y-4">
            {[
              "Landing Page Review",
              "Client Meeting",
              "Deploy Production Build",
            ].map((deadline) => (
              <div
                key={deadline}
                className="flex items-center gap-3 rounded-xl border p-3 dark:border-slate-700"
              >
                <Clock3 size={18} />
                <span>{deadline}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}