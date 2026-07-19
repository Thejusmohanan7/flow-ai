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

    subtasks: [
      {
        title: String,
        completed: Boolean,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Task ||
  mongoose.model("Task", TaskSchema);