import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

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

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-xl">
      <p className="text-[11px] font-medium text-slate-500">
        {formatDate(label)}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-900">
        {formatCurrency(payload[0]?.value)}
      </p>
    </div>
  );
}

function RevenueChart({ data }) {
  const revenue = (data?.revenue ?? []).map((item) => ({
    date: item.date,
    amount: Number(item.amount) || 0,
  }));

  const isToday = data?.period === "today";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              Revenue overview
            </h2>

            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
              {data?.period ?? "today"}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Revenue from paid and delivered orders.
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <TrendingUp size={17} />
        </div>
      </div>

      {revenue.length === 0 ? (
        <div className="flex h-72 items-center justify-center">
          <p className="text-sm text-slate-400">No revenue data available.</p>
        </div>
      ) : (
        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenue}
              margin={{
                top: 10,
                right: 8,
                left: -18,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                minTickGap={28}
                tickMargin={10}
                tick={{
                  fontSize: 10,
                  fill: "#94a3b8",
                }}
                tickFormatter={isToday ? formatHour : formatDate}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "#94a3b8",
                }}
                tickFormatter={(value) => `$${value}`}
              />

              <Tooltip
                cursor={{
                  stroke: "#cbd5e1",
                  strokeDasharray: "4 4",
                }}
                content={<RevenueTooltip />}
              />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                activeDot={{
                  r: 5,
                  fill: "#ffffff",
                  stroke: "#10b981",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default RevenueChart;
