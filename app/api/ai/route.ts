import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        { message: "Task title is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "AI is not configured. Missing GEMINI_API_KEY." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `You are a project management assistant. Respond with ONLY valid JSON, no markdown fences, no extra text, in exactly this shape:

{
  "description": "a clear 1-3 sentence description of the task",
  "subtasks": ["subtask 1", "subtask 2", "subtask 3"],
  "priority": "Low" | "Medium" | "High" | "Critical"
}

Task title: "${title}"
${description?.trim() ? `Existing description: "${description}"` : ""}

Suggest 3 to 6 short, actionable subtasks specific to this task, refine the description if helpful, and pick the most appropriate priority.`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("❌ Failed to parse Gemini response as JSON:", rawText);
      return NextResponse.json(
        { message: "AI returned an unexpected format" },
        { status: 502 }
      );
    }

    const validPriorities = ["Low", "Medium", "High", "Critical"];

    return NextResponse.json({
      description: typeof parsed.description === "string" ? parsed.description : "",
      subtasks: Array.isArray(parsed.subtasks) ? parsed.subtasks : [],
      priority: validPriorities.includes(parsed.priority) ? parsed.priority : null,
    });
  } catch (err: any) {
    console.error("🔥 Gemini AI error:", err?.message || err);
    return NextResponse.json(
      { message: err?.message || "AI suggestion failed" },
      { status: 500 }
    );
  }
}