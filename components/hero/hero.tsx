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
    <section className="relative overflow-hidden bg-linear-to-b from-white via-white to-slate-50">
      {/* Background Blur Effects */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-sm">
              <Sparkles className="h-4 w-4 text-blue-600" />
              AI-Powered Productivity Workspace
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Work Smarter with
              <span className="text-blue-600"> AI-Powered </span>
              Productivity
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl">
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

              <button className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-7 py-3 font-semibold text-gray-700 hover:bg-gray-100 transition">
                <PlayCircle size={18} />
                Watch Demo
              </button>
            </div>

            {/* Trust Text */}
            <p className="mt-6 text-sm text-gray-500">
              Trusted by students, developers, freelancers, and founders to
              simplify their workflow and achieve more every day.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">100+</h3>
                <p className="text-sm text-gray-500">Tasks Managed</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900">50+</h3>
                <p className="text-sm text-gray-500">Notes Created</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900">95%</h3>
                <p className="text-sm text-gray-500">Productivity Score</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900">24/7</h3>
                <p className="text-sm text-gray-500">AI Assistance</p>
              </div>
            </div>

            {/* Feature Chips */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              {[
                "Smart Tasks",
                "AI Assistant",
                "Analytics",
                "Notes",
                "Dark Mode",
                "Secure Auth",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right Side Dashboard */}
          <div className="relative">

            {/* Floating Card 1 */}
            <div className="hidden md:flex absolute -top-6 -right-6 bg-white shadow-lg rounded-xl px-4 py-3 items-center gap-3 border">
              <CheckCircle className="text-green-500" size={20} />
              <div>
                <p className="font-semibold text-sm">Task Completed</p>
                <p className="text-xs text-gray-500">Project Planning</p>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="hidden md:flex absolute bottom-10 -left-8 bg-white shadow-lg rounded-xl px-4 py-3 items-center gap-3 border">
              <Sparkles className="text-blue-500" size={20} />
              <div>
                <p className="font-semibold text-sm">AI Summary</p>
                <p className="text-xs text-gray-500">Meeting Notes Ready</p>
              </div>
            </div>

            {/* Dashboard Card */}
            <div className="rounded-3xl border bg-white p-6 shadow-2xl">

              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-semibold text-lg">
                  FlowAI Dashboard
                </h3>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Live
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-xs text-gray-500">Tasks</p>
                  <h3 className="text-2xl font-bold text-blue-600">128</h3>
                </div>

                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-xs text-gray-500">Notes</p>
                  <h3 className="text-2xl font-bold text-purple-600">74</h3>
                </div>

                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-xs text-gray-500">Score</p>
                  <h3 className="text-2xl font-bold text-green-600">92%</h3>
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Recent Tasks</h4>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm">Complete UI Design</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm">Prepare Meeting Notes</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm">Client Review Session</span>
                  </div>
                </div>
              </div>

              {/* AI Suggestion */}
              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <h4 className="font-semibold">AI Suggestion</h4>

                <p className="mt-2 text-sm text-gray-600">
                  You have completed 80% of today's priorities. Focus on the
                  remaining high-priority tasks to finish your day strong.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Strip */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 border-t pt-8 text-sm font-medium text-gray-600">
          <span>✓ Stay Organized</span>
          <span>✓ Save Time</span>
          <span>✓ Work Smarter</span>
          <span>✓ Boost Productivity</span>
          <span>✓ Achieve More</span>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 flex justify-center">
          <div className="flex flex-col items-center text-gray-400">
            <span className="text-sm">Discover Features</span>
            <ChevronDown className="animate-bounce mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;