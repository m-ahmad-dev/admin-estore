import { z } from "zod";

export const updateCustomerSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(150, "First name cannot exceed 150 characters"),

  lastname: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(150, "Last name cannot exceed 150 characters"),

  email: z.string().trim().email("Enter a valid email address"),

  phone: z
    .union([
      z
        .string()
        .trim()
        .regex(/^[0-9]{7,20}$/, "Phone must contain 7–20 digits"),
      z.literal(""),
    ])
    .nullable(),
});

export const customerStatusSchema = z.object({
  status: z.enum(["active", "deactive"]),
});
