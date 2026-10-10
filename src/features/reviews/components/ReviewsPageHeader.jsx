import { RefreshCw } from "lucide-react";

const ReviewsPageHeader = ({ onRefresh, isFetching }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Review Management</h1>

        <p className="mt-1 text-sm text-slate-500">
          Moderate, inspect, approve, reject, and remove customer reviews.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
        Refresh Data
      </button>
    </div>
  );
};

export default ReviewsPageHeader;
