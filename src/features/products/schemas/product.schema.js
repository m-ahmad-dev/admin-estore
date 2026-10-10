import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(255, "Product name cannot exceed 255 characters"),
  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional()
    .or(z.literal("")),
  category_id: z.string().min(1, "Please select a category"),
  base_price: z.coerce
    .number({ invalid_type_error: "Base price must be a number" })
    .min(0, "Base price cannot be negative"),
  is_active: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema;

export const productDefaultValues = {
  name: "",
  description: "",
  category_id: "",
  base_price: "",
  is_active: true,
};