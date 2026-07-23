import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";
import Habit from "@/models/Habit";

export const runtime = "nodejs";

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
};

export async function GET() {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const habits = await Habit.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: habits });
  } catch (error: any) {
    console.error("❌ GET HABITS ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch habits" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const habit = await Habit.create({
      ...body,
      userId,
      completions: [],
      archived: false,
    });

    return NextResponse.json({ success: true, data: habit }, { status: 201 });
  } catch (error: any) {
    console.error("❌ POST HABIT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}