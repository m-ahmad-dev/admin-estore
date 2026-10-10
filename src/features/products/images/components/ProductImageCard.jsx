import { Check, GripVertical, Pencil, Star, Trash2 } from "lucide-react";

export default function ProductImageCard({
  image,
  index,
  onSetPrimary,
  onEditAlt,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  draggable = false,
  disabled = false,
  isDragging = false,
}) {
  return (
    <article
      draggable={draggable && !disabled}
      onDragStart={(event) => {
        if (!draggable || disabled) return;
        onDragStart?.(event, index);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!draggable || disabled) return;
        const types = Array.from(event.dataTransfer?.types ?? []);
        if (types.includes("application/x-product-image")) {
          event.dataTransfer.dropEffect = "move";
          onDragOver?.(event, index);
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!draggable || disabled) return;
        const types = Array.from(event.dataTransfer?.types ?? []);
        if (!types.includes("application/x-product-image")) return;
        onDrop?.(event, index);
      }}
      onDragEnd={onDragEnd}
      className={[
        "group overflow-hidden rounded-2xl border bg-white shadow-sm transition",
        isDragging ? "border-indigo-400 opacity-40" : "border-slate-200",
        disabled ? "opacity-70" : "",
      ].join(" ")}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={image.url}
          alt={image.alt_text || "Product image"}
          draggable={false}
          className="h-full w-full select-none object-cover transition duration-300 group-hover:scale-105"
        />
        {image.is_primary && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white shadow">
            <Star size={12} fill="currentColor" />
            Primary
          </div>
        )}
        <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[11px] font-semibold text-white">
          #{index + 1}
        </div>
        {draggable && !disabled && (
          <div
            className="absolute bottom-3 left-3 rounded-lg bg-black/60 p-2 text-white"
            title="Drag to reorder"
          >
            <GripVertical size={16} />
          </div>
        )}
      </div>
      <div className="space-y-3 p-3">
        <p className="truncate text-xs text-slate-500">
          {image.alt_text || "Product image"}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled || image.is_primary}
            onClick={() => onSetPrimary?.(image)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {image.is_primary ? (
              <>
                <Check size={14} />
                Primary
              </>
            ) : (
              <>
                <Star size={14} />
                Set primary
              </>
            )}
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onEditAlt?.(image)}
            className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Edit image"
            title="Edit image"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onDelete?.(image)}
            className="rounded-lg border border-red-100 p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Delete image"
            title="Delete image"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
