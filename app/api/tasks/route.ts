import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Task from "@/models/Task";

// ✅ REQUIRED for mongoose in Vercel
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // ✅ CONNECT DB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
      console.log("✅ DB Connected");
    }

    // ✅ PARSE BODY
    const body: any = await req.json();

    // ✅ VALIDATION (fixed)
    if (!body.title || body.title.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 }
      );
    }

    // ✅ CREATE TASK
    const task = await Task.create(body);

    // ✅ SUCCESS RESPONSE (FIXED)
    return NextResponse.json(
      {
        success: true,
        data: task,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("❌ REAL ERROR:", error);

    // ✅ CLEAN ERROR RESPONSE
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}