import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ClipboardList } from "lucide-react";

const STATUS_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#8b5cf6",
  "#06b6d4",
];

const formatStatus = (status) =>
  status
    ? status
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Unknown";

function StatusTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-xl">
      <p className="text-xs font-semibold text-slate-700">
        {formatStatus(item.status)}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-900">
        {item.count} orders
      </p>

      <p className="text-[11px] text-slate-400">
        {item.percentage.toFixed(1)}%
      </p>
    </div>
  );
}

function OrderStatusChart({ data }) {
  const raw = data?.orderStatus ?? [];

  const total = raw.reduce((sum, item) => sum + (Number(item.count) || 0), 0);

  const statuses = raw.map((item) => ({
    status: item.status,
    count: Number(item.count) || 0,
    percentage: total ? ((Number(item.count) || 0) / total) * 100 : 0,
  }));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Order status</h2>

          <p className="mt-1 text-xs text-slate-500">
            Distribution for the selected period.
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <ClipboardList size={17} />
        </div>
      </div>

      {statuses.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-slate-400">
            No order status data available.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid items-center gap-5 sm:grid-cols-[180px_1fr]">
          <div className="relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statuses}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={3}
                  stroke="none"
                >
                  {statuses.map((entry, index) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip content={<StatusTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">{total}</span>

              <span className="text-[10px] font-medium text-slate-400">
                total orders
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {statuses.map((item, index) => (
              <div
                key={item.status}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        STATUS_COLORS[index % STATUS_COLORS.length],
                    }}
                  />

                  <span className="truncate text-xs font-semibold text-slate-600">
                    {formatStatus(item.status)}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    {item.count}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default OrderStatusChart;
