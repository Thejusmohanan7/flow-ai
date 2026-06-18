import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import DashboardMain from "@/components/dashboard/DashboardMain";

export default async function DashboardPage() {
  await connectDB();

  const tasks = await Task.find().sort({ createdAt: -1 });

  return <DashboardMain tasks={JSON.parse(JSON.stringify(tasks))} />;
}