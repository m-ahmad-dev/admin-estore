import { LockKeyhole, Pencil, Plus, Trash2 } from "lucide-react";

import { PermissionGate } from "../../auth/components/PermissionGate.jsx";
import { PERMISSIONS } from "../../auth/authorization/permissions.js";

function AttributeRulesSection({
  attributes,
  localAttributeNames,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <section className="border-t border-[--border-subtle] px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[--text-primary]">
            Attribute rules
          </h3>

          <p className="mt-1 text-xs text-[--text-secondary]">
            Effective attributes inherited from this category hierarchy.
          </p>
        </div>

        <PermissionGate permission={PERMISSIONS.CATEGORIES_EDIT}>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[--border-subtle] px-3 py-2 text-xs font-medium hover:bg-[--bg-muted]"
          >
            <Plus size={15} />
            Add attribute
          </button>
        </PermissionGate>
      </div>

      {!attributes.length ? (
        <div className="mt-4 rounded-lg border border-dashed border-[--border-subtle] p-6 text-center">
          <p className="text-sm text-[--text-secondary]">
            No attributes defined for this category hierarchy.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {attributes.map((attribute) => {
            const isLocal = localAttributeNames.has(attribute.name);

            return (
              <div
                key={attribute.name}
                className="rounded-xl border border-[--border-subtle] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-[--text-primary]">
                        {attribute.label}
                      </h4>

                      <span className="rounded-full bg-[--bg-muted] px-2 py-0.5 text-[10px] font-medium uppercase text-[--text-secondary]">
                        {attribute.type}
                      </span>

                      {attribute.required && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                          Required
                        </span>
                      )}

                      {!isLocal && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                          <LockKeyhole size={11} />
                          Inherited
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-[--text-secondary]">
                      {attribute.name}
                    </p>

                    {attribute.type === "enum" &&
                      attribute.options?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {attribute.options.map((option) => (
                            <span
                              key={option}
                              className="rounded-md border border-[--border-subtle] px-2 py-1 text-xs text-[--text-secondary]"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>

                  {isLocal && (
                    <PermissionGate permission={PERMISSIONS.CATEGORIES_EDIT}>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          title="Edit attribute"
                          onClick={() => onEdit(attribute)}
                          className="rounded-lg p-2 text-[--text-secondary] hover:bg-[--bg-muted]"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete attribute"
                          onClick={() => onDelete(attribute)}
                          className="rounded-lg p-2 text-[--text-secondary] hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </PermissionGate>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default AttributeRulesSection;
