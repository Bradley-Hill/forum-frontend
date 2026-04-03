import { ApiError } from "./apiErrors";

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 10000,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError(
        "GATEWAY_TIMEOUT",
        "Server initializing. Please refresh the page in 30 seconds.",
        `Request timeout after ${timeoutMs}ms - server did not respond in time`,
      );
    }

    throw err;
  }
}
