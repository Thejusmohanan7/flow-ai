import React from "react";

const steps = [
  {
    number: "01",
    title: "Create Your Workspace",
    description:
      "Sign up in minutes and personalize your workspace to match the way you work.",
  },
  {
    number: "02",
    title: "Manage Tasks",
    description:
      "Organize projects, prioritize work, and keep track of important deadlines.",
  },
  {
    number: "03",
    title: "Capture Notes",
    description:
      "Store ideas, meeting notes, and important information in one central place.",
  },
  {
    number: "04",
    title: "Work with AI",
    description:
      "Generate summaries, brainstorm ideas, and receive intelligent productivity suggestions.",
  },
  {
    number: "05",
    title: "Track Progress",
    description:
      "Visualize performance through analytics and understand where you can improve.",
  },
  {
    number: "06",
    title: "Achieve More",
    description:
      "Stay focused, work efficiently, and consistently reach your goals.",
  },
];

const Works: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-flex rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Productivity Workflow
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            From Planning to Productivity
          </h2>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
            FlowAI brings every stage of your workflow into a single
            intelligent workspace designed to help you stay organized,
            focused, and productive.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-24">

          {/* Center Line */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-[2px] bg-slate-200 dark:bg-slate-800" />

          <div className="grid gap-8 lg:grid-cols-6">

            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative ${
                  index % 2 === 0 ? "lg:mt-0" : "lg:mt-20"
                }`}
              >

                {/* Timeline Dot */}
                <div className="hidden lg:flex absolute -top-10 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full border-4 border-white dark:border-slate-950 bg-blue-600 dark:bg-blue-500 shadow-md" />

                {/* Card */}
                <div className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

                  <div className="text-5xl font-bold text-slate-100 dark:text-slate-800 transition-all duration-300 group-hover:text-blue-200 dark:group-hover:text-blue-400">
                    {step.number}
                  </div>

                  <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Strip */}
        <div className="mt-24 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">

          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">

            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Everything Connected in One Workflow
              </h3>

              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Tasks, notes, AI assistance, and analytics working together
                to help you stay productive every day.
              </p>
            </div>

            <button className="rounded-full bg-slate-900 dark:bg-white px-8 py-3 font-medium text-white dark:text-slate-900 transition hover:bg-slate-800 dark:hover:bg-slate-200">
              Start Your Journey
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Works;