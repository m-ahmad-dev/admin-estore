import { useEffect, useState } from "react";

import PermissionGate from "../../auth/components/PermissionGate.jsx";
import { PERMISSIONS } from "../../auth/authorization/permissions.js";

import { useReviews } from "../hooks/useReviews.js";

import ReviewsPageHeader from "../components/ReviewsPageHeader.jsx";
import ReviewsToolbar from "../components/ReviewsToolbar.jsx";
import ReviewsTable from "../components/ReviewsTable.jsx";
import ReviewsPagination from "../components/ReviewsPagination.jsx";
import ReviewDetailsDrawer from "../components/ReviewDetailsDrawer.jsx";
import ReviewStatusModal from "../components/ReviewStatusModal.jsx";
import ReviewDeleteDialog from "../components/ReviewDeleteDialog.jsx";

const INITIAL_FILTERS = {
  search: "",
  status: "",
  rating: "",
  product_id: "",
  customer_id: "",
  sort: "created_at",
  order: "desc",
  limit: 20,
};

export const ReviewsPage = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentCursor, setCurrentCursor] = useState("");
  const [cursorHistory, setCursorHistory] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [statusReview, setStatusReview] = useState(null);
  const [deleteReview, setDeleteReview] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [filters.search]);

  const queryFilters = {
    limit: filters.limit,
    sort: filters.sort,
    order: filters.order,

    ...(currentCursor && {
      cursor: currentCursor,
    }),

    ...(debouncedSearch.trim() && {
      search: debouncedSearch.trim(),
    }),

    ...(filters.status && {
      status: filters.status,
    }),

    ...(filters.rating !== "" && {
      rating: Number(filters.rating),
    }),

    ...(filters.product_id.trim() && {
      product_id: filters.product_id.trim(),
    }),

    ...(filters.customer_id.trim() && {
      customer_id: filters.customer_id.trim(),
    }),
  };

  const { data, isLoading, isFetching, refetch } = useReviews(queryFilters);

  const reviews = data?.data?.reviews || data?.reviews || [];
  const pagination = data?.data?.pagination || data?.pagination || {};
  const nextCursor = pagination?.nextCursor || null;
  const hasNextPage = pagination?.hasNext === true || Boolean(nextCursor);
  const canGoPrevious = cursorHistory.length > 0;

  const handleFilterChange = (field, value) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }));

    /**
     * Any filter change represents a new result set.
     * Always return to the first cursor page.
     */
    setCurrentCursor("");
    setCursorHistory([]);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setDebouncedSearch("");
    setCurrentCursor("");
    setCursorHistory([]);
  };

  const handleNextPage = () => {
    if (!nextCursor || isFetching) {
      return;
    }

    setCursorHistory((previous) => [...previous, currentCursor]);

    setCurrentCursor(nextCursor);
  };

  const handlePreviousPage = () => {
    if (!cursorHistory.length || isFetching) {
      return;
    }

    const previousHistory = [...cursorHistory];
    const previousCursor = previousHistory.pop() || "";

    setCursorHistory(previousHistory);
    setCurrentCursor(previousCursor);
  };

  const handleViewReview = (reviewId) => {
    setSelectedReviewId(reviewId);
  };

  const handleCloseDetails = () => {
    setSelectedReviewId(null);
  };

  const handleChangeStatus = (review) => {
    setStatusReview(review);
  };

  const handleCloseStatusModal = () => {
    setStatusReview(null);
  };

  const handleDelete = (review) => {
    setDeleteReview(review);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteReview(null);
  };

  return (
    <div className="space-y-6 p-6">
      <ReviewsPageHeader onRefresh={refetch} isFetching={isFetching} />

      <ReviewsToolbar
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <ReviewsTable
        reviews={reviews}
        loading={isLoading}
        onView={handleViewReview}
        onChangeStatus={handleChangeStatus}
        onDelete={handleDelete}
      />

      <ReviewsPagination
        reviewCount={reviews.length}
        hasNextPage={hasNextPage}
        canGoPrevious={canGoPrevious}
        onNext={handleNextPage}
        onPrevious={handlePreviousPage}
        loading={isFetching}
      />

      {/* Details */}
      <PermissionGate permission={PERMISSIONS.REVIEWS_VIEW}>
        {selectedReviewId && (
          <ReviewDetailsDrawer
            reviewId={selectedReviewId}
            open={Boolean(selectedReviewId)}
            onClose={handleCloseDetails}
          />
        )}
      </PermissionGate>

      {/* Status moderation */}
      <PermissionGate permission={PERMISSIONS.REVIEWS_EDIT}>
        {statusReview && (
          <ReviewStatusModal
            review={statusReview}
            open={Boolean(statusReview)}
            onClose={handleCloseStatusModal}
          />
        )}
      </PermissionGate>

      {/* Delete */}
      <PermissionGate permission={PERMISSIONS.REVIEWS_DELETE}>
        {deleteReview && (
          <ReviewDeleteDialog
            review={deleteReview}
            open={Boolean(deleteReview)}
            onClose={handleCloseDeleteDialog}
          />
        )}
      </PermissionGate>
    </div>
  );
};

export default ReviewsPage;
