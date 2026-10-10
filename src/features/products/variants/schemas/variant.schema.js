import { z } from "zod";

/* ================================================================
   SHARED FIELD SCHEMAS
================================================================ */

const skuSchema = z
  .string()
  .trim()
  .max(100, "SKU cannot exceed 100 characters.")
  .optional()
  .or(z.literal(""));

const weightSchema = z.coerce
  .number()
  .min(0, "Weight cannot be negative.")
  .refine((value) => Number(value.toFixed(2)) === value, {
    message: "Weight cannot have more than 2 decimal places.",
  });

const priceSchema = z.coerce
  .number()
  .min(0, "Price cannot be negative.")
  .refine((value) => Number(value.toFixed(2)) === value, {
    message: "Price cannot have more than 2 decimal places.",
  });

/* ================================================================
   CREATE VARIANT
================================================================ */

export const variantCreateSchema = z
  .object({
    attributes: z
      .record(z.string(), z.any())
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one variant attribute is required.",
      }),

    sku: skuSchema,

    weight: weightSchema,

    price: priceSchema,

    stock_quantity: z.coerce
      .number()
      .int("Stock quantity must be a whole number.")
      .min(0, "Stock quantity cannot be negative."),

    reserved_quantity: z.coerce
      .number()
      .int("Reserved quantity must be a whole number.")
      .min(0, "Reserved quantity cannot be negative.")
      .default(0),

    reorder_level: z.coerce
      .number()
      .int("Reorder level must be a whole number.")
      .min(0, "Reorder level cannot be negative.")
      .default(5),
  })
  .refine((data) => data.reserved_quantity <= data.stock_quantity, {
    message: "Reserved quantity cannot exceed stock quantity.",
    path: ["reserved_quantity"],
  });

/* ================================================================
   UPDATE VARIANT

   Backend:
   PATCH /admin/products/:productId/variants/:variantId

   Allowed:
   - sku
   - weight
   - price

   NOT allowed:
   - attributes
   - stock_quantity
   - reserved_quantity
   - reorder_level
================================================================ */

export const variantUpdateSchema = z
  .object({
    sku: skuSchema,

    weight: weightSchema.optional(),

    price: priceSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update.",
  });

/* ================================================================
   STOCK
================================================================ */

export const variantStockSchema = z.discriminatedUnion("operation", [
  z.object({
    operation: z.literal("stock.set"),

    stock_quantity: z.coerce
      .number()
      .int("Stock quantity must be a whole number.")
      .min(0, "Stock quantity cannot be negative."),

    reserved_quantity: z.coerce
      .number()
      .int("Reserved quantity must be a whole number.")
      .min(0, "Reserved quantity cannot be negative."),

    reorder_level: z.coerce
      .number()
      .int("Reorder level must be a whole number.")
      .min(0, "Reorder level cannot be negative."),
  }),

  ...[
    "stock.add",
    "stock.reduce",
    "stock.reserve",
    "reserved_stock.release",
    "reserved_stock.confirm",
  ].map((operation) =>
    z.object({
      operation: z.literal(operation),

      quantity: z.coerce
        .number()
        .int("Quantity must be a whole number.")
        .positive("Quantity must be greater than zero."),
    }),
  ),
]);

/* ================================================================
   CREATE DEFAULT VALUES
================================================================ */

export const variantDefaultValues = {
  attributes: {},
  sku: "",
  weight: "",
  price: "",
  stock_quantity: 0,
  reserved_quantity: 0,
  reorder_level: 5,
};
