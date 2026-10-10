import { z } from "zod";

export const orderStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export const paymentStatusEnum = z.enum([
  "UNPAID",
  "PAID",
  "REFUNDED",
  "CANCELLED",
]);

export const shipmentStatusEnum = z.enum([
  "PENDING_LABEL",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
});

export const updatePaymentStatusSchema = z.object({
  status: paymentStatusEnum,
});

export const updateShipmentStatusSchema = z.object({
  status: shipmentStatusEnum,
});

export const orderFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  payment_status: z.string().optional(),
  payment_method: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  min_amount: z.string().optional(),
  max_amount: z.string().optional(),
});
