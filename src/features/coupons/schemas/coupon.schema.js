import { z } from "zod";

export const COUPON_TYPES = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
};

const parseNum = (value) => {
  if (value === "" || value == null) {
    return undefined;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isNaN(parsed) ? value : parsed;
  }

  return value;
};

const optionalNumber = z.preprocess(parseNum, z.number().optional());

const optionalPositiveNumber = z.preprocess(
  parseNum,
  z.number().positive("Maximum discount must be greater than 0").optional(),
);

const optionalNonNegativeNumber = z.preprocess(
  parseNum,
  z.number().min(0, "Value cannot be negative").optional(),
);

const optionalPositiveInteger = z.preprocess(
  parseNum,
  z
    .number()
    .int("Maximum uses must be a whole number")
    .positive("Maximum uses must be greater than 0")
    .optional(),
);

const optionalDate = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.coerce.date().optional(),
);

const couponObjectSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Coupon code must be at least 3 characters")
    .max(50, "Coupon code cannot exceed 50 characters")
    .regex(
      /^[A-Z0-9_]+$/i,
      "Coupon code must contain only letters, numbers and underscores",
    ),

  type: z.enum([COUPON_TYPES.PERCENTAGE, COUPON_TYPES.FIXED], {
    errorMap: () => ({
      message: "Please select a coupon type",
    }),
  }),

  value: optionalNumber,

  min_order_value: optionalNonNegativeNumber,

  max_discount: optionalPositiveNumber,

  max_uses: optionalPositiveInteger,

  is_active: z.boolean().default(true),

  starts_at: optionalDate,

  expires_at: optionalDate,
});

const validateCouponRules = (data, ctx, isUpdate = false) => {
  /*
   * CREATE REQUIRED FIELDS
   */
  if (!isUpdate) {
    if (!data.code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["code"],
        message: "Coupon code is required",
      });
    }

    if (!data.type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["type"],
        message: "Please select a coupon type",
      });
    }

    if (data.value === undefined || data.value === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value"],
        message: "Value is required",
      });
    }
  }

  /*
   * VALUE
   */
  if (data.value != null) {
    if (data.type === COUPON_TYPES.PERCENTAGE) {
      if (!Number.isInteger(data.value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["value"],
          message: "Percentage must be a whole number",
        });
      }

      if (data.value < 1 || data.value > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["value"],
          message: "Percentage must be between 1 and 100",
        });
      }
    }

    if (data.type === COUPON_TYPES.FIXED) {
      if (data.value <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["value"],
          message: "Fixed discount must be greater than 0",
        });
      }
    }
  }

  /*
   * MAX DISCOUNT
   *
   * Allowed only for percentage coupons.
   */
  if (data.type === COUPON_TYPES.FIXED && data.max_discount != null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["max_discount"],
      message: "Maximum discount is only allowed for percentage coupons",
    });
  }

  /*
   * DATES
   */
  if (data.starts_at && data.expires_at) {
    const start = new Date(data.starts_at);
    const expire = new Date(data.expires_at);

    if (
      !Number.isNaN(start.getTime()) &&
      !Number.isNaN(expire.getTime()) &&
      start > expire
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expires_at"],
        message:
          "Expiration date must be greater than or equal to the start date",
      });
    }
  }

  /*
   * EXPIRATION MUST BE IN FUTURE
   */
  if (data.expires_at) {
    const expire = new Date(data.expires_at);

    if (!Number.isNaN(expire.getTime()) && expire <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expires_at"],
        message: "Expiration date must be in the future",
      });
    }
  }
};

export const createCouponSchema = couponObjectSchema.superRefine(
  (data, ctx) => {
    validateCouponRules(data, ctx, false);
  },
);

/*
 * IMPORTANT:
 *
 * Do NOT use:
 *
 * couponObjectSchema.partial()
 *
 * after superRefine/refinements.
 *
 * This avoids the Zod error:
 * ".partial() cannot be used on object schemas containing refinements"
 */
export const updateCouponBaseSchema = couponObjectSchema.partial();

export const updateCouponSchema = updateCouponBaseSchema.superRefine(
  (data, ctx) => {
    validateCouponRules(data, ctx, true);
  },
);

/*
 * Form uses CREATE schema.
 */
export const couponSchema = createCouponSchema;

export const defaultCouponValues = {
  code: "",
  type: COUPON_TYPES.PERCENTAGE,
  value: "",
  min_order_value: "",
  max_discount: "",
  max_uses: "",
  is_active: true,
  starts_at: "",
  expires_at: "",
};

export const isoToDatetimeLocal = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (number) => String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const normalizeCouponPayload = (values) => {
  const payload = {
    code: values.code?.trim().toUpperCase(),
    type: values.type,
    value: Number(values.value),
    is_active: Boolean(values.is_active),
  };

  const isPresent = (value) => value !== "" && value != null;

  if (isPresent(values.min_order_value)) {
    payload.min_order_value = Number(values.min_order_value);
  }

  if (
    values.type === COUPON_TYPES.PERCENTAGE &&
    isPresent(values.max_discount)
  ) {
    payload.max_discount = Number(values.max_discount);
  }

  if (isPresent(values.max_uses)) {
    payload.max_uses = Number(values.max_uses);
  }

  if (isPresent(values.starts_at)) {
    payload.starts_at = new Date(values.starts_at).toISOString();
  }

  if (isPresent(values.expires_at)) {
    payload.expires_at = new Date(values.expires_at).toISOString();
  }

  return payload;
};
