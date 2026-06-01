"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="overflow-hidden bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Top Section */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-white">
              FlowAI
            </h2>

            <p className="mt-4 max-w-full sm:max-w-md leading-relaxed text-slate-400">
              Work smarter with AI-powered productivity tools.
              Organize tasks, manage notes, gain insights, and
              stay focused with a unified workspace designed
              for modern teams and individuals.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#"
                className="rounded-full border border-slate-800 px-4 py-2 transition hover:border-slate-600 hover:text-white"
              >
                X
              </a>

              <a
                href="#"
                className="rounded-full border border-slate-800 px-4 py-2 transition hover:border-slate-600 hover:text-white"
              >
                GitHub
              </a>

              <a
                href="#"
                className="rounded-full border border-slate-800 px-4 py-2 transition hover:border-slate-600 hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white">
              Product
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <a href="#" className="transition hover:text-white">
                  Features
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Dashboard
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  AI Assistant
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white">
              Company
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <a href="#" className="transition hover:text-white">
                  About Us
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Careers
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Contact
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white">
              Resources
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <a href="#" className="transition hover:text-white">
                  Documentation
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Help Center
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Privacy Policy
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Newsletter */}
        <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h3 className="text-2xl font-bold text-white">
                Stay Updated
              </h3>

              <p className="mt-2 text-slate-400">
                Get product updates, productivity tips, and AI insights
                directly in your inbox.
              </p>
            </div>

            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-slate-700 bg-slate-950 px-5 py-3 text-white outline-none focus:border-blue-500"
              />

              <button className="rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
                Subscribe
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <div className="flex flex-col items-center gap-4 text-center lg:flex-row lg:justify-between lg:text-left">

            <p className="text-sm text-slate-500">
              © 2026 FlowAI. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="transition hover:text-white">
                Privacy
              </a>

              <a href="#" className="transition hover:text-white">
                Terms
              </a>

              <a href="#" className="transition hover:text-white">
                Cookies
              </a>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;