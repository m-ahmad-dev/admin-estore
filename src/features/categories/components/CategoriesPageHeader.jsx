import { Plus } from "lucide-react";

export default function CategoriesPageHeader({ onCreate }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Product Categories
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage product hierarchy, dynamic schemas, and attribute requirements.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98]"
      >
        <Plus size={18} />
        Add New Category
      </button>
    </div>
  );
}
