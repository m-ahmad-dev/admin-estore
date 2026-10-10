import { Edit2, Eye, Package, Trash2, RotateCcw } from "lucide-react";
import PermissionGate from "../../auth/components/PermissionGate.jsx";
import { PERMISSIONS } from "../../auth/authorization/permissions.js";
import ProductStatusBadge from "./ProductStatusBadge.jsx";

const formatPrice = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return number.toLocaleString("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 2,
  });
};

export default function ProductsTable({
  products = [],
  onView,
  onEdit,
  onDelete,
  onRestore,
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Package size={28} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No products found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          No products match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Product</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Price</th>
              <th className="px-6 py-3.5">Reviews</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const image = product.primary_image || product.images?.[0];
              return (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-slate-50/70"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        {image?.url ? (
                          <img
                            src={image.url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            <Package size={18} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-slate-900">
                          {product.name}
                        </div>
                        <div className="mt-0.5 truncate font-mono text-xs text-slate-400">
                          {product.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {product.category?.name ?? "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {formatPrice(product.base_price)}
                  </td>
                  <td className="px-6 py-4">{product.review_count ?? 0}</td>
                  <td className="px-6 py-4">
                    <ProductStatusBadge
                      isActive={product.is_active}
                      deletedAt={product.deleted_at}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <PermissionGate permission={PERMISSIONS.PRODUCTS_VIEW}>
                        <button
                          type="button"
                          onClick={() => onView(product.id)}
                          title="View product"
                          className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <Eye size={16} />
                        </button>
                      </PermissionGate>

                      {!product.deleted_at && (
                        <PermissionGate permission={PERMISSIONS.PRODUCTS_EDIT}>
                          <button
                            type="button"
                            onClick={() => onEdit(product.id)}
                            title="Edit product"
                            className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            <Edit2 size={16} />
                          </button>
                        </PermissionGate>
                      )}

                      {product.deleted_at ? (
                        <PermissionGate permission={PERMISSIONS.PRODUCTS_EDIT}>
                          <button
                            type="button"
                            onClick={() => onRestore(product.id)}
                            title="Restore product"
                            className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <RotateCcw size={16} />
                          </button>
                        </PermissionGate>
                      ) : (
                        <PermissionGate
                          permission={PERMISSIONS.PRODUCTS_DELETE}
                        >
                          <button
                            type="button"
                            onClick={() => onDelete(product)}
                            title="Delete product"
                            className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </PermissionGate>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
