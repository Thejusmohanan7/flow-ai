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

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const habit = await Habit.findOne({ _id: id, userId });

    if (!habit) {
      return NextResponse.json(
        { success: false, message: "Habit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: habit });
  } catch (error: any) {
    console.error("❌ GET HABIT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch habit" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { _id, userId: bodyUserId, ...updateData } = body;

    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!habit) {
      return NextResponse.json(
        { success: false, message: "Habit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: habit });
  } catch (error: any) {
    console.error("❌ PUT HABIT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update habit" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const habit = await Habit.findOneAndDelete({ _id: id, userId });

    if (!habit) {
      return NextResponse.json(
        { success: false, message: "Habit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: habit });
  } catch (error: any) {
    console.error("❌ DELETE HABIT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete habit" },
      { status: 500 }
    );
  }
}