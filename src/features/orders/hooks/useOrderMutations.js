import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  updateOrderStatusApi,
  updateOrderPaymentStatusApi,
  updateOrderShipmentStatusApi,
  cancelOrderAdminApi,
  refundOrderApi,
} from "../api/orders.api";

export const useOrderMutations = () => {
  const queryClient = useQueryClient();

  const invalidateOrderQueries = (orderId) => {
    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    if (orderId) {
      queryClient.invalidateQueries({ queryKey: ["admin-order", orderId] });
    }
  };

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatusApi,
    onSuccess: (res, variables) => {
      toast.success(res.message || "Order status updated successfully");
      invalidateOrderQueries(variables.id);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error?.message || "Failed to update order status",
      );
    },
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: updateOrderPaymentStatusApi,
    onSuccess: (res, variables) => {
      toast.success(res.message || "Payment status updated successfully");
      invalidateOrderQueries(variables.id);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error?.message || "Failed to update payment status",
      );
    },
  });

  const updateShipmentStatusMutation = useMutation({
    mutationFn: updateOrderShipmentStatusApi,
    onSuccess: (res, variables) => {
      toast.success(res.message || "Shipment status updated successfully");
      invalidateOrderQueries(variables.id);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error?.message ||
          "Failed to update shipment status",
      );
    },
  });

  const refundOrderMutation = useMutation({
    mutationFn: refundOrderApi,
    onSuccess: (res, orderId) => {
      toast.success(res.message || "Payment refunded successfully");
      if (res.warnings?.length) {
        res.warnings.forEach((warning) => toast.warning(warning));
      }
      invalidateOrderQueries(orderId);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || err.response?.data?.message || "Failed to refund payment");
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: cancelOrderAdminApi,
    onSuccess: (res, variables) => {
      toast.success(res.message || "Order cancelled successfully");
      if (res.warnings?.length) {
        res.warnings.forEach((warn) => toast.warning(warn));
      }
      invalidateOrderQueries(variables);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error?.message || "Failed to cancel order",
      );
    },
  });

  return {
    updateStatusMutation,
    updatePaymentStatusMutation,
    updateShipmentStatusMutation,
    cancelOrderMutation,
    refundOrderMutation,
  };
};
