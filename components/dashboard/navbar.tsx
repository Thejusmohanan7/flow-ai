"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  Search,
  Bell,
  Plus,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Left Section */}
          <div className="flex items-center gap-3">

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden"
            >
              {mobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex items-center gap-2 w-[400px] rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* New Task */}
            <button className="hidden sm:flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
              <Plus className="h-4 w-4" />
              New Task
            </button>

            {/* Mobile Add */}
            <button className="sm:hidden rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Plus className="h-5 w-5" />
            </button>

            {/* Notification */}
            <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <Bell className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* User */}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-4">
            <div className="flex flex-col gap-3">

              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Dashboard
              </Link>

              <Link
                href="/tasks"
                className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Tasks
              </Link>

              <Link
                href="/projects"
                className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Projects
              </Link>

              <Link
                href="/notes"
                className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Notes
              </Link>

              <Link
                href="/settings"
                className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Settings
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}