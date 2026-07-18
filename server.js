import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate-description", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `Write a short task description for: ${title}`
    );

    res.json({ description: result.response.text() });
  } catch (err) {
    console.error("🔥 Server error:", err.message || err);
    res.status(500).json({ error: "Failed to generate description" });
  }
});

app.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});