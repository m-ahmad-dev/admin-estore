/**
 * Returns the most useful message available from an API error.
 *
 * Supports both:
 *
 * Normalized frontend error:
 *   error.message
 *
 * Raw Axios error:
 *   error.response.data.error.message
 *
 * Backend error:
 * {
 *   success: false,
 *   error: {
 *     code: "...",
 *     message: "...",
 *     details: []
 *   }
 * }
 */
export const getApiErrorMessage = (
  error,
  defaultMessage = "Something went wrong",
) => {
  const backendData = error?.response?.data;

  if (import.meta.env.DEV && error) {
    console.error("🔥 Backend Trace Log:", {
      status: error.response?.status,
      backendData,
      rawError: error,
    });
  }

  let extracted =
    backendData?.message ||
    backendData?.error ||
    error?.message ||
    defaultMessage;

  // Agar backend ka message khud ek object/array ho ({ code, message, stack })
  if (typeof extracted === "object" && extracted !== null) {
    extracted =
      extracted.message || extracted.error || JSON.stringify(extracted);
  }

  return String(extracted);
};

/**
 * Converts an Axios error into a predictable frontend API error.
 *
 * The original Axios error is preserved through `originalError`
 * so debugging information is not lost.
 */
export function normalizeApiError(error) {
  const response = error?.response;
  const responseData = response?.data;
  const apiError = responseData?.error;

  const normalizedError = new Error(
    apiError?.message ||
      responseData?.message ||
      error?.message ||
      "Something went wrong.",
  );

  normalizedError.name = "ApiError";
  normalizedError.status = response?.status ?? null;
  normalizedError.code = apiError?.code ?? null;
  normalizedError.details = apiError?.details ?? [];
  normalizedError.response = response ?? null;
  normalizedError.originalError = error;

  return normalizedError;
}
