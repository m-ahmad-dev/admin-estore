import { useState } from "react";

import CouponsPageHeader from "../components/CouponsPageHeader.jsx";
import CouponsFilters from "../components/CouponsFilters.jsx";
import CouponsTable from "../components/CouponsTable.jsx";
import CouponsPagination from "../components/CouponsPagination.jsx";
import CouponFormModal from "../components/CouponFormModal.jsx";
import CouponDetailsDrawer from "../components/CouponDetailsDrawer.jsx";

import { useCoupons } from "../hooks/useCoupons.js";

const DEFAULT_FILTERS = {
  search: "",
  type: "",
  is_active: "",
  limit: 10,
};

const CouponsPage = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [cursor, setCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const { data, isLoading, isFetching, isError } = useCoupons({
    ...filters,
    ...(cursor ? { cursor } : {}),
  });

  const coupons = data?.data ?? [];

  const meta = data?.meta ?? {
    total: 0,
    limit: filters.limit,
    nextCursor: null,
    hasNextPage: false,
  };

  const handleFilterChange = (changes) => {
    setFilters((current) => ({
      ...current,
      ...changes,
    }));
    // Reset pagination state synchronously in the user event handler
    setCursor(null);
    setCursorHistory([]);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCursor(null);
    setCursorHistory([]);
  };

  const handleCreate = () => {
    setEditingCoupon(null);
    setIsFormOpen(true);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCoupon(null);
  };

  const handleView = (coupon) => {
    setSelectedCoupon(coupon);
  };

  const handleNext = () => {
    if (!meta.hasNextPage || !meta.nextCursor) {
      return;
    }

    setCursorHistory((history) => [...history, cursor]);
    setCursor(meta.nextCursor);
  };

  const handlePrevious = () => {
    if (!cursorHistory.length) {
      return;
    }

    const history = [...cursorHistory];
    const previousCursor = history.pop();

    setCursorHistory(history);
    setCursor(previousCursor ?? null);
  };

  return (
    <div className="space-y-6 p-6">
      <CouponsPageHeader onCreate={handleCreate} />

      <CouponsFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Failed to load coupons. Please try again.
        </div>
      ) : (
        <>
          <CouponsTable
            coupons={coupons}
            loading={isLoading || (isFetching && !data)}
            onView={handleView}
            onEdit={handleEdit}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Total coupons:{" "}
              <span className="font-medium text-gray-700">{meta.total}</span>
            </p>

            <CouponsPagination
              history={cursorHistory}
              currentCursor={cursor}
              hasNextPage={meta.hasNextPage}
              onNext={handleNext}
              onPrevious={handlePrevious}
              loading={isFetching}
            />
          </div>
        </>
      )}

      <CouponFormModal
        open={isFormOpen}
        coupon={editingCoupon}
        onClose={handleCloseForm}
      />

      <CouponDetailsDrawer
        open={Boolean(selectedCoupon)}
        coupon={selectedCoupon}
        onClose={() => setSelectedCoupon(null)}
      />
    </div>
  );
};

export default CouponsPage;
