export const dynamic = "force-dynamic";

import DashboardMain from "@/components/dashboard/DashboardMain";

export default async function DashboardPage() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch tasks");
    }

    return <DashboardMain tasks={data.data} />;
  } catch (error) {
    console.error("Dashboard Error:", error);

    return (
      <div className="p-6 text-red-500">
        Failed to load dashboard. Please try again.
      </div>
    );
  }
}