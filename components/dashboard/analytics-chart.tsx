"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AnalyticsChart({ data }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
        Activity Overview
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" stroke="#94a3b8" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="tasks"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="notes"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}