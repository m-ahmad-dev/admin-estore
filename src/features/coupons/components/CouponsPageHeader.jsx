import { Plus } from "lucide-react";

const CouponsPageHeader = ({ onCreate, canCreate = true }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Coupons</h1>

        <p className="mt-1 text-sm text-gray-500">
          Create and manage discount coupons.
        </p>
      </div>

      {canCreate && (
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={17} />
          Create Coupon
        </button>
      )}
    </div>
  );
};

export default CouponsPageHeader;
