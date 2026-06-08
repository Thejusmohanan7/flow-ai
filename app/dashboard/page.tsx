import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <div className="flex justify-end">
        <UserButton />
      </div>

      <h1 className="text-4xl font-bold mt-6">
        Dashboard
      </h1>
    </div>
  );
}