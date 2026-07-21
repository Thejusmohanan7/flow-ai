import Navbar from "@/components/dashboard/navbar";
import Sidebar from "@/components/dashboard/sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen dark:bg-slate-950">
      
      {/* -------- SIDEBAR -------- */}
      <Sidebar />

      {/* -------- MAIN AREA -------- */}
      <div className="flex-1 flex flex-col">
        
        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="p-4 md:p-6">
          {children}
        </main>

      </div>
    </div>
  );
}