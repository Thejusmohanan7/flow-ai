import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Task from "@/models/Task";

export async function POST(req: Request) {
  try {
    // ✅ CHECK ENV
    console.log("MONGO URI:", process.env.MONGODB_URI);

    // ✅ CONNECT DB DIRECTLY (no external function for now)
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
      console.log("✅ DB Connected");
    }

    // ✅ PARSE BODY
    const body = await req.json();
    console.log("📦 BODY RECEIVED:", body);

    // ❗ BASIC VALIDATION
    if (!body.title) {
      throw new Error("Title is required");
    }

    // ✅ CREATE TASK
    const task = await Task.create(body);
    console.log("✅ CREATED:", task);

    return NextResponse.json(task);

  } catch (error: any) {
    console.error("❌ REAL ERROR:", error); // 👈 MUST SHOW IN TERMINAL

    return NextResponse.json(
      {
        error: error.message || "Unknown error",
        stack: error.stack, // 👈 EXTRA DEBUG
      },
      { status: 500 }
    );
  }
}