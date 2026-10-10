import { z } from "zod";

const attributeTypes = ["string", "number", "boolean", "enum"];

export const optionsSchema = z
  .array(z.string().trim().min(1, "Option cannot be empty"))
  .min(1, "At least one option is required");

export const attributeRuleSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Attribute name is required")
      .max(100, "Attribute name is too long")
      .transform((value) => value.toLowerCase()),
    label: z
      .string()
      .trim()
      .min(1, "Label is required")
      .max(100, "Label cannot exceed 100 characters"),
    type: z.enum(attributeTypes, {
      errorMap: () => ({ message: "Select a valid attribute type" }),
    }),
    required: z.boolean(),
    options: z.array(z.string().trim()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "enum") {
      const validOptions = data.options?.filter(Boolean) ?? [];
      if (validOptions.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "At least one option is required for enum attributes",
        });
      }
    }

    if (data.type !== "enum" && data.options?.some(Boolean)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Options are only allowed for enum attributes",
      });
    }
  });

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name cannot exceed 100 characters"),
  parent_id: z
    .string()
    .uuid("Invalid parent category")
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),
  description: z
    .string()
    .trim()
    .max(270, "Description cannot exceed 270 characters")
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),
  is_active: z.boolean(),
  attribute_rules: z.array(attributeRuleSchema).optional(),
});

export const updateCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Category name cannot be empty")
      .max(100, "Category name cannot exceed 100 characters")
      .optional(),

    parent_id: z
      .string()
      .uuid("Invalid parent category")
      .nullable()
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val))
      .optional(),
    description: z
      .string()
      .trim()
      .max(270, "Description cannot exceed 270 characters")
      .nullable()
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val))
      .optional(),
    is_active: z.boolean().optional(),
    attribute_rules: z.array(attributeRuleSchema).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const updateAttributeRuleSchema = z
  .object({
    label: z
      .string()
      .trim()
      .min(1, "Label cannot be empty")
      .max(100, "Label cannot exceed 100 characters")
      .optional(),
    type: z
      .enum(attributeTypes, {
        errorMap: () => ({ message: "Invalid attribute type" }),
      })
      .optional(),
    required: z.boolean().optional(),
    options: z
      .array(z.string().trim().min(1, "Option cannot be empty"))
      .min(1, "At least one option is required")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const CATEGORY_ATTRIBUTE_TYPES = attributeTypes;
