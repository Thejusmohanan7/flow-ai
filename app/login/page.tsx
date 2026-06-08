"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <SignIn
        forceRedirectUrl="/dashboard"
        signUpUrl="/signup"
      />
    </div>
  );
}