import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { message: "Note content is required" },
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

    const prompt = `You are a grammar and spelling correction assistant. Respond with ONLY valid JSON, no markdown fences, no extra text, in exactly this shape:

{
  "correctedText": "the full corrected version of the text",
  "hasChanges": true | false,
  "corrections": ["short description of change 1", "short description of change 2"]
}

Rules:
- Fix grammar, spelling, and punctuation mistakes only.
- Do NOT change the tone, meaning, wording style, or rephrase sentences unnecessarily.
- Preserve line breaks and paragraph structure exactly as in the original.
- If there are no mistakes, set "hasChanges" to false and "correctedText" to the original text unchanged.
- Keep "corrections" short (max 5 items), just brief human-readable notes like "Fixed 'recieve' to 'receive'".

Text to check:
"""${content}"""`;

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

    return NextResponse.json({
      correctedText:
        typeof parsed.correctedText === "string"
          ? parsed.correctedText
          : content,
      hasChanges: Boolean(parsed.hasChanges),
      corrections: Array.isArray(parsed.corrections) ? parsed.corrections : [],
    });
  } catch (err: any) {
    console.error("🔥 Gemini grammar-check error:", err?.message || err);
    return NextResponse.json(
      { message: err?.message || "Grammar check failed" },
      { status: 500 }
    );
  }
}