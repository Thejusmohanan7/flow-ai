import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Task from "@/models/Task";

// ✅ Ensure Node runtime (important for Mongoose)
export const runtime = "nodejs";

/* -------------------- DB CONNECT HELPER -------------------- */
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ MongoDB Connected");
  }
};

/* -------------------- GET TASKS -------------------- */
export async function GET() {
  try {
    await connectDB();

    const tasks = await Task.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    console.error("❌ GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch tasks",
      },
      { status: 500 }
    );
  }
}

/* -------------------- CREATE TASK -------------------- */
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // ✅ Validation
    if (!body.title || body.title.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 }
      );
    }

    const task = await Task.create(body);

    return NextResponse.json(
      {
        success: true,
        data: task,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}