import { useEffect, useState } from "react";
import { RefreshCw, Users } from "lucide-react";

import PermissionGate from "../../auth/components/PermissionGate.jsx";
import { PERMISSIONS } from "../../auth/authorization/permissions.js";

import CustomerFilters from "../components/CustomerFilters.jsx";
import CustomersTable from "../components/CustomersTable.jsx";
import CustomerPagination from "../components/CustomerPagination.jsx";
import CustomerDetailsDrawer from "../components/CustomerDetailsDrawer.jsx";
import EditCustomerModal from "../components/EditCustomerModal.jsx";
import CustomerStatusDialog from "../components/CustomerStatusDialog.jsx";

import { useCustomers } from "../hooks/useCustomers.js";

const LIMIT = 10;

const CustomersPage = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("asc");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [statusCustomer, setStatusCustomer] = useState(null);

  /*
   * Debounce search.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = {
    page,
    limit: LIMIT,
    search,
    sort,
    order,
  };

  const { data, isLoading, isFetching, isError, error, refetch } =
    useCustomers(queryParams);

  const customers = data?.customers ?? [];

  const pagination = data?.pagination ?? {
    totalItems: 0,
    totalPages: 0,
    currentPage: page,
  };

  const handleViewCustomer = (customerId) => {
    setSelectedCustomerId(customerId);
  };

  const handleCloseDetails = () => {
    setSelectedCustomerId(null);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
  };

  const handleCloseEdit = () => {
    setEditingCustomer(null);
  };

  const handleChangeStatus = (customer) => {
    setStatusCustomer(customer);
  };

  const handleCloseStatus = () => {
    setStatusCustomer(null);
  };

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    setPage(1);
  };

  const handleOrderChange = (nextOrder) => {
    setOrder(nextOrder);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages) {
      return;
    }

    setPage(nextPage);
  };

  return (
    <PermissionGate permission={PERMISSIONS.CUSTOMERS_VIEW}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                <Users size={19} className="text-slate-700" />
              </div>

              <h1 className="text-xl font-semibold text-slate-900">
                Customers
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Manage registered customers and their accounts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Main */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Filters */}
          <div className="border-b border-slate-200 p-4">
            <CustomerFilters
              search={searchInput}
              onSearchChange={setSearchInput}
              sort={sort}
              onSortChange={handleSortChange}
              order={order}
              onOrderChange={handleOrderChange}
            />
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="divide-y divide-slate-100">
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-5 px-5 py-5"
                >
                  <div className="h-9 w-9 rounded-full bg-slate-100" />

                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-40 rounded bg-slate-100" />
                    <div className="h-2.5 w-24 rounded bg-slate-100" />
                  </div>

                  <div className="hidden h-3 w-36 rounded bg-slate-100 md:block" />

                  <div className="hidden h-3 w-24 rounded bg-slate-100 md:block" />

                  <div className="h-6 w-16 rounded-full bg-slate-100" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && isError && (
            <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                !
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                Failed to load customers
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {error?.response?.data?.message ||
                  error?.message ||
                  "Something went wrong while loading customers."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && customers.length === 0 && (
            <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Users size={20} className="text-slate-500" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No customers found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? "Try adjusting your search."
                  : "There are no customers to display."}
              </p>
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && customers.length > 0 && (
            <>
              <CustomersTable
                customers={customers}
                onViewCustomer={handleViewCustomer}
              />

              <CustomerPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                limit={LIMIT}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>

        {/* Details */}
        <CustomerDetailsDrawer
          customerId={selectedCustomerId}
          open={Boolean(selectedCustomerId)}
          onClose={handleCloseDetails}
          onEdit={handleEditCustomer}
          onChangeStatus={handleChangeStatus}
        />

        {/* Edit */}
        <EditCustomerModal
          customer={editingCustomer}
          open={Boolean(editingCustomer)}
          onClose={handleCloseEdit}
        />

        {/* Status */}
        <CustomerStatusDialog
          customer={statusCustomer}
          open={Boolean(statusCustomer)}
          onClose={handleCloseStatus}
        />
      </div>
    </PermissionGate>
  );
};

export default CustomersPage;
