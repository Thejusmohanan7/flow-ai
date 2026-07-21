import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    userId: String,
    title: String,
    content: String,
    color: String,
    pinned: Boolean,
  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);