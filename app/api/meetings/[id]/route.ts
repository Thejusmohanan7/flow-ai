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

type Params = { params: Promise<{ id: string }> };

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

    const meeting = await Meeting.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!meeting) {
      return NextResponse.json(
        { success: false, message: "Meeting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: meeting });
  } catch (error: any) {
    console.error("❌ PUT MEETING ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update meeting" },
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

    const meeting = await Meeting.findOneAndDelete({ _id: id, userId });

    if (!meeting) {
      return NextResponse.json(
        { success: false, message: "Meeting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: meeting });
  } catch (error: any) {
    console.error("❌ DELETE MEETING ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete meeting" },
      { status: 500 }
    );
  }
}