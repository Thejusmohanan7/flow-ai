"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">

      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-8">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Sign in to continue to your workspace
            </p>
          </div>

          {/* Form */}
          <div className="mt-8 space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400">
                Email
              </label>

              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-4 py-3">
                <Mail size={18} className="text-slate-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400">
                Password
              </label>

              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-4 py-3">
                <Lock size={18} className="text-slate-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Button */}
            <button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-medium py-3 transition">
              Sign In
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs text-slate-500">OR</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Google */}
            <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                className="h-5 w-5"
                alt="google"
              />
              Continue with Google
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don’t have an account?{" "}
            <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
              Sign up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;