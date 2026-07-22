"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  FileText,
  Bot,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/home", icon: LayoutDashboard },
    { name: "Tasks", href: "/dashboard", icon: CheckSquare },
    { name: "Workspace", href: "/workspace", icon: FolderKanban },
    { name: "Notes", href: "/notes", icon: FileText },
  ];

  const toolsItems = [
    { name: "Calendar", href: "/calendar", icon: Calendar },
  ];

  const NavItem = ({ item }: any) => {
    const Icon = item.icon;
    const active = pathname === item.href;

    return (
      <Link
        href={item.href}
        className={clsx(
          "group relative flex items-center transition-all duration-300",
          collapsed
            ? "justify-center py-3"
            : "gap-3 px-3 py-2.5",
          "rounded-xl text-sm",
          active
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
        )}
      >
        {/* Glow */}
        <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-blue-500/10 blur-lg"></span>

        <Icon
          size={20}
          className={clsx(
            "relative z-10 transition",
            "group-hover:scale-110",
            active && "scale-110"
          )}
        />

        {!collapsed && (
          <span className="font-medium relative z-10">{item.name}</span>
        )}

        {active && !collapsed && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-blue-500 rounded-r"></span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={clsx(
        "hidden md:flex flex-col border-r border-white/10",
        "bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl",
        "transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Top (ONLY toggle, perfectly aligned) */}
      <div className="flex items-center justify-end px-3 py-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mx-3" />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main */}
        <div className="space-y-2">
          {!collapsed && (
            <p className="text-xs text-slate-400 uppercase tracking-wider px-2">
              Main
            </p>
          )}
          {menuItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>

        {/* Tools */}
        <div className="space-y-2">
          {!collapsed && (
            <p className="text-xs text-slate-400 uppercase tracking-wider px-2">
              Tools
            </p>
          )}
          {toolsItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    </aside>
  );
}