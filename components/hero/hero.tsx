import React from "react";
import {
  ArrowRight,
  PlayCircle,
  Sparkles,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

const Hero: React.FC = () => {
  return (
<section className="relative overflow-hidden bg-linear-to-b from-white via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">      {/* Background Blur Effects */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-purple-200/30 dark:bg-purple-500/10 blur-3xl" />
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
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
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 transition">
                Get Started Free
                <ArrowRight size={18} />
              </button>

              <button className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-7 py-3 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <PlayCircle size={18} />
                Watch Demo
              </button>
            </div>

            {/* Trust Text */}
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              Trusted by students, developers, freelancers, and founders to
              simplify their workflow and achieve more every day.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">100+</h3>
                <p className="text-sm text-gray-500">Tasks Managed</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">50+</h3>
                <p className="text-sm text-gray-500">Notes Created</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">95%</h3>
                <p className="text-sm text-gray-500">Productivity Score</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">24/7</h3>
                <p className="text-sm text-gray-500">AI Assistance</p>
              </div>
            </div>

            
          </div>

          {/* Right Side Dashboard */}
          <div className="relative">

          

            {/* Dashboard Card */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl">

              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                    FlowAI Dashboard
                </h3>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Live
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tasks</p>
                  <h3 className="text-2xl font-bold text-blue-600">128</h3>
                </div>

                <div className="rounded-xl bg-purple-50 dark:bg-purple-950/40 p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Notes</p>
                  <h3 className="text-2xl font-bold text-purple-600">74</h3>
                </div>

                <div className="rounded-xl bg-green-50 dark:bg-green-950/40 p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Score</p>
                  <h3 className="text-2xl font-bold text-green-600">92%</h3>
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Recent Tasks</h4>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Complete UI Design</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Prepare Meeting Notes</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Client Review Session</span>
                  </div>
                </div>
              </div>

              {/* AI Suggestion */}
              <div className="mt-6 rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
                <h4 className="font-semibold">AI Suggestion</h4>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  You have completed 80% of today's priorities. Focus on the
                  remaining high-priority tasks to finish your day strong.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Strip */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 border-t border-slate-200 dark:border-slate-800 pt-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <span>✓ Stay Organized</span>
          <span>✓ Save Time</span>
          <span>✓ Work Smarter</span>
          <span>✓ Boost Productivity</span>
          <span>✓ Achieve More</span>
        </div>

        {/* Scroll Indicator */}
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