import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Task from "@/models/Task";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const task = await Task.create(body);

    return NextResponse.json(task);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}