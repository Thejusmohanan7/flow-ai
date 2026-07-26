import mongoose, { Schema, models, model } from "mongoose";

const MeetingSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD" — start date
    time: { type: String }, // "HH:mm", optional
    recurrence: {
      type: String,
      enum: ["none", "weekdays", "monsat", "custom"],
      default: "none",
    },
    // Days of week the meeting recurs on, 0=Sun ... 6=Sat.
    // Only used when recurrence === "custom".
    recurrenceDays: { type: [Number], default: [] },
  },
  { timestamps: true }
);

export default models.Meeting || model("Meeting", MeetingSchema);