import { ListChecks, Circle, Clock, CheckCircle2 } from "lucide-react";

type Props = {
  tasks: any[];
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isToday = (dateStr?: string) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  return isSameDay(d, new Date());
};

const isWithinDays = (dateStr: string | undefined, days: number) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const diffMs = Date.now() - d.getTime();
  return diffMs >= 0 && diffMs <= days * 24 * 60 * 60 * 1000;
};

export default function StatsCards({ tasks }: Props) {
  const normalize = (s: string) => (s || "").trim().toLowerCase();

  const total = tasks.length;
  const todo = tasks.filter((t) => normalize(t.status) === "todo");
  const progress = tasks.filter((t) => normalize(t.status) === "in progress");
  const done = tasks.filter((t) => normalize(t.status) === "done");

  const createdThisWeek = tasks.filter((t) => isWithinDays(t.createdAt, 7)).length;
  const todoUpdatedToday = todo.filter((t) => isToday(t.updatedAt)).length;
  const progressUpdatedToday = progress.filter((t) => isToday(t.updatedAt)).length;
  const doneThisWeek = done.filter((t) => isWithinDays(t.updatedAt, 7)).length;

  const cards = [
    {
      title: "Total Tasks",
      value: total,
      trend: createdThisWeek > 0 ? `+${createdThisWeek} this week` : null,
      icon: ListChecks,
      color: "purple",
    },
    {
      title: "To Do",
      value: todo.length,
      trend: todoUpdatedToday > 0 ? `+${todoUpdatedToday} today` : null,
      icon: Circle,
      color: "blue",
    },
    {
      title: "In Progress",
      value: progress.length,
      trend: progressUpdatedToday > 0 ? `+${progressUpdatedToday} today` : null,
      icon: Clock,
      color: "orange",
    },
    {
      title: "Done",
      value: done.length,
      trend: doneThisWeek > 0 ? `+${doneThisWeek} this week` : null,
      icon: CheckCircle2,
      color: "green",
    },
  ];

  const colorClasses: Record<string, { iconBg: string; iconText: string; trend: string }> = {
    purple: {
      iconBg: " dark:bg-purple-900/30",
      iconText: "text-purple-600 dark:text-purple-400",
      trend: "text-purple-600 dark:text-purple-400",
    },
    blue: {
      iconBg: " dark:bg-blue-900/30",
      iconText: "text-blue-600 dark:text-blue-400",
      trend: "text-blue-600 dark:text-blue-400",
    },
    orange: {
      iconBg: " dark:bg-orange-900/30",
      iconText: "text-orange-600 dark:text-orange-400",
      trend: "text-orange-600 dark:text-orange-400",
    },
    green: {
      iconBg: " dark:bg-green-900/30",
      iconText: "text-green-600 dark:text-green-400",
      trend: "text-green-600 dark:text-green-400",
    },
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const colors = colorClasses[card.color];

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${colors.iconBg}`}
              >
                <Icon size={18} className={colors.iconText} />
              </span>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {card.title}
              </p>
            </div>

            <p className="mt-3 ml-3 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              {card.value}
            </p>

            {card.trend && (
              <p className={`mt-1 ml-3 text-xs font-medium ${colors.trend}`}>
                {card.trend}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}