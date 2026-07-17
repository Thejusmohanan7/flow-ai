import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Task from "@/models/Task";

export const runtime = "nodejs";

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
};

/* DELETE TASK */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  const deleted = await Task.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Deleted successfully" });
}

/* UPDATE TASK */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  const body = await req.json();

  const updated = await Task.findByIdAndUpdate(id, body, {
    new: true,
  });

  if (!updated) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
}