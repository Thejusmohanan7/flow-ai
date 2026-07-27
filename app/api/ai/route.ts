import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const REQUEST_TIMEOUT_MS = 20000;

const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), ms)
    ),
  ]);
};

export async function POST(req: Request) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid request. Please try again." },
        { status: 400 }
      );
    }

    const { title, description } = body || {};

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { message: "Task title is required" },
        { status: 400 }
      );
    }

    if (title.trim().length > MAX_TITLE_LENGTH) {
      return NextResponse.json(
        {
          message: `Title is too long (max ${MAX_TITLE_LENGTH} characters). Try shortening it.`,
        },
        { status: 400 }
      );
    }

    if (
      typeof description === "string" &&
      description.length > MAX_DESCRIPTION_LENGTH
    ) {
      return NextResponse.json(
        {
          message: `Description is too long (max ${MAX_DESCRIPTION_LENGTH} characters).`,
        },
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
  "isValidTask": true | false,
  "reason": "short explanation if isValidTask is false, otherwise empty string",
  "description": "a clear 1-3 sentence description of the task",
  "subtasks": ["subtask 1", "subtask 2", "subtask 3"],
  "priority": "Low" | "Medium" | "High" | "Critical"
}

Task title: "${title.trim()}"
${description?.trim() ? `Existing description: "${description.trim()}"` : ""}

First, decide whether the title actually describes an actionable task someone could work on and complete — for example "Fix login bug", "Prepare quarterly report", "Book flights for conference". 

Set "isValidTask" to false (and leave "description" empty, "subtasks" as an empty array, "priority" as null) if the title is instead:
- A greeting or filler phrase ("hi", "hello", "test", "asdf", "hey there")
- A single vague word with no actionable meaning ("thing", "stuff", "misc")
- Gibberish, random characters, or clearly not a real task
- Too short or ambiguous to determine any real action (fewer than 2 meaningful words with no clear verb or object)

If "isValidTask" is true, suggest 3 to 6 short, actionable subtasks specific to this task, refine the description if helpful, and pick the most appropriate priority.`;

    let result;
    try {
      result = await withTimeout(model.generateContent(prompt), REQUEST_TIMEOUT_MS);
    } catch (genError: any) {
      if (genError?.message === "TIMEOUT") {
        console.error("⏱️ Gemini request timed out");
        return NextResponse.json(
          { message: "AI is taking too long to respond. Please try again." },
          { status: 504 }
        );
      }

      const errMsg = String(genError?.message || genError || "");

      if (errMsg.includes("429") || errMsg.toLowerCase().includes("rate limit")) {
        console.error("🚦 Gemini rate limit hit:", errMsg);
        return NextResponse.json(
          { message: "AI is receiving too many requests right now. Please try again in a moment." },
          { status: 429 }
        );
      }

      if (
        errMsg.includes("401") ||
        errMsg.includes("403") ||
        errMsg.toLowerCase().includes("api key")
      ) {
        console.error("🔑 Gemini auth error:", errMsg);
        return NextResponse.json(
          { message: "AI configuration issue. Please contact support." },
          { status: 500 }
        );
      }

      console.error("🔥 Gemini generation error:", errMsg);
      return NextResponse.json(
        { message: "AI suggestion failed. Please try again." },
        { status: 502 }
      );
    }

    let rawText: string;
    try {
      rawText = result.response.text();
    } catch (textError) {
      console.error("❌ Failed to read Gemini response text:", textError);
      return NextResponse.json(
        { message: "AI returned an unreadable response. Please try again." },
        { status: 502 }
      );
    }

    if (!rawText || !rawText.trim()) {
      console.error("❌ Gemini returned an empty response");
      return NextResponse.json(
        { message: "AI returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("❌ Failed to parse Gemini response as JSON:", rawText);
      return NextResponse.json(
        { message: "AI returned an unexpected format. Please try again." },
        { status: 502 }
      );
    }

    if (!parsed || typeof parsed !== "object") {
      console.error("❌ Gemini response parsed but is not an object:", parsed);
      return NextResponse.json(
        { message: "AI returned an unexpected format. Please try again." },
        { status: 502 }
      );
    }

    const validPriorities = ["Low", "Medium", "High", "Critical"];
    const isValidTask = Boolean(parsed.isValidTask);

    if (!isValidTask) {
      return NextResponse.json({
        isValidTask: false,
        reason:
          typeof parsed.reason === "string" && parsed.reason.trim()
            ? parsed.reason
            : "This doesn't look like an actionable task title. Try something more specific, like 'Fix login bug' or 'Prepare quarterly report'.",
        description: "",
        subtasks: [],
        priority: null,
      });
    }

    return NextResponse.json({
      isValidTask: true,
      reason: "",
      description:
        typeof parsed.description === "string" ? parsed.description.trim() : "",
      subtasks: Array.isArray(parsed.subtasks)
        ? parsed.subtasks
            .filter((s: unknown) => typeof s === "string")
            .map((s: string) => s.trim())
            .filter(Boolean)
            .slice(0, 6)
        : [],
      priority: validPriorities.includes(parsed.priority) ? parsed.priority : null,
    });
  } catch (err: any) {
    console.error("🔥 Unhandled AI route error:", err?.message || err);
    return NextResponse.json(
      { message: "Something went wrong getting AI suggestions. Please try again." },
      { status: 500 }
    );
  }
}