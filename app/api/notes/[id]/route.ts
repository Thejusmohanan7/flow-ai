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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const deleted = await Note.findOneAndDelete({ _id: id, userId });

  if (!deleted) {
    return NextResponse.json({ message: "Note not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Deleted successfully" });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const updated = await Note.findOneAndUpdate({ _id: id, userId }, body, {
    new: true,
  });

  if (!updated) {
    return NextResponse.json({ message: "Note not found" }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
}