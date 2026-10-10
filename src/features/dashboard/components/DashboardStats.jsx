import {
  Boxes,
  CircleDollarSign,
  ClipboardList,
  Package,
  ShoppingCart,
  Star,
  Tags,
  Users,
} from "lucide-react";

const numberFormatter = new Intl.NumberFormat("en-US");

const currencyFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 2,
});

const formatNumber = (value) => numberFormatter.format(Number(value) || 0);

const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

const getSafe = (object, path, fallback = 0) =>
  path.split(".").reduce((current, key) => current?.[key], object) ?? fallback;

const primaryCards = [
  {
    key: "revenue",
    title: "Revenue",
    icon: CircleDollarSign,
    iconClass: "bg-emerald-50 text-emerald-600",
    accent: "from-emerald-50/80 to-white",
    getValue: (stats) => formatCurrency(getSafe(stats, "sales.totalRevenue")),
    getMeta: (stats) =>
      `AOV ${formatCurrency(getSafe(stats, "sales.averageOrderValue"))}`,
  },
  {
    key: "orders",
    title: "Orders",
    icon: ShoppingCart,
    iconClass: "bg-indigo-50 text-indigo-600",
    accent: "from-indigo-50/80 to-white",
    getValue: (stats) => formatNumber(getSafe(stats, "orders.total")),
    getMeta: (overview) =>
      `${formatNumber(getSafe(overview, "orders.pending"))} pending`,
  },
  {
    key: "customers",
    title: "Customers",
    icon: Users,
    iconClass: "bg-violet-50 text-violet-600",
    accent: "from-violet-50/80 to-white",
    getValue: (stats) => formatNumber(getSafe(stats, "customers.total")),
    getMeta: (overview) =>
      `${formatNumber(getSafe(overview, "customers.active"))} active accounts`,
  },
  {
    key: "aov",
    title: "Average order value",
    icon: ClipboardList,
    iconClass: "bg-cyan-50 text-cyan-600",
    accent: "from-cyan-50/80 to-white",
    getValue: (stats) =>
      formatCurrency(getSafe(stats, "sales.averageOrderValue")),
    getMeta: (stats) =>
      `${formatNumber(getSafe(stats, "orders.total"))} orders in period`,
  },
];

const secondaryCards = [
  {
    key: "products",
    title: "Products",
    icon: Package,
    iconClass: "bg-blue-50 text-blue-600",
    getValue: (overview) => formatNumber(getSafe(overview, "products.total")),
    getMeta: (overview) =>
      `${formatNumber(getSafe(overview, "products.active"))} active`,
  },
  {
    key: "inventory",
    title: "Inventory variants",
    icon: Boxes,
    iconClass: "bg-amber-50 text-amber-600",
    getValue: (overview) =>
      formatNumber(getSafe(overview, "inventory.variants")),
    getMeta: (overview) =>
      `${formatNumber(getSafe(overview, "inventory.lowStock"))} low stock`,
  },
  {
    key: "reviews",
    title: "Reviews",
    icon: Star,
    iconClass: "bg-orange-50 text-orange-600",
    getValue: (overview) => formatNumber(getSafe(overview, "reviews.total")),
    getMeta: (overview) =>
      `${formatNumber(
        getSafe(overview, "reviews.pending"),
      )} awaiting moderation`,
  },
  {
    key: "coupons",
    title: "Coupons",
    icon: Tags,
    iconClass: "bg-pink-50 text-pink-600",
    getValue: (overview) => formatNumber(getSafe(overview, "coupons.total")),
    getMeta: (overview) =>
      `${formatNumber(getSafe(overview, "coupons.active"))} active`,
  },
];

function DashboardStats({ overview, stats, periodLabel }) {
  if (!overview && !stats) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Store performance</h2>

        <p className="mt-1 text-xs text-slate-500">
          Key metrics for {periodLabel.toLowerCase()}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {primaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.key}
              className={`group overflow-hidden rounded-2xl border border-slate-200 bg-linear-to ${card.accent} p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500">
                    {card.title}
                  </p>

                  <p className="mt-3 truncate text-2xl font-bold tracking-tight text-slate-900">
                    {card.getValue(stats ?? overview)}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {card.getMeta(stats ?? overview)}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}
                >
                  <Icon size={19} />
                </div>
              </div>

              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/70">
                <div
                  className={`h-full rounded-full ${
                    card.key === "revenue"
                      ? "w-[82%] bg-emerald-400"
                      : card.key === "orders"
                        ? "w-[68%] bg-indigo-400"
                        : card.key === "customers"
                          ? "w-[74%] bg-violet-400"
                          : "w-[58%] bg-cyan-400"
                  }`}
                />
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {secondaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.key}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}
                >
                  <Icon size={17} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-500">
                    {card.title}
                  </p>

                  <p className="mt-0.5 text-lg font-bold text-slate-900">
                    {card.getValue(overview)}
                  </p>
                </div>
              </div>

              <p className="mt-3 truncate text-[11px] text-slate-500">
                {card.getMeta(overview)}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default DashboardStats;
