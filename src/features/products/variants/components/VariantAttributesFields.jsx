import { Controller } from "react-hook-form";

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50";

export default function VariantAttributesFields({
  control,
  rules = [],
  disabled = false,
}) {
  if (!rules.length) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        This category has no variant attribute rules configured.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rules.map((rule) => (
        <Controller
          key={rule.name}
          name={`attributes.${rule.name}`}
          control={control}
          render={({ field, fieldState }) => {
            const hasOptions =
              Array.isArray(rule.options) && rule.options.length > 0;

            return (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  {rule.label || rule.name}
                  {rule.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>
                {hasOptions ? (
                  <select
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={disabled}
                    className={inputClassName}
                  >
                    <option value="">Select {rule.label || rule.name}</option>
                    {rule.options.map((option) => (
                      <option key={String(option)} value={String(option)}>
                        {String(option)}
                      </option>
                    ))}
                  </select>
                ) : rule.type === "number" ? (
                  <input
                    type="number"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={disabled}
                    className={inputClassName}
                  />
                ) : rule.type === "boolean" ? (
                  <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5">
                    <input
                      type="checkbox"
                      checked={Boolean(field.value)}
                      onChange={(event) => field.onChange(event.target.checked)}
                      disabled={disabled}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">Enabled</span>
                  </label>
                ) : (
                  <input
                    type="text"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={disabled}
                    className={inputClassName}
                    placeholder={rule.label || rule.name}
                  />
                )}
                {fieldState.error && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            );
          }}
        />
      ))}
    </div>
  );
}
