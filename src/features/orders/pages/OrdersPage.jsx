import { useState, useEffect } from "react";
import { Eye, Ban, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useOrders } from "../hooks/useOrders";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { OrderDetailsDrawer } from "../components/OrderDetailsDrawer";
import { UpdateStatusModal } from "../components/UpdateStatusModal";
import { CancelOrderDialog } from "../components/CancelOrderDialog";
import { OrdersFilterBar } from "../components/OrdersFilterBar";
import PermissionGate from "../../auth/components/PermissionGate.jsx";

import {
  orderStatusEnum,
  paymentStatusEnum,
  shipmentStatusEnum,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
  updateShipmentStatusSchema,
} from "../schemas/order.schema";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const INITIAL_FILTERS = {
  search: "",
  status: "",
  payment_status: "",
  payment_method: "",
  from_date: "",
  to_date: "",
  min_amount: "",
  max_amount: "",
  cursor: "",
};

export const OrdersPage = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [queryFilters, setQueryFilters] = useState(INITIAL_FILTERS);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [activeOrderDetails, setActiveOrderDetails] = useState(null);

  // Search input typing par debounce delay taake har keypress par invalid requests na jayen
  useEffect(() => {
    const handler = setTimeout(() => {
      setQueryFilters((prev) => ({
        ...filters,
        cursor: prev.cursor !== filters.cursor ? filters.cursor : "",
      }));
    }, 400);

    return () => clearTimeout(handler);
  }, [filters]);

  const { data, isLoading, refetch, isFetching } = useOrders(queryFilters);

  const orderStatusOptions = (() => {
    const current = activeOrderDetails?.status;
    if (!current) return orderStatusEnum.options;
    if (activeOrderDetails.payment_method === "CARD" && activeOrderDetails.payment_status !== "PAID") {
      return [current];
    }
    const transitions = {
      PENDING: ["CONFIRMED", "PROCESSING", "SHIPPED", "CANCELLED"],
      CONFIRMED: ["PROCESSING", "SHIPPED", "CANCELLED"],
      PROCESSING: ["SHIPPED", "DELIVERED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };
    return [current, ...(transitions[current] || [])];
  })();

  const paymentStatusOptions = (() => {
    const current = activeOrderDetails?.payment_status;
    if (!current) return paymentStatusEnum.options;
    if (activeOrderDetails.status === "CANCELLED") return [current];
    return ["UNPAID", "PAID"].includes(current)
      ? [...new Set([current, "UNPAID", "PAID"])]
      : [current];
  })();

  const shipmentStatusOptions = (() => {
    const current = activeOrderDetails?.shipments?.[0]?.status;
    if (!current) return shipmentStatusEnum.options;
    const transitions = {
      PROCESSING: ["SHIPPED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
      PENDING_LABEL: [],
    };
    return [current, ...(transitions[current] || [])];
  })();

  const orders = data?.data?.orders || data?.orders || [];
  const nextCursor = data?.data?.next_cursor || data?.next_cursor;
  const hasMore = Boolean(nextCursor);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      cursor: "",
    }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setQueryFilters(INITIAL_FILTERS);
  };

  const handleNextPage = () => {
    if (nextCursor) {
      setFilters((prev) => ({ ...prev, cursor: nextCursor }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Order Management
          </h1>
          <p className="text-sm text-slate-500">
            Monitor, inspect, and update customer store orders
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh Data
        </button>
      </div>

      {/* Filter Bar */}
      <OrdersFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b">
              <tr>
                <th className="px-6 py-3.5">Order Number</th>
                <th className="px-6 py-3.5">Customer / Type</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Payment</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5">Placed At</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-medium text-slate-800">
                        {order.customer?.name || order.guest_details?.name || "Customer"}
                      </div>
                      <div className="text-slate-400">
                        {order.customer?.email || order.guest_details?.email || order.customer_type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.payment_status} />
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(
                        order.placed_at || order.created_at,
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <PermissionGate permission="orders.view">
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </PermissionGate>

                      <PermissionGate permission="orders.cancel">
                        {["PENDING", "CONFIRMED"].includes(order.status) && (
                          <button
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setActiveModal("cancel");
                            }}
                            className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                            title="Cancel Order"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </PermissionGate>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cursor Pagination Controls */}
        <div className="p-4 border-t flex items-center justify-between bg-slate-50 text-xs text-slate-500">
          <span>Showing {orders.length} orders</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              disabled={!filters.cursor}
              className="px-3 py-1.5 border rounded-lg bg-white disabled:opacity-40 hover:bg-slate-100 flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> First Page
            </button>
            <button
              onClick={handleNextPage}
              disabled={!hasMore}
              className="px-3 py-1.5 border rounded-lg bg-white disabled:opacity-40 hover:bg-slate-100 flex items-center gap-1"
            >
              Next Page <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawers & Modals */}
      {selectedOrderId && !activeModal && (
        <OrderDetailsDrawer
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onOpenUpdateModal={(modalType, orderDetails) => {
            setActiveOrderDetails(orderDetails);
            setActiveModal(modalType);
          }}
        />
      )}

      {activeModal === "order" && (
        <UpdateStatusModal
          orderId={selectedOrderId}
          type="order"
          currentStatus={activeOrderDetails?.status}
          options={orderStatusOptions}
          schema={updateOrderStatusSchema}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "payment" && (
        <UpdateStatusModal
          orderId={selectedOrderId}
          type="payment"
          currentStatus={activeOrderDetails?.payment_status}
          options={paymentStatusOptions}
          schema={updatePaymentStatusSchema}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "shipment" && (
        <UpdateStatusModal
          orderId={selectedOrderId}
          type="shipment"
          currentStatus={activeOrderDetails?.shipments?.[0]?.status}
          options={shipmentStatusOptions}
          schema={updateShipmentStatusSchema}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "cancel" && (
        <CancelOrderDialog
          orderId={selectedOrderId}
          orderNumber={
            orders.find((o) => o.id === selectedOrderId)?.order_number
          }
          onClose={() => {
            setActiveModal(null);
            setSelectedOrderId(null);
          }}
        />
      )}
    </div>
  );
};

export default OrdersPage;
