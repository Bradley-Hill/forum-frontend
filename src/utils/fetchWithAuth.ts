import { fetchWithTimeout } from "./fetchWithTimeout";
import { refreshTokenApi } from "../api/authApi";
import type { TokenUpdater } from "../types/api";

let tokenUpdater: TokenUpdater | null = null;

export function registerTokenRefreshHandler(fn: TokenUpdater): void {
  tokenUpdater = fn;
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 10000,
): Promise<Response> {
  const response = await fetchWithTimeout(url, options, timeoutMs);

  if (response.status !== 401) {
    return response;
  }

  try {
    const refreshData = await refreshTokenApi();

    if (tokenUpdater) {
      tokenUpdater(refreshData.csrfToken);
    }

    const retryHeaders: Record<string, string> = {
      ...((options.headers as Record<string, string>) ?? {}),
      "X-CSRF-Token": refreshData.csrfToken,
    };

    return fetchWithTimeout(url, { ...options, headers: retryHeaders }, timeoutMs);
  } catch {
    return response;
  }
}
