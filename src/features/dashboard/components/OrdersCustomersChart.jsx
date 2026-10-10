import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { UsersRound } from "lucide-react";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(new Date(value))
    : "";

const formatHour = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
      }).format(new Date(value))
    : "";

function ActivityTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
      <p className="text-[11px] font-medium text-slate-500">
        {formatDate(label)}
      </p>

      <div className="mt-2 space-y-1.5">
        {payload.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-6"
          >
            <span className="text-xs text-slate-500">{entry.name}</span>

            <span className="text-xs font-bold text-slate-900">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersCustomersChart({ data }) {
  const map = new Map();

  (data?.orders ?? []).forEach((item) => {
    if (!item?.date) {
      return;
    }

    map.set(item.date, {
      ...(map.get(item.date) ?? {}),
      date: item.date,
      orders: Number(item.count) || 0,
    });
  });

  (data?.customers ?? []).forEach((item) => {
    if (!item?.date) {
      return;
    }

    map.set(item.date, {
      ...(map.get(item.date) ?? {}),
      date: item.date,
      customers: Number(item.count) || 0,
    });
  });

  const rows = Array.from(map.values())
    .map((item) => ({
      date: item.date,
      orders: item.orders ?? 0,
      customers: item.customers ?? 0,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const isToday = data?.period === "today";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Orders & customers
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Compare order activity with customer acquisition.
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <UsersRound size={17} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
          <span className="text-xs font-medium text-slate-500">Orders</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
          <span className="text-xs font-medium text-slate-500">Customers</span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-slate-400">No activity data available.</p>
        </div>
      ) : (
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rows}
              margin={{
                top: 10,
                right: 8,
                left: -18,
                bottom: 0,
              }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                minTickGap={28}
                tick={{
                  fontSize: 10,
                  fill: "#94a3b8",
                }}
                tickFormatter={isToday ? formatHour : formatDate}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                tick={{
                  fontSize: 10,
                  fill: "#94a3b8",
                }}
              />

              <Tooltip
                cursor={{
                  fill: "#f8fafc",
                }}
                content={<ActivityTooltip />}
              />

              <Bar
                dataKey="orders"
                name="Orders"
                fill="#6366f1"
                radius={[5, 5, 0, 0]}
                maxBarSize={18}
              />

              <Line
                type="monotone"
                dataKey="customers"
                name="Customers"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#ffffff",
                  stroke: "#8b5cf6",
                  strokeWidth: 2,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default OrdersCustomersChart;
