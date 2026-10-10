import {
  X,
  Tag,
  Calendar,
  DollarSign,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import useProduct from "../hooks/useProduct.js";
import { formatVariantAttributes } from "../variants/utils/variantAttributes.js";

export default function ProductDetailsDrawer({
  productId,
  open,
  onClose,
  onEdit,
}) {
  const { product, isLoading, isError } = useProduct(productId, open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close drawer"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Product Details
            </h2>
            <p className="text-xs text-slate-500">
              Full product specifications and media
            </p>
          </div>
          <div className="flex items-center gap-2">
            {product && onEdit && (
              <button
                type="button"
                onClick={() => onEdit(product.id)}
                className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                Edit
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-1/2 rounded bg-slate-100" />
              <div className="h-24 rounded-xl bg-slate-100" />
              <div className="h-40 rounded-xl bg-slate-100" />
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Unable to load product details. Please try again.
            </div>
          ) : product ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {product.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  {product.slug}
                </p>
                {product.description && (
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-800">
                    PKR {Number(product.base_price).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600">
                    {product.category?.name || "Uncategorized"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600">
                    Created: {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      product.is_active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        product.is_active ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Images */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <ImageIcon size={16} className="text-indigo-600" />
                  Images ({product.images?.length || 0})
                </h4>
                {product.images?.length ? (
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {product.images.map((img) => (
                      <div
                        key={img.id}
                        className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                      >
                        <img
                          src={img.url}
                          alt={img.alt_text || "Product image"}
                          className="h-full w-full object-cover"
                        />
                        {img.is_primary && (
                          <span className="absolute left-2 top-2 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">No images</p>
                )}
              </div>

              {/* Variants */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Layers size={16} className="text-indigo-600" />
                  Variants ({product.variants?.length || 0})
                </h4>
                {product.variants?.length ? (
                  <div className="mt-3 space-y-3">
                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {variant.sku || "No SKU"}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {formatVariantAttributes(variant.attributes)}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-indigo-700">
                            PKR {Number(variant.price).toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                          <span>Stock: {variant.stock_quantity}</span>
                          <span>Reserved: {variant.reserved_quantity}</span>
                          <span>Reorder: {variant.reorder_level}</span>
                          <span>Weight: {variant.weight} kg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">No variants</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
