"use client";

import React from "react";
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      
      {/* Background Blur */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-purple-200/30 dark:bg-purple-500/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <div className="text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium shadow-sm text-slate-900 dark:text-white">
              <Sparkles className="h-4 w-4 text-blue-600" />
              AI-Powered Productivity Workspace
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Work Smarter with
              <span className="text-blue-600"> AI-Powered </span>
              Productivity
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              Manage tasks, organize notes, track performance, and get
              intelligent assistance—all from a single workspace designed to
              help you stay focused and achieve more every day.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/login">
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 transition">
                  Get Started Free
                  <ArrowRight size={18} />
                </button>
              </Link>
            </div>

            {/* Trust */}
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              Trusted by students, developers, freelancers, and founders to
              simplify their workflow.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Stat title="100+" label="Tasks Managed" />
              <Stat title="50+" label="Notes Created" />
              <Stat title="95%" label="Productivity" />
              <Stat title="24/7" label="AI Support" />
            </div>
          </div>

          {/* RIGHT SIDE (DASHBOARD) */}
          <div className="relative">

            {/* Glow */}
            <div className="absolute -inset-6 bg-blue-500/10 blur-3xl rounded-3xl"></div>

            {/* Window */}
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">

              {/* Mac Bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>

              {/* LIGHT IMAGE */}
              <Image
                src="/white.png"
                alt="Dashboard Light"
                width={1200}
                height={800}
                className="w-full h-auto block dark:hidden transition-opacity duration-500"
              />

              {/* DARK IMAGE */}
              <Image
                src="/dark.png"
                alt="Dashboard Dark"
                width={1200}
                height={800}
                className="w-full h-auto hidden dark:block transition-opacity duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 border-t border-slate-200 dark:border-slate-800 pt-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <span>✓ Stay Organized</span>
          <span>✓ Save Time</span>
          <span>✓ Work Smarter</span>
          <span>✓ Boost Productivity</span>
          <span>✓ Achieve More</span>
        </div>

        {/* Scroll */}
        <div className="mt-12 flex justify-center">
          <div className="flex flex-col items-center text-slate-400 dark:text-slate-500">
            <span className="text-sm">Discover Features</span>
            <ChevronDown className="animate-bounce mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

/* Reusable Stat Component */
const Stat = ({ title, label }: { title: string; label: string }) => (
  <div>
    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
      {title}
    </h3>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);