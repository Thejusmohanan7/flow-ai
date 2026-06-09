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
    <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
      <div className="px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">

          {/* LEFT (LOGO HERE ONLY) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="FlowAI"
                width={150}
                height={80}
              />
            </Link>
          </div>

          {/* SEARCH */}
          <div className="hidden lg:flex items-center w-[420px]">
            <div className="flex items-center gap-3 w-full rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 bg-white/50 dark:bg-slate-900/50 focus-within:ring-2 focus-within:ring-blue-500 transition">

              <Search size={16} className="text-slate-500" />

              <input
                type="text"
                placeholder="Search tasks, projects..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500"
              />

              {/* Shortcut hint */}
              <span className="flex items-center gap-1 text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                <Command size={12} /> K
              </span>

            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 md:gap-3">

            <button className="hidden sm:flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm text-white shadow-md">
              <Plus size={16} />
              New Task
            </button>

            <div className="relative">
              <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Bell size={20} />
              </button>
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </div>

            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <UserButton/>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={clsx(
            "md:hidden overflow-hidden transition-all",
            mobileMenu ? "max-h-96 py-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2">
            {["Dashboard", "Tasks", "Projects", "Notes", "Settings"].map(
              (item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="rounded-xl px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {item}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}