import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";
import Meeting from "@/models/Meeting";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    const meetings = await Meeting.find({ userId }).sort({ date: 1, time: 1 });

    return NextResponse.json({ success: true, data: meetings });
  } catch (error: any) {
    console.error("❌ GET MEETINGS ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch meetings" },
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

    if (!body.title || body.title.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Title is required" },
        { status: 400 }
      );
    }

    if (!body.date) {
      return NextResponse.json(
        { success: false, message: "Date is required" },
        { status: 400 }
      );
    }

    const recurrence = ["none", "weekdays", "monsat", "custom"].includes(
      body.recurrence
    )
      ? body.recurrence
      : "none";

    const meeting = await Meeting.create({
      title: body.title.trim(),
      date: body.date,
      time: body.time || undefined,
      recurrence,
      recurrenceDays: recurrence === "custom" ? body.recurrenceDays || [] : [],
      userId,
    });

    return NextResponse.json({ success: true, data: meeting }, { status: 201 });
  } catch (error: any) {
    console.error("❌ POST MEETING ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}