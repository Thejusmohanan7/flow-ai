type ReminderKind = "before" | "overdue";

export function buildTaskReminderEmail({
  taskTitle,
  taskDescription,
  dueLabel,
  priority,
  kind,
  dashboardUrl,
}: {
  taskTitle: string;
  taskDescription?: string;
  dueLabel: string;
  priority: string;
  kind: ReminderKind;
  dashboardUrl: string;
}) {
  const isOverdue = kind === "overdue";

  const subject = isOverdue
    ? `Overdue: "${taskTitle}"`
    : `Reminder: "${taskTitle}" is due soon`;

  const headline = isOverdue
    ? "This task is now overdue"
    : "This task is coming up";

  const accentColor = isOverdue ? "#ef4444" : "#f97316";

  const html = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #111827;">
    <div style="border-left: 4px solid ${accentColor}; padding-left: 16px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: ${accentColor};">
        ${headline}
      </p>
      <h1 style="margin: 8px 0 0; font-size: 20px; font-weight: 700; color: #111827;">
        ${escapeHtml(taskTitle)}
      </h1>
    </div>

    ${
      taskDescription
        ? `<p style="font-size: 14px; color: #4b5563; line-height: 1.5; margin: 0 0 16px;">${escapeHtml(
            taskDescription
          )}</p>`
        : ""
    }

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #6b7280;">Due</td>
        <td style="padding: 8px 0; font-size: 13px; color: #111827; font-weight: 600; text-align: right;">
          ${escapeHtml(dueLabel)}
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb;">Priority</td>
        <td style="padding: 8px 0; font-size: 13px; color: #111827; font-weight: 600; text-align: right; border-top: 1px solid #e5e7eb;">
          ${escapeHtml(priority)}
        </td>
      </tr>
    </table>

    <a href="${dashboardUrl}" style="display: inline-block; background: #111827; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 10px 20px; border-radius: 9999px;">
      View task
    </a>

    <p style="margin-top: 32px; font-size: 12px; color: #9ca3af;">
      You're receiving this because you have due-date reminders enabled for this task.
    </p>
  </div>`;

  return { subject, html };
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}