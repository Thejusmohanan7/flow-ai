export const dynamic = "force-dynamic";

import DashboardMain from "@/components/dashboard/DashboardMain";

export default async function DashboardPage() {
  try {
    const res = await fetch("https://flow-ai.vercel.app/api/tasks", {
      cache: "no-store",
    });

    const data = await res.json();

    return <DashboardMain tasks={data.data || []} />;
  } catch (error) {
    return <div>Failed to load</div>;
  }
}