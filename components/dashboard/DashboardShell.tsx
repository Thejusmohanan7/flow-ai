"use client";

import { ReactNode } from "react";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-4">
        <h1 className="text-xl font-bold mb-6">Task SaaS</h1>

        <nav className="space-y-2 text-sm">
          <p className="p-2 rounded hover:bg-gray-100 cursor-pointer">
            Dashboard
          </p>
          <p className="p-2 rounded hover:bg-gray-100 cursor-pointer">
            Tasks
          </p>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b flex items-center px-6">
          <h2 className="font-semibold">Dashboard</h2>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}