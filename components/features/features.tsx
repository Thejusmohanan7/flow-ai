"use client";

import React from "react";
import {
  CheckSquare,
  NotebookPen,
  Brain,
  BarChart3,
  ShieldCheck,
  Moon,
} from "lucide-react";

const features = [
  {
    icon: <CheckSquare className="h-8 w-8 text-blue-600" />,
    title: "Smart Task Management",
    description:
      "Create, organize, prioritize, and track tasks effortlessly. Stay focused on what matters most with intelligent task organization.",
  },
  {
    icon: <NotebookPen className="h-8 w-8 text-purple-600" />,
    title: "Intelligent Notes",
    description:
      "Capture ideas, meeting summaries, research, and documentation in one centralized workspace.",
  },
  {
    icon: <Brain className="h-8 w-8 text-green-600" />,
    title: "AI Assistant",
    description:
      "Generate summaries, brainstorm ideas, create meeting notes, and receive personalized productivity suggestions instantly.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
    title: "Productivity Analytics",
    description:
      "Monitor progress, visualize performance trends, and gain valuable insights that help improve productivity.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-red-600" />,
    title: "Secure Authentication",
    description:
      "Protect your workspace with secure authentication and seamless account management.",
  },
  {
    icon: <Moon className="h-8 w-8 text-indigo-600" />,
    title: "Dark Mode Experience",
    description:
      "Work comfortably day or night with a beautifully designed dark mode interface.",
  },
];

const Features: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium">
            ✨ Powerful Features
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
            Everything You Need to Stay Productive
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            FlowAI combines powerful productivity tools and intelligent AI
            assistance into a single workspace, helping you organize work,
            save time, and achieve more every day.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-3xl border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-6 inline-flex rounded-2xl bg-slate-50 p-4">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>

              <p className="mt-4 text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t pt-12">

          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-600">100+</h3>
            <p className="mt-2 text-gray-600">Tasks Managed</p>
          </div>

          <div className="text-center">
            <h3 className="text-3xl font-bold text-purple-600">50+</h3>
            <p className="mt-2 text-gray-600">Notes Created</p>
          </div>

          <div className="text-center">
            <h3 className="text-3xl font-bold text-green-600">95%</h3>
            <p className="mt-2 text-gray-600">Productivity Score</p>
          </div>

          <div className="text-center">
            <h3 className="text-3xl font-bold text-orange-600">24/7</h3>
            <p className="mt-2 text-gray-600">AI Assistance</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;