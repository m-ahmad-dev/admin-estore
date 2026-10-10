import {
  Activity,
  CheckCircle2,
  CircleDot,
  FolderTree,
  Package,
  ShoppingBag,
  Star,
  Tag,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";

const activityConfig = {
  ORDER_CREATED: {
    icon: ShoppingBag,
    iconClass: "bg-indigo-50 text-indigo-600",
    link: "/orders",
  },

  CUSTOMER_REGISTERED: {
    icon: UserPlus,
    iconClass: "bg-violet-50 text-violet-600",
    link: "/customers",
  },

  PRODUCT_CREATED: {
    icon: Package,
    iconClass: "bg-blue-50 text-blue-600",
    link: "/products",
  },

  REVIEW_SUBMITTED: {
    icon: Star,
    iconClass: "bg-amber-50 text-amber-600",
    link: "/reviews",
  },

  REVIEW_APPROVED: {
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-600",
    link: "/reviews",
  },

  CATEGORY_CREATED: {
    icon: FolderTree,
    iconClass: "bg-cyan-50 text-cyan-600",
    link: "/categories",
  },

  CATEGORY_UPDATED: {
    icon: FolderTree,
    iconClass: "bg-cyan-50 text-cyan-600",
    link: "/categories",
  },

  COUPON_CREATED: {
    icon: Tag,
    iconClass: "bg-pink-50 text-pink-600",
    link: "/coupons",
  },

  COUPON_UPDATED: {
    icon: Tag,
    iconClass: "bg-pink-50 text-pink-600",
    link: "/coupons",
  },
};

const fallbackConfig = {
  icon: CircleDot,
  iconClass: "bg-slate-100 text-slate-500",
  link: null,
};

const formatDateTime = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getRelativeTime = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diff = Date.now() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "Just now";
  }

  if (diff < hour) {
    return `${Math.floor(diff / minute)}m ago`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}h ago`;
  }

  if (diff < 7 * day) {
    return `${Math.floor(diff / day)}d ago`;
  }

  return formatDateTime(value);
};

function RecentActivity({ activities = [] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Recent activity</h2>

          <p className="mt-1 text-xs text-slate-500">
            Latest events recorded across your store.
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Activity size={17} />
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center">
          <Activity size={21} className="mx-auto text-slate-300" />

          <p className="mt-3 text-sm font-bold text-slate-800">
            No recent activity
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Store activity will appear here as new events occur.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type] ?? fallbackConfig;

            const Icon = config.icon;

            const item = (
              <div className="group relative flex gap-3.5 rounded-xl p-2 transition hover:bg-slate-50">
                <div className="relative z-10 shrink-0">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.iconClass}`}
                  >
                    <Icon size={15} />
                  </div>

                  {index !== activities.length - 1 && (
                    <span className="absolute left-1/2 top-9 h-[calc(100%+8px)] w-px -translate-x-1/2 bg-slate-200" />
                  )}
                </div>

                <div className="min-w-0 flex-1 pb-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="text-xs font-bold text-slate-800">
                      {activity.title}
                    </h3>

                    <span
                      title={formatDateTime(activity.created_at)}
                      className="shrink-0 text-[10px] text-slate-400"
                    >
                      {getRelativeTime(activity.created_at)}
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {activity.description}
                  </p>
                </div>
              </div>
            );

            return config.link ? (
              <Link
                key={`${activity.type}-${activity.created_at}-${index}`}
                to={config.link}
                className="block"
              >
                {item}
              </Link>
            ) : (
              <div key={`${activity.type}-${activity.created_at}-${index}`}>
                {item}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default RecentActivity;
