import { ChevronLeft, ChevronRight } from "lucide-react";

const CouponsPagination = ({
  history,
  currentCursor,
  hasNextPage,
  onNext,
  onPrevious,
  loading,
}) => {
  const canGoPrevious = history.length > 0;

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-sm text-gray-500">
        {currentCursor ? "Showing next results" : "Showing first results"}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoPrevious || loading}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNextPage || loading}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CouponsPagination;
