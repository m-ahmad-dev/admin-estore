import { CreditCard } from "lucide-react";

const formatMethod = (method) =>
  method
    ? method
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Unknown";

function PaymentMethodsChart({ data }) {
  const raw = data?.paymentMethods ?? [];

  const total = raw.reduce((sum, item) => sum + (Number(item.count) || 0), 0);

  const methods = [...raw]
    .map((item) => {
      const count = Number(item.count) || 0;

      return {
        method: item.method,
        count,
        percentage: total ? (count / total) * 100 : 0,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Payment methods</h2>

          <p className="mt-1 text-xs text-slate-500">
            Payment distribution across orders.
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
          <CreditCard size={17} />
        </div>
      </div>

      {methods.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-slate-400">No payment data available.</p>
        </div>
      ) : (
        <div className="mt-7 space-y-5">
          {methods.map((item, index) => (
            <div key={item.method}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      index % 4 === 0
                        ? "bg-indigo-50 text-indigo-600"
                        : index % 4 === 1
                          ? "bg-cyan-50 text-cyan-600"
                          : index % 4 === 2
                            ? "bg-violet-50 text-violet-600"
                            : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    <CreditCard size={13} />
                  </div>

                  <span className="truncate text-xs font-semibold text-slate-700">
                    {formatMethod(item.method)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    {item.count}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    index % 4 === 0
                      ? "bg-indigo-500"
                      : index % 4 === 1
                        ? "bg-cyan-500"
                        : index % 4 === 2
                          ? "bg-violet-500"
                          : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${Math.min(item.percentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Total payments
              </span>

              <span className="text-sm font-bold text-slate-900">{total}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PaymentMethodsChart;
