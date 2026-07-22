"use client";

import { useEffect, useRef, useState } from "react";
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
  ListChecks,
  StickyNote,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/home" },
  { name: "Tasks", href: "/dashboard" },
  { name: "Workspace", href: "/workspace" },
  { name: "Notes", href: "/notes" },
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

  const [desktopCreateOpen, setDesktopCreateOpen] = useState(false);
  const [mobileCreateOpen, setMobileCreateOpen] = useState(false);
  const mobileCreateRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileCreateRef.current &&
        !mobileCreateRef.current.contains(e.target as Node)
      ) {
        setMobileCreateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
      <div className="px-2 md:px-2">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center">
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
                width={100}
                height={40}
                className="h-20 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop Create */}
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setDesktopCreateOpen(true)}
              onMouseLeave={() => setDesktopCreateOpen(false)}
            >
              <button
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:scale-105"
              >
                <Plus size={16} />
                Create
                <ChevronDown
                  size={14}
                  className={clsx(
                    "transition-transform",
                    desktopCreateOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {desktopCreateOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full w-44 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg"
                  >
                    <Link
                      href="/tasks/new"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ListChecks size={15} />
                      Task
                    </Link>
                    <Link
                      href="/notes/new"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <StickyNote size={15} />
                      Note
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Create */}
            <div className="relative sm:hidden" ref={mobileCreateRef}>
              <button
                onClick={() => setMobileCreateOpen((o) => !o)}
                className="rounded-lg bg-blue-600 p-2 text-white"
              >
                <Plus size={18} />
              </button>

              <AnimatePresence>
                {mobileCreateOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg z-50"
                  >
                    <Link
                      href="/tasks/new"
                      onClick={() => setMobileCreateOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ListChecks size={15} />
                      Task
                    </Link>
                    <Link
                      href="/notes/new"
                      onClick={() => setMobileCreateOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <StickyNote size={15} />
                      Note
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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