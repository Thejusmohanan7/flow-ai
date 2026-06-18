"use client";

type TaskType = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
};

export default function DashboardMain({ tasks }: { tasks: TaskType[] }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="p-4 border rounded-xl shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold">{task.title}</h2>

              <p className="text-gray-600 text-sm mt-1">
                {task.description}
              </p>

              <div className="flex gap-3 mt-3 text-sm">
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {task.status}
                </span>

                <span className="px-2 py-1 bg-gray-100 rounded">
                  {task.priority}
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Due: {task.dueDate}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}