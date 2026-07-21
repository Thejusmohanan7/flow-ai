import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";
import Note from "@/models/Note";

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

    const notes = await Note.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: notes });
  } catch (error: any) {
    console.error("❌ GET NOTES ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch notes" },
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

    const note = await Note.create({ ...body, userId });

    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error: any) {
    console.error("❌ POST NOTE ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}