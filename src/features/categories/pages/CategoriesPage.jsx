import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, RefreshCw } from "lucide-react";

import CategoriesPageHeader from "../components/CategoriesPageHeader.jsx";
import CategoriesTable from "../components/CategoriesTable.jsx";
import CategoryPagination from "../components/CategoryPagination.jsx";
import CategoryFormModal from "../components/CategoryFormModal.jsx";
import CategoryDeleteDialog from "../components/CategoryDeleteDialog.jsx";
import CategoryDetailsDrawer from "../components/CategoryDetailsDrawer.jsx";
import CategoriesToolbar from "../components/CategoriesToolbar.jsx";
import useCategories, { useAllCategories } from "../hooks/useCategories.js";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../hooks/useCategoryMutations.js";
import { getApiErrorMessage } from "../../../lib/apiError.js";

function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function CategoriesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("asc");

  const [formModal, setFormModal] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const search = useDebounce(searchInput.trim(), 350);

  const params = useMemo(
    () => ({ pages: page, limit, search, sort, order }),
    [page, limit, search, sort, order],
  );

  const { data, isLoading, isFetching, isError, error } = useCategories(params);
  const { data: allCategories = [] } = useAllCategories();

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const categories = data?.categories ?? [];
  const pagination = data?.pagination ?? {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: limit,
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    if (sort === newSort) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(newSort);
      setOrder("asc");
    }
    setPage(1);
  };

  const handleToggleOrder = () => {
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleCreate = (payload) => {
    createMutation.mutate(payload, {
      onSuccess: (res) => {
        toast.success(res?.message || "Category created successfully");
        setFormModal(null);
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, "Failed to create category"));
      },
    });
  };

  const handleUpdate = ({ categoryId, payload }) => {
    updateMutation.mutate(
      { categoryId, payload },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Category updated successfully");
          setFormModal(null);
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to update category"));
        },
      },
    );
  };

  const handleDelete = () => {
    if (!categoryToDelete) return;

    deleteMutation.mutate(categoryToDelete.id, {
      onSuccess: () => {
        toast.success("Category deleted successfully");
        setCategoryToDelete(null);

        if (categories.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, "Failed to delete category"));
      },
    });
  };

  const activeCategory = formModal?.categoryId
    ? allCategories.find((cat) => cat.id === formModal.categoryId) ||
      categories.find((cat) => cat.id === formModal.categoryId)
    : null;

  if (isError) {
    return (
      <div className="p-6">
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900 shadow-sm">
          <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={20} />
          <div>
            <h2 className="text-sm font-semibold">Failed to load categories</h2>
            <p className="mt-1 text-sm text-red-700">
              {getApiErrorMessage(
                error,
                "Something went wrong while fetching categories.",
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <CategoriesPageHeader onCreate={() => setFormModal({ mode: "create" })} />

      <CategoriesToolbar
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
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
              <div key={item} className="h-12 rounded-xl bg-slate-100" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="relative">
            {isFetching && (
              <div className="absolute right-4 top-3 z-10 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
                <RefreshCw size={12} className="animate-spin" />
                Updating...
              </div>
            )}

            <CategoriesTable
              categories={categories}
              onView={setSelectedCategoryId}
              onEdit={(categoryId) =>
                setFormModal({ mode: "edit", categoryId })
              }
              onDelete={setCategoryToDelete}
            />
          </div>

          <CategoryPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage ?? limit}
            onPageChange={setPage}
          />
        </>
      )}

      <CategoryFormModal
        open={Boolean(formModal)}
        mode={formModal?.mode}
        category={activeCategory}
        categories={allCategories}
        onClose={() => setFormModal(null)}
        onSubmit={formModal?.mode === "edit" ? handleUpdate : handleCreate}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <CategoryDetailsDrawer
        categoryId={selectedCategoryId}
        open={Boolean(selectedCategoryId)}
        onClose={() => setSelectedCategoryId(null)}
        onEdit={(categoryId) => {
          setSelectedCategoryId(null);
          setFormModal({ mode: "edit", categoryId });
        }}
      />

      <CategoryDeleteDialog
        category={categoryToDelete}
        open={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
