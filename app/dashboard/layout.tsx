import Navbar from "@/components/dashboard/navbar";
import Sidebar from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}