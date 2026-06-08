import Navbar from "@/components/dashboard/navbar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      <main className="p-6">
        <h1 className="text-3xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Here's your productivity overview.
        </p>
      </main>
    </div>
  );
}