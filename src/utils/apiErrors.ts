export interface ApiErrorDetails {
  code: string;
  message: string;
  details?: string;
}

export class ApiError extends Error {
  code: string;
  details?: string;

  constructor(code: string, message: string, details?: string) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "ApiError";
  }

  toJSON(): ApiErrorDetails {
    return {
      code: this.code,
      message: this.message,
      ...(this.details && { details: this.details }),
    };
  }
}

export function parseErrorResponse(
  status: number,
  body: unknown,
): ApiErrorDetails {
  if (body && typeof body === "object" && "error" in body) {
    const error = body.error as Record<string, unknown>;
    return {
      code: (error.code as string) || "UNKNOWN_ERROR",
      message: (error.message as string) || "An error occurred",
      details: error.details as string | undefined,
    };
  }

  // Fallback for HTTP status codes
  if (status === 404) {
    return {
      code: "NOT_FOUND",
      message: "Resource not found",
    };
  }

  if (status === 429) {
    return {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Please try again later.",
    };
  }

  if (status === 500) {
    return {
      code: "SERVER_ERROR",
      message: "Server error - please try again later",
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred",
  };
}
