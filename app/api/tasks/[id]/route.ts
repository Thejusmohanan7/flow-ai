import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";
import Task from "@/models/Task";

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

  const deleted = await Task.findOneAndDelete({ _id: id, userId });

  if (!deleted) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
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

  const existing = await Task.findOne({ _id: id, userId });
  if (!existing) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  // Stamp completedAt when status transitions TO "Done"
  if (body.status === "Done" && existing.status !== "Done") {
    body.completedAt = new Date();
  }

  // Clear completedAt when status transitions AWAY from "Done"
  if (body.status && body.status !== "Done" && existing.status === "Done") {
    body.completedAt = null;
  }

  const updated = await Task.findOneAndUpdate({ _id: id, userId }, body, {
    new: true,
  });

  return NextResponse.json({ data: updated });
}