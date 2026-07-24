import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Habit from "@/models/Habit";
import Habits from "@/components/habits/habits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
};

export default async function HabitsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  await connectDB();

  const habits = await Habit.find({ userId }).sort({ createdAt: -1 });

  // Convert Mongoose documents to plain objects for the client component
  const serializedHabits = JSON.parse(JSON.stringify(habits));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold font-heading text-gray-900 dark:text-white mb-6">
        Habits
      </h1>
      <Habits habits={serializedHabits} />
    </div>
  );
}