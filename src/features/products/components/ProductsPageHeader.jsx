import { Plus, Package } from "lucide-react";
import PermissionGate from "../../auth/components/PermissionGate.jsx";
import { PERMISSIONS } from "../../auth/authorization/permissions.js";

export default function ProductsPageHeader({ onCreate }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Package size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Products
          </h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Manage products, inventory, images and variants.
        </p>
      </div>
      <PermissionGate permission={PERMISSIONS.PRODUCTS_CREATE}>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <Plus size={17} />
          Add Product
        </button>
      </PermissionGate>
    </div>
  );
}
