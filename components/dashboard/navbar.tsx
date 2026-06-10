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
  Command,
} from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { theme, setTheme } = useTheme();

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
                width={180}
                height={80}
                className="h-22 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-xl items-center justify-center">
            <div className="flex items-center gap-3 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <Search size={16} className="text-slate-500" />

              <input
                type="text"
                placeholder="Search tasks, projects..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500"
              />

              <span className="flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs text-slate-500">
                <Command size={12} />
                K
              </span>
            </div>
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
              href="/dashboard/tasks/new"
              className="sm:hidden rounded-lg bg-blue-600 p-2 text-white"
            >
              <Plus size={18} />
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <Bell size={20} />
              </button>

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
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
          {/* Mobile Search */}
          <div className="mb-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2">
              <Search size={16} className="text-slate-500" />

              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex flex-col gap-2">
            {[
              { name: "Dashboard", href: "/dashboard" },
              { name: "Tasks", href: "/dashboard/tasks" },
              { name: "Projects", href: "/dashboard/projects" },
              { name: "Analytics", href: "/dashboard/analytics" },
              { name: "Settings", href: "/dashboard/settings" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenu(false)}
                className="rounded-xl px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}