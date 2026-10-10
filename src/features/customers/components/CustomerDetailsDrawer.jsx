import { useEffect } from "react";
import {
  CalendarDays,
  Edit,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  X,
} from "lucide-react";

import PermissionGate from "../../auth/components/PermissionGate.jsx";
import { PERMISSIONS } from "../../auth/authorization/permissions.js";

import CustomerStatusBadge from "./CustomerStatusBadge.jsx";
import { useCustomer } from "../hooks/useCustomer.js";
import { useCustomerAddresses } from "../hooks/useCustomerAddresses.js";

const formatDate = (value) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const DetailRow = ({ icon: Icon, label, children }) => {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-slate-400">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>

        <div className="mt-1 text-sm text-slate-700">{children}</div>
      </div>
    </div>
  );
};

const CustomerDetailsDrawer = ({
  customerId,
  open,
  onClose,
  onEdit,
  onChangeStatus,
}) => {
  const { customer, isLoading, isError, error } = useCustomer(customerId, open);

  const {
    addresses,
    isLoading: isAddressesLoading,
    isError: isAddressesError,
  } = useCustomerAddresses(customerId, open);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close customer details"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-[--border-subtle] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[--border-subtle] px-6 py-5">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-[--text-secondary]">
              Customer details
            </p>

            <h2 className="mt-1 truncate text-lg font-semibold text-[--text-primary]">
              {customer
                ? `${customer.first_name} ${customer.last_name}`
                : "Customer"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {customer && (
              <PermissionGate permission={PERMISSIONS.CUSTOMERS_EDIT}>
                <button
                  type="button"
                  onClick={() => onEdit(customer)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Edit size={15} />
                  Edit
                </button>
              </PermissionGate>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading && (
            <div className="animate-pulse space-y-6">
              <div className="h-24 rounded-xl bg-slate-100" />
              <div className="h-20 rounded-lg bg-slate-100" />
              <div className="h-20 rounded-lg bg-slate-100" />
              <div className="h-20 rounded-lg bg-slate-100" />
            </div>
          )}

          {!isLoading && isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-medium text-red-700">
                Unable to load customer details.
              </p>

              <p className="mt-1 text-xs text-red-600">
                {error?.response?.data?.message ||
                  error?.message ||
                  "Something went wrong."}
              </p>
            </div>
          )}

          {!isLoading && !isError && customer && (
            <div className="space-y-7">
              {/* Profile */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-lg font-semibold text-slate-700 shadow-sm">
                    {customer.first_name?.charAt(0)?.toUpperCase() || "C"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-slate-900">
                      {customer.first_name} {customer.last_name}
                    </h3>

                    <p className="truncate text-sm text-slate-500">
                      {customer.email}
                    </p>

                    <div className="mt-2">
                      <CustomerStatusBadge isActive={customer.is_active} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ShoppingBag size={16} />

                    <span className="text-xs">Total orders</span>
                  </div>

                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    {customer.total_orders ?? 0}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CalendarDays size={16} />

                    <span className="text-xs">Created</span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {formatDate(customer.created_at)}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <section>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Contact information
                </h3>

                <div className="space-y-5">
                  <DetailRow icon={Mail} label="Email">
                    {customer.email || "Not provided"}
                  </DetailRow>

                  <DetailRow icon={Phone} label="Phone">
                    {customer.phone || "Not provided"}
                  </DetailRow>

                  <DetailRow icon={CalendarDays} label="Created">
                    {formatDate(customer.created_at)}
                  </DetailRow>
                </div>
              </section>

              {/* Addresses */}
              <section className="border-t border-slate-200 pt-6">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin size={17} className="text-slate-400" />

                  <h3 className="text-sm font-semibold text-slate-900">
                    Saved addresses
                  </h3>
                </div>

                {isAddressesLoading && (
                  <div className="space-y-3">
                    {[1, 2].map((item) => (
                      <div
                        key={item}
                        className="h-24 animate-pulse rounded-lg bg-slate-100"
                      />
                    ))}
                  </div>
                )}

                {isAddressesError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                      Unable to load addresses.
                    </p>
                  </div>
                )}

                {!isAddressesLoading &&
                  !isAddressesError &&
                  addresses.length === 0 && (
                    <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center">
                      <MapPin size={20} className="mx-auto text-slate-400" />

                      <p className="mt-2 text-sm font-medium text-slate-700">
                        No saved addresses
                      </p>
                    </div>
                  )}

                {!isAddressesLoading &&
                  !isAddressesError &&
                  addresses.length > 0 && (
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="rounded-lg border border-slate-200 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-800">
                              {address.label || "Address"}
                            </p>

                            {address.is_default && (
                              <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                                Default
                              </span>
                            )}
                          </div>

                          <div className="mt-3 space-y-1 text-sm text-slate-600">
                            {address.street && <p>{address.street}</p>}

                            <p>
                              {[
                                address.city,
                                address.province,
                                address.province_code,
                                address.postal_code,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>

                            {address.country && <p>{address.country}</p>}

                            {!address.country && address.country_code && (
                              <p>{address.country_code}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </section>

              {/* Status */}
              <PermissionGate permission={PERMISSIONS.CUSTOMERS_EDIT}>
                <section className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Account status
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Control whether this customer can use their account.
                  </p>

                  <button
                    type="button"
                    onClick={() => onChangeStatus(customer)}
                    className={`mt-4 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      customer.is_active
                        ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {customer.is_active
                      ? "Deactivate customer"
                      : "Activate customer"}
                  </button>
                </section>
              </PermissionGate>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default CustomerDetailsDrawer;
