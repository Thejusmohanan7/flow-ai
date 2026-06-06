import React from "react";

const Cta: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-16">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900" />

      {/* Glow Effects */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
          Ready to Get Started?
        </span>

        {/* Heading */}
        <h2 className="mt-8 text-4xl md:text-6xl font-bold text-white leading-tight">
          Transform the Way You Work
          <span className="block text-blue-400">
            with FlowAI
          </span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-3xl text-lg text-slate-300 leading-relaxed">
          Join thousands of users who are organizing tasks,
          capturing ideas, and boosting productivity with
          AI-powered assistance. Everything you need to work
          smarter is just one click away.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="rounded-full bg-white px-8 py-4 font-semibold text-slate-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            Get Started Free
          </button>

          <button className="rounded-full border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
            Book a Demo
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-300">
          <span>✓ Free to Start</span>
          <span>✓ Secure Authentication</span>
          <span>✓ Mobile Friendly</span>
          <span>✓ AI Powered</span>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">

          <div>
            <h3 className="text-3xl font-bold text-white">
              10K+
            </h3>
            <p className="mt-2 text-slate-400">
              Active Users
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white">
              1M+
            </h3>
            <p className="mt-2 text-slate-400">
              Tasks Completed
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white">
              99.9%
            </h3>
            <p className="mt-2 text-slate-400">
              Uptime
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white">
              24/7
            </h3>
            <p className="mt-2 text-slate-400">
              AI Assistance
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Cta;