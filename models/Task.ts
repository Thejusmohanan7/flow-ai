import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    userId: String,
    title: String,
    description: String,

    priority: String,
    status: String,
    dueDate: String,
    dueTime: String,

    activeSince: Date,
    totalActiveMs: Number,
    completedAt: Date,

    subtasks: [
      {
        title: String,
        completed: Boolean,
      },
    ],

    reminderMinutesBefore: { type: Number, default: 30 },
    reminderSentBefore: { type: Boolean, default: false },
    reminderSentOverdue: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);