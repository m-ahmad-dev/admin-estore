import { Check, MapPin } from "lucide-react";

const CustomerAddresses = ({ addresses, isLoading, isError }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-lg border border-slate-200 p-4"
          >
            <div className="h-3 w-24 rounded bg-slate-100" />

            <div className="mt-3 h-3 w-full rounded bg-slate-100" />

            <div className="mt-2 h-3 w-3/4 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-700">
          Failed to load customer addresses.
        </p>
      </div>
    );
  }

  if (!addresses?.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center">
        <MapPin size={20} className="mx-auto text-slate-400" />

        <p className="mt-2 text-sm font-medium text-slate-700">No addresses</p>

        <p className="mt-1 text-xs text-slate-400">
          This customer has no saved addresses.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <div
          key={address.id}
          className="rounded-lg border border-slate-200 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="shrink-0 text-slate-400" />

              <p className="text-sm font-semibold text-slate-800">
                {address.label || "Address"}
              </p>
            </div>

            {address.is_default && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                <Check size={12} />
                Default
              </span>
            )}
          </div>

          <div className="mt-3 space-y-1 text-sm text-slate-600">
            {address.street && <p>{address.street}</p>}

            <p>
              {[address.city, address.province, address.postal_code]
                .filter(Boolean)
                .join(", ")}
            </p>

            {address.country && <p>{address.country}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerAddresses;
