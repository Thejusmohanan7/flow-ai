import mongoose, { Schema, models, model } from "mongoose";

const CompletionSchema = new Schema(
  {
    date: { type: String, required: true }, // "YYYY-MM-DD"
    count: { type: Number },
    note: { type: String },
  },
  { _id: false }
);

const todayStr = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const HabitSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, default: "Personal" },
    color: { type: String },
    frequency: {
      type: String,
      enum: ["daily", "weekdays", "custom"],
      default: "daily",
    },
    targetPerWeek: { type: Number }, // used when frequency === "custom"
    targetCount: { type: Number }, // e.g. drink water 8x/day
    reminderTime: { type: String }, // "HH:mm"
    startDate: { type: String, default: todayStr }, // "YYYY-MM-DD" — when tracking begins
    completions: { type: [CompletionSchema], default: [] },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Habit || model("Habit", HabitSchema);