import { X, Package, CreditCard, Truck, User } from "lucide-react";
import { useOrder } from "../hooks/useOrder";
import { useOrderMutations } from "../hooks/useOrderMutations";
import { OrderStatusBadge } from "./OrderStatusBadge";
import PermissionGate from "../../auth/components/PermissionGate.jsx";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export const OrderDetailsDrawer = ({ orderId, onClose, onOpenUpdateModal }) => {
  const { data, isLoading, isError } = useOrder(orderId);
  const { refundOrderMutation } = useOrderMutations();
  const order = data?.order;

  if (!orderId) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Order #{order?.order_number || "..."}</h2>
              <p className="text-xs text-slate-500">Placed at: {order?.placed_at ? new Date(order.placed_at).toLocaleString() : "-"}</p>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-slate-500 text-sm">Loading order details...</div>
          ) : isError || !order ? (
            <div className="py-12 text-center text-rose-500 text-sm">Failed to load order details.</div>
          ) : (
            <div className="mt-6 space-y-6">
              {/* Status Header */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Current Status</p>
                  <OrderStatusBadge status={order.status} />
                </div>
                <PermissionGate permission="orders.edit">
                  <button
                    onClick={() => onOpenUpdateModal("order", order)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
                  >
                    Change Order Status
                  </button>
                </PermissionGate>
              </div>

              {/* Customer Info */}
              <div className="border rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Customer Details</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1 pl-6">
                  <p>Type: <span className="font-medium text-slate-900">{order.customer.id ? "Registered Customer" : "Guest"}</span></p>
                  {order.customer && (
                    <>
                      <p>Name: {order.customer.name}</p>
                      <p>Email: {order.customer.email}</p>
                      <p>Phone: {order.customer.phone || "N/A"}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="border rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Package className="w-4 h-4 text-slate-500" />
                  <span>Items Summary ({order.items_count})</span>
                </div>
                <div className="divide-y text-xs">
                  {order.items?.map((item) => (
                    <div key={item.id} className="py-2.5 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-800">{item.product_name}</p>
                        <p className="text-slate-400">SKU: {item.sku} | Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-slate-900">{formatCurrency(item.total_price)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Shipping Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                      <CreditCard className="w-4 h-4 text-slate-500" />
                      <span>Payment</span>
                    </div>
                    <OrderStatusBadge status={order.payment_status} />
                  </div>
                  <p className="text-xs text-slate-500">Method: {order.payment_method}</p>
                  {order.payment_method !== "CARD" && order.status !== "CANCELLED" && (
                  <PermissionGate permission="orders.update_status">
                    <button
                      onClick={() => onOpenUpdateModal("payment", order)}
                      className="mt-2 text-xs text-indigo-600 hover:underline font-medium"
                    >
                      Update Payment Status
                    </button>
                  </PermissionGate>
                )}
                {order.payment_method === "CARD" && (
                  <p className="text-xs text-slate-500">Card payment status is managed by Stripe.</p>
                )}
                {order.payment_method === "CARD" && order.payment_status === "PAID" && (
                  <PermissionGate permission="orders.update_status">
                    <button
                      type="button"
                      disabled={refundOrderMutation.isPending}
                      onClick={() => {
                        const confirmed = window.confirm(
                          `Issue a full Stripe refund of ${formatCurrency(order.total_amount)} for order ${order.order_number}? Orders not yet shipped will be cancelled and inventory restored.`
                        );
                        if (confirmed) refundOrderMutation.mutate(order.id);
                      }}
                      className="mt-2 text-xs font-semibold text-rose-600 hover:underline disabled:opacity-50"
                    >
                      {refundOrderMutation.isPending ? "Refunding…" : "Issue full refund"}
                    </button>
                  </PermissionGate>
                )}
                </div>

                <div className="border rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                      <Truck className="w-4 h-4 text-slate-500" />
                      <span>Shipment</span>
                    </div>
                    {order.shipments?.[0] && <OrderStatusBadge status={order.shipments[0].status} />}
                  </div>
                  <p className="text-xs text-slate-500">
                    Carrier: {order.shipments?.[0]?.carrier || "N/A"}
                  </p>
                  {order.shipments?.[0] && ["PROCESSING", "SHIPPED"].includes(order.shipments[0].status) && (
                    <PermissionGate permission="orders.update_status">
                      <button
                        onClick={() => onOpenUpdateModal("shipment", order)}
                        className="mt-2 text-xs text-indigo-600 hover:underline font-medium"
                      >
                        Update Shipment Status
                      </button>
                    </PermissionGate>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Financial Totals */}
        {order && (
          <div className="mt-6 pt-4 border-t space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>-{formatCurrency(order.discount_amount)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(order.shipping_cost)}</span></div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};