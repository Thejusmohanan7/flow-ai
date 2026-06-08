"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CheckSquare,
    FolderKanban,
    FileText,
    Bot,
    Calendar,
    Settings,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Tasks",
            href: "/tasks",
            icon: CheckSquare,
        },
        {
            name: "Projects",
            href: "/projects",
            icon: FolderKanban,
        },
        {
            name: "Notes",
            href: "/notes",
            icon: FileText,
        },
        {
            name: "AI Hub",
            href: "/ai",
            icon: Bot,
        },
        {
            name: "Calendar",
            href: "/calendar",
            icon: Calendar,
        },
        {
            name: "Settings",
            href: "/settings",
            icon: Settings,
        },
    ];

    return (
        <aside
            className={clsx(
                "hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header */}

            <div className="flex items-center justify-between px-3">

                {!collapsed ? (
                    <Link href="/dashboard" className="flex items-center gap-1">
                        <Image
                            src="/logo.png"
                            alt="FlowAI Logo"
                            width={100}
                            height={80}
                            className="h-24 w-auto object-contain" // ⬅️ tighter height
                            priority
                        />
                    </Link>
                ) : (
                    <Link href="/dashboard" className="flex items-center gap-1">
                        <Image
                            src="/logo.png"
                            alt="FlowAI Logo"
                            width={100}
                            height={80}
                            className="h-24 w-auto object-contain" // ⬅️ tighter height
                            priority
                        />
                    </Link>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="rounded-md p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>

            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 rounded-xl px-3 py-3 transition",
                                pathname === item.href
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <Icon size={20} />

                            {!collapsed && (
                                <span className="font-medium">
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Card */}
            {!collapsed && (
                <div className="m-3 rounded-2xl bg-blue-600 p-4 text-white">
                    <h3 className="font-semibold">
                        FlowAI Pro
                    </h3>

                    <p className="mt-1 text-sm text-blue-100">
                        Unlock AI-powered productivity tools.
                    </p>
                </div>
            )}
        </aside>
    );
}