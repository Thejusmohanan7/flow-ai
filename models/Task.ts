import mongoose from "mongoose";

const SubtaskSchema = new mongoose.Schema({
  title: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

const TaskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    priority: String,
    status: String,
    dueDate: String,

    subtasks: [SubtaskSchema],

    userId: String, // for Clerk later
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in Next.js
export default mongoose.models.Task ||
  mongoose.model("Task", TaskSchema);