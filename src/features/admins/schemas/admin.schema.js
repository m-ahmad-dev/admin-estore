import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^[0-9]{7,20}$/.test(value),
    "Phone must contain 7 to 20 digits.",
  );

export const createAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(150, "Name cannot exceed 150 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password cannot exceed 128 characters."),
  phone: phoneSchema,
  permissions: z.array(z.string()),
});

export const permissionsSchema = z.object({
  permissions: z.array(z.string()),
});
