import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Task from "@/models/Task";

export async function POST(req: Request) {
  try {
    // Connect DB if not connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Parse body
    const body = await req.json();

    // Validation
    if (!body.title || body.title.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 }
      );
    }

    // Create task
    const task = await Task.create(body);

    // Success response
    return NextResponse.json(
      {
        success: true,
        data: task,
      },
      { status: 201 }
    );

  } catch (error: any) {
    // Error response
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const tasks = await Task.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: tasks,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}