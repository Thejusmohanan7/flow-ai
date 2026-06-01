"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const navLinks = [
    {
      label: "Features",
      href: "#features",
    },
    {
      label: "Workflow",
      href: "#workflow",
    },
    {
      label: "Testimonials",
      href: "#testimonials",
    },
    {
      label: "FAQ",
      href: "#faq",
    },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-sm border-b"
          : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <a href="#" className="flex items-center">
            <Image
              src="/logo.png"
              alt="FlowAI Logo"
              width={180}
              height={80}
              className="h-20 md:h-24 w-auto object-contain"
              priority
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">

            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="rounded-full border border-blue-500 px-5 py-2 font-medium text-blue-500 transition hover:bg-blue-500 hover:text-white">
              Login
            </button>

            <button className="rounded-full bg-blue-600 px-5 py-2 font-medium text-white shadow-md transition hover:bg-blue-700 hover:scale-105">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden"
          >
            {mobileMenu ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>

        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden border-t py-4">

            <div className="flex flex-col gap-5">

              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenu(false)}
                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600"
                >
                  {link.label}
                </a>
              ))}

              {/* Theme Toggle */}
              <button
                onClick={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
                className="flex items-center gap-2 text-left"
              >
                {theme === "dark" ? (
                  <>
                    <Sun size={18} />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon size={18} />
                    Dark Mode
                  </>
                )}
              </button>

              <button className="rounded-full border border-blue-500 py-2 font-medium text-blue-500 transition hover:bg-blue-500 hover:text-white">
                Login
              </button>

              <button className="rounded-full bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700">
                Sign Up
              </button>

            </div>

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;