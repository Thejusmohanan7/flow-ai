"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Plus,
  Menu,
  X,
  Moon,
  Sun,
  AlarmClock,
} from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Tasks", href: "/tasks" },
  { name: "Projects", href: "/projects" },
  { name: "Notes", href: "/notes" },
  { name: "AI Hub", href: "/ai-hub" },
  { name: "Calendar", href: "/calendar" },
];

type TaskType = {
  status: string;
  dueDate: string;
};

const parseDateOnly = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    if (y && m && d) return new Date(y, m - 1, d);
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? null : fallback;
};

const isDueToday = (dueDate: string) => {
  const due = parseDateOnly(dueDate);
  if (!due) return false;
  const today = new Date();
  return (
    due.getFullYear() === today.getFullYear() &&
    due.getMonth() === today.getMonth() &&
    due.getDate() === today.getDate()
  );
};

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const [dueTodayCount, setDueTodayCount] = useState(0);

  useEffect(() => {
    const fetchDueToday = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) return;

        const data = await res.json();
        const tasks: TaskType[] = data.data || [];

        const count = tasks.filter(
          (t) => t.status !== "Done" && isDueToday(t.dueDate)
        ).length;

        setDueTodayCount(count);
      } catch (error) {
        console.error("❌ Navbar due-today fetch error:", error);
      }
    };

    fetchDueToday();
    const interval = setInterval(fetchDueToday, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
      <div className="px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/logo.png"
                alt="FlowAI"
                width={140}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop New Task */}
            <Link
              href="/tasks/new"
              className="hidden sm:flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:scale-105"
            >
              <Plus size={16} />
              New Task
            </Link>

            {/* Mobile New Task */}
            <Link
              href="/tasks/new"
              className="sm:hidden rounded-lg bg-blue-600 p-2 text-white"
            >
              <Plus size={18} />
            </Link>

            {/* Live "due today" indicator */}
            {dueTodayCount > 0 && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-full border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 text-xs font-medium text-orange-700 dark:text-orange-300 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900/30"
              >
                <AlarmClock size={14} />
                {dueTodayCount} due today
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* User Profile */}
            <UserButton />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={clsx(
            "md:hidden overflow-hidden transition-all duration-300",
            mobileMenu ? "max-h-96 py-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenu(false)}
                  className={clsx(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}