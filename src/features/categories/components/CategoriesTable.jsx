import { Eye, Edit2, Trash2, FolderTree, Tag } from "lucide-react";

export default function CategoriesTable({
  categories = [],
  onView,
  onEdit,
  onDelete,
}) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <FolderTree size={28} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No categories found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          No categories match your search criteria or none have been created
          yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                Category
              </th>
              <th scope="col" className="px-6 py-3.5">
                Slug
              </th>
              <th scope="col" className="px-6 py-3.5">
                Parent
              </th>
              <th scope="col" className="px-6 py-3.5">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5 text-center">
                Attributes
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="transition-colors hover:bg-slate-50/80"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">
                    {category.name}
                  </div>
                  {category.description && (
                    <div className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                      {category.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-slate-600">
                  {category.slug}
                </td>
                <td className="px-6 py-4">
                  {category.parent_id ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                      <FolderTree size={12} className="text-slate-400" />
                      {categories.find((c) => c.id === category.parent_id)
                        ?.name || "— Root —"}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">
                      — Root —
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {category.is_active ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                    <Tag size={12} />
                    {category.attribute_rules?.length ?? 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onView(category.id)}
                      title="View details"
                      className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(category.id)}
                      title="Edit category"
                      className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(category)}
                      title="Delete category"
                      className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
