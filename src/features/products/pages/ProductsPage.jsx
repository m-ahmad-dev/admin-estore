import { useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import { getApiErrorMessage } from "../../../lib/apiError.js";

import ProductsPageHeader from "../components/ProductsPageHeader.jsx";
import ProductsToolbar from "../components/ProductsToolbar.jsx";
import ProductsTable from "../components/ProductsTable.jsx";
import ProductFormModal from "../components/ProductFormModal.jsx";
import ProductDetailsDrawer from "../components/ProductDetailsDrawer.jsx";

import useProducts from "../hooks/useProducts.js";
import useProduct from "../hooks/useProduct.js";

import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useRestoreProduct,
} from "../hooks/useProductMutations.js";

import { uploadProductImage } from "../images/utils/imageUpload.js";

import { hasPermission } from "../../auth/authorization/authorization.js";
import PERMISSIONS from "../../auth/authorization/permissions.js";

function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function validateCreateDraft(payload) {
  const errors = [];
  if (!Array.isArray(payload.variants) || payload.variants.length === 0) {
    errors.push("Add at least one product variant.");
  }
  if (!Array.isArray(payload.images) || payload.images.length === 0) {
    errors.push("Add at least one product image.");
  }
  const primaryCount =
    payload.images?.filter((image) => image.is_primary).length ?? 0;
  if (primaryCount !== 1) {
    errors.push("Exactly one product image must be primary.");
  }
  return errors;
}

async function prepareCreatePayload(payload) {
  const uploadedImages = [];
  for (const image of payload.images) {
    if (!image.file) {
      throw new Error("A local product image file is missing.");
    }
    const result = await uploadProductImage(image.file);
    uploadedImages.push({
      key: result.fileKey,
      alt_text: image.alt_text?.trim() || "",
      is_primary: Boolean(image.is_primary),
      sort_order: Number.isInteger(image.sort_order) ? image.sort_order : null,
    });
  }

  return {
    name: payload.name,
    description: payload.description,
    category_id: payload.category_id,
    base_price: Number(payload.base_price),
    is_active: Boolean(payload.is_active),
    variants: payload.variants.map((variant) => ({
      attributes: variant.attributes,
      sku: variant.sku?.trim() || undefined,
      weight: Number(variant.weight),
      price: Number(variant.price),
      stock_quantity: Number(variant.stock_quantity),
      reserved_quantity: Number(variant.reserved_quantity),
      reorder_level: Number(variant.reorder_level),
    })),
    images: uploadedImages,
  };
}

// Helper to get admin from Redux or sessionStorage
function getAdminFromSession() {
  try {
    const stored = sessionStorage.getItem("admin");
    if (stored) return JSON.parse(stored);
  } catch {
    return null;
  }

  return null;
}

export default function ProductsPage() {
  // Get admin from Redux, with fallback to sessionStorage if Redux is empty
  const adminFromRedux = useSelector((state) => state.auth.admin);
  const admin = adminFromRedux || getAdminFromSession();

  // ----- Permission computation (robust for owner) -----
  const isOwner = admin?.role === "owner";
  const canEditProducts =
    isOwner || hasPermission(admin, PERMISSIONS.PRODUCTS_EDIT);
  const canDeleteProducts =
    isOwner || hasPermission(admin, PERMISSIONS.PRODUCTS_DELETE);

  // Filter state
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("all");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [limit, setLimit] = useState(10);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [currentCursor, setCurrentCursor] = useState(null);

  // Modal/drawer state
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [productFormMode, setProductFormMode] = useState("create");
  const [editingProductId, setEditingProductId] = useState(null);
  const [viewingProductId, setViewingProductId] = useState(null);

  const search = useDebounce(searchInput.trim(), 350);

  const params = useMemo(
    () => ({
      q: search || undefined,
      status,
      include_deleted: includeDeleted,
      sort,
      order,
      limit,
      cursor: currentCursor || undefined,
    }),
    [search, status, includeDeleted, sort, order, limit, currentCursor],
  );

  const { data, isLoading, isFetching, isError, error } = useProducts(params);
  const deleteMutation = useDeleteProduct();
  const restoreMutation = useRestoreProduct();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const products = data?.products ?? [];
  const pagination = data?.pagination ?? {
    limit,
    hasNextPage: false,
    nextCursor: null,
  };

  const { product: editingProduct, isLoading: editingProductLoading } =
    useProduct(editingProductId, productFormOpen && productFormMode === "edit");

  // Reset pagination when filters change
  const resetPagination = () => {
    setCursorHistory([]);
    setCurrentCursor(null);
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
    resetPagination();
  };
  const handleStatusChange = (value) => {
    setStatus(value);
    resetPagination();
  };
  const handleIncludeDeletedChange = (value) => {
    setIncludeDeleted(value);
    resetPagination();
  };
  const handleSortChange = (value) => {
    setSort(value);
    resetPagination();
  };
  const handleToggleOrder = () => {
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    resetPagination();
  };
  const handleLimitChange = (value) => {
    setLimit(value);
    resetPagination();
  };

  const handleNextPage = () => {
    if (!pagination.nextCursor) return;
    setCursorHistory((prev) => [...prev, currentCursor]);
    setCurrentCursor(pagination.nextCursor);
  };

  const handlePreviousPage = () => {
    if (cursorHistory.length === 0) return;
    const next = [...cursorHistory];
    const previousCursor = next.pop();
    setCursorHistory(next);
    setCurrentCursor(previousCursor || null);
  };

  const handleDelete = (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    deleteMutation.mutate(product.id, {
      onSuccess: (response) =>
        toast.success(response?.message || "Product deleted successfully"),
      onError: (err) =>
        toast.error(getApiErrorMessage(err, "Failed to delete product")),
    });
  };

  const handleRestore = (productId) => {
    restoreMutation.mutate(productId, {
      onSuccess: (response) =>
        toast.success(response?.message || "Product restored successfully"),
      onError: (err) =>
        toast.error(getApiErrorMessage(err, "Failed to restore product")),
    });
  };

  const handleCreateProduct = () => {
    setEditingProductId(null);
    setProductFormMode("create");
    setProductFormOpen(true);
  };

  const handleEditProduct = (productId) => {
    setEditingProductId(productId);
    setProductFormMode("edit");
    setProductFormOpen(true);
  };

  const handleCloseProductForm = () => {
    if (createProductMutation.isPending || updateProductMutation.isPending)
      return;
    setProductFormOpen(false);
    setEditingProductId(null);
  };

  const handleProductFormSubmit = async (payload) => {
    // Edit mode
    if (productFormMode === "edit") {
      if (!editingProductId) return;
      updateProductMutation.mutate(
        { productId: editingProductId, payload },
        {
          onSuccess: (response) => {
            toast.success(response?.message || "Product updated successfully");
            handleCloseProductForm();
          },
          onError: (err) =>
            toast.error(getApiErrorMessage(err, "Failed to update product")),
        },
      );
      return;
    }

    // Create mode
    const validationErrors = validateCreateDraft(payload);
    if (validationErrors.length) {
      validationErrors.forEach((msg) => toast.error(msg));
      return;
    }

    try {
      const createPayload = await prepareCreatePayload(payload);
      await createProductMutation.mutateAsync(createPayload);
      toast.success("Product created successfully");
      handleCloseProductForm();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create product"));
    }
  };

  if (isError) {
    return (
      <div className="p-6">
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900 shadow-sm">
          <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={20} />
          <div>
            <h2 className="text-sm font-semibold">Failed to load products</h2>
            <p className="mt-1 text-sm text-red-700">
              {getApiErrorMessage(
                error,
                "Something went wrong while fetching products.",
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formSubmitting =
    createProductMutation.isPending ||
    updateProductMutation.isPending ||
    editingProductLoading;

  return (
    <div className="p-6">
      <ProductsPageHeader onCreate={handleCreateProduct} />

      <ProductsToolbar
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        includeDeleted={includeDeleted}
        onIncludeDeletedChange={handleIncludeDeletedChange}
        sort={sort}
        onSortChange={handleSortChange}
        order={order}
        onToggleOrder={handleToggleOrder}
        limit={limit}
        onLimitChange={handleLimitChange}
      />

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-16 rounded-xl bg-slate-100" />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative">
          {isFetching && (
            <div className="absolute right-4 top-3 z-10 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
              <RefreshCw size={12} className="animate-spin" />
              Updating...
            </div>
          )}

          <ProductsTable
            products={products}
            onView={(id) => setViewingProductId(id)}
            onEdit={handleEditProduct}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />

          <ProductFormModal
            open={productFormOpen}
            mode={productFormMode}
            product={editingProduct}
            onClose={handleCloseProductForm}
            onSubmit={handleProductFormSubmit}
            isSubmitting={formSubmitting}
            canEditImages={canEditProducts}
            canDeleteImages={canDeleteProducts}
          />

          <ProductDetailsDrawer
            productId={viewingProductId}
            open={Boolean(viewingProductId)}
            onClose={() => setViewingProductId(null)}
            onEdit={(id) => {
              setViewingProductId(null);
              handleEditProduct(id);
            }}
          />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <button
          type="button"
          disabled={cursorHistory.length === 0 || isFetching}
          onClick={handlePreviousPage}
          className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-xs font-medium text-slate-500">
          Showing {products.length} product{products.length === 1 ? "" : "s"}
        </span>
        <button
          type="button"
          disabled={!pagination.hasNextPage || isFetching}
          onClick={handleNextPage}
          className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
