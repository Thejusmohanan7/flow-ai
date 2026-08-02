import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { clerkClient } from "@clerk/nextjs/server";
import Task from "@/models/Task";
import { resend } from "@/lib/resend";
import { buildTaskReminderEmail } from "@/lib/email/taskReminderEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
};

const parseDueDateTime = (dueDate: string, dueTime?: string): Date | null => {
  if (!dueDate) return null;
  const [y, m, d] = dueDate.split("-").map(Number);
  if (!y || !m || !d) return null;

  const target = new Date(y, m - 1, d);

  if (dueTime) {
    const [h, min] = dueTime.split(":").map(Number);
    if (!isNaN(h) && !isNaN(min)) {
      target.setHours(h, min, 0, 0);
      return target;
    }
  }

  // No time set — treat end of day as the deadline.
  target.setHours(23, 59, 59, 999);
  return target;
};

const formatDueLabel = (dueDate: string, dueTime?: string) => {
  const date = parseDueDateTime(dueDate, dueTime);
  if (!date) return dueDate;
  const dateLabel = date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  if (!dueTime) return dateLabel;
  const timeLabel = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${dateLabel} · ${timeLabel}`;
};

export async function GET(req: Request) {
  // Vercel automatically sends this header for scheduled Cron invocations
  // when CRON_SECRET is set as an environment variable.
  const authHeader = req.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const now = new Date();

    // Only look at tasks that aren't finished and have a due date set.
    const candidateTasks = await Task.find({
      status: { $ne: "Done" },
      dueDate: { $exists: true, $ne: "" },
      $or: [{ reminderSentBefore: { $ne: true } }, { reminderSentOverdue: { $ne: true } }],
    });

    let beforeSent = 0;
    let overdueSent = 0;
    let skipped = 0;
    let failed = 0;

    // Group by user so we only look up each user's email once.
    const tasksByUser = new Map<string, typeof candidateTasks>();
    for (const task of candidateTasks) {
      const key = (task as any).userId;
      if (!key) continue;
      if (!tasksByUser.has(key)) tasksByUser.set(key, []);
      tasksByUser.get(key)!.push(task);
    }

    const client = await clerkClient();
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/dashboard`;

    for (const [userId, userTasks] of tasksByUser.entries()) {
      let email: string | null = null;
      try {
        const user = await client.users.getUser(userId);
        email =
          user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
            ?.emailAddress || user.emailAddresses[0]?.emailAddress || null;
      } catch (err) {
        console.error(`❌ Could not fetch Clerk user ${userId}:`, err);
      }

      if (!email) {
        skipped += userTasks.length;
        continue;
      }

      for (const task of userTasks) {
        const dueAt = parseDueDateTime(task.dueDate, task.dueTime);
        if (!dueAt) {
          skipped += 1;
          continue;
        }

        const reminderWindowMs =
          (task.reminderMinutesBefore ?? 30) * 60 * 1000;
        const msUntilDue = dueAt.getTime() - now.getTime();

        const shouldSendBefore =
          !task.reminderSentBefore &&
          msUntilDue > 0 &&
          msUntilDue <= reminderWindowMs;

        const shouldSendOverdue =
          !task.reminderSentOverdue && msUntilDue <= 0;

        if (!shouldSendBefore && !shouldSendOverdue) {
          continue;
        }

        const kind: "before" | "overdue" = shouldSendOverdue
          ? "overdue"
          : "before";

        const { subject, html } = buildTaskReminderEmail({
          taskTitle: task.title,
          taskDescription: task.description,
          dueLabel: formatDueLabel(task.dueDate, task.dueTime),
          priority: task.priority,
          kind,
          dashboardUrl,
        });

        try {
          await resend.emails.send({
            from: process.env.REMINDER_FROM_EMAIL || "Tasks <onboarding@resend.dev>",
            to: email,
            subject,
            html,
          });

          if (kind === "overdue") {
            task.reminderSentOverdue = true;
            overdueSent += 1;
          } else {
            task.reminderSentBefore = true;
            beforeSent += 1;
          }

          await task.save();
        } catch (sendError) {
          console.error(`❌ Failed to send reminder for task ${task._id}:`, sendError);
          failed += 1;
        }
      }
    }

    return NextResponse.json({
      success: true,
      beforeSent,
      overdueSent,
      skipped,
      failed,
      checked: candidateTasks.length,
    });
  } catch (error: any) {
    console.error("🔥 Task reminder cron error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Reminder job failed" },
      { status: 500 }
    );
  }
}