type Props = {
  tasks: any[];
};

export default function StatsCards({ tasks }: Props) {
  const normalize = (s: string) => (s || "").trim().toLowerCase();

  const total = tasks.length;
  const todo = tasks.filter((t) => normalize(t.status) === "todo").length;
  const progress = tasks.filter((t) => normalize(t.status) === "in progress").length;
  const done = tasks.filter((t) => normalize(t.status) === "done").length;

  const Card = ({ title, value }: any) => (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <Card title="Total Tasks" value={total} />
      <Card title="Todo" value={todo} />
      <Card title="In Progress" value={progress} />
      <Card title="Done" value={done} />
    </div>
  );
}