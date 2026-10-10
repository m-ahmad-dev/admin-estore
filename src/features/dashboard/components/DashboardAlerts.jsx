import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
  ShieldAlert,
} from "lucide-react";
import { Link } from "react-router-dom";

const severityConfig = {
  warning: {
    icon: AlertTriangle,
    wrapper: "border-amber-200 bg-amber-50/70",
    iconWrapper: "bg-amber-100 text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },

  error: {
    icon: ShieldAlert,
    wrapper: "border-rose-200 bg-rose-50/70",
    iconWrapper: "bg-rose-100 text-rose-600",
    badge: "bg-rose-100 text-rose-700",
  },

  info: {
    icon: Info,
    wrapper: "border-sky-200 bg-sky-50/70",
    iconWrapper: "bg-sky-100 text-sky-600",
    badge: "bg-sky-100 text-sky-700",
  },
};

function DashboardAlerts({ alerts = [] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              Attention required
            </h2>

            {alerts.length > 0 && (
              <span className="min-w-5 rounded-full bg-rose-100 px-1.5 py-0.5 text-center text-[10px] font-bold text-rose-600">
                {alerts.length}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Items that may require administrative attention.
          </p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-10 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={20} />
          </div>

          <p className="mt-3 text-sm font-bold text-slate-900">
            Everything looks good
          </p>

          <p className="mt-1 text-xs text-slate-500">
            There are currently no active dashboard alerts.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {alerts.map((alert, index) => {
            const config =
              severityConfig[alert.severity] ?? severityConfig.info;

            const Icon = config.icon;

            return (
              <div
                key={`${alert.type}-${index}`}
                className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-sm ${config.wrapper}`}
              >
                <div className="flex gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconWrapper}`}
                  >
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-800">
                        {alert.title}
                      </h3>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${config.badge}`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs leading-5 text-slate-600">
                      {alert.message}
                    </p>

                    {alert.action && (
                      <Link
                        to={alert.action}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 transition hover:gap-2 hover:text-indigo-600"
                      >
                        Review issue
                        <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default DashboardAlerts;
