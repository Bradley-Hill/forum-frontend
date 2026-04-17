import type {
  createThreadResponse,
  createThreadRequest,
  threadUpdateRequest,
  threadUpdateResponse,
  ErrorResponse,
  threadsApiResponse,
  threadStickyUpdateResponse,
  threadStickyUpdateRequest,
  threadLockUpdateRequest,
  threadLockUpdateResponse,
} from "../types/api";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { ApiError } from "../utils/apiErrors";

const API_BASE_URL = import.meta.env.VITE_API_URL;

async function handleApiResponse<T>(
  response: Response,
  defaultMessage: string,
): Promise<T> {
  // Handle 204 No Content - successful response with no body
  if (response.status === 204) {
    return undefined as T;
  }

  const json = (await response.json()) as {
    data?: T;
    error?: ErrorResponse;
  };

  if (!response.ok) {
    const errorData = json.error || {
      message: defaultMessage,
      code: "UNKNOWN_ERROR",
    };
    throw new ApiError(
      errorData.code || "UNKNOWN_ERROR",
      errorData.message || defaultMessage,
    );
  }

  return json.data as T;
}

export async function getThreadsApi(
  id: string,
  page: number,
  pageSize: number,
): Promise<threadsApiResponse> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/categories/${id}/threads?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
      10000,
    );
    return await handleApiResponse<threadsApiResponse>(
      response,
      "Failed to fetch threads",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to fetch threads");
  }
}

export async function createThreadApi(
  request: createThreadRequest,
  csrfToken?: string,
): Promise<createThreadResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
    const response = await fetchWithAuth(
      `${API_BASE_URL}/threads`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(request),
        credentials: "include",
      },
      10000,
    );
    return await handleApiResponse<createThreadResponse>(
      response,
      "Failed to create thread",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to create thread");
  }
}

export async function updateThreadApi(
  id: string,
  request: threadUpdateRequest,
  csrfToken?: string,
): Promise<threadUpdateResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
    const response = await fetchWithAuth(
      `${API_BASE_URL}/threads/${id}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(request),
        credentials: "include",
      },
      10000,
    );
    return await handleApiResponse<threadUpdateResponse>(
      response,
      "Failed to update thread",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to update thread");
  }
}

export async function threadLockUpdateApi(
  id: string,
  request: threadLockUpdateRequest,
  csrfToken?: string,
): Promise<threadLockUpdateResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
    const response = await fetchWithAuth(
      `${API_BASE_URL}/threads/${id}/lock`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(request),
        credentials: "include",
      },
      10000,
    );
    return await handleApiResponse<threadLockUpdateResponse>(
      response,
      "Failed to lock/unlock thread",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to lock/unlock thread");
  }
}

export async function threadStickyUpdateApi(
  id: string,
  request: threadStickyUpdateRequest,
  csrfToken?: string,
): Promise<threadStickyUpdateResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
    const response = await fetchWithAuth(
      `${API_BASE_URL}/threads/${id}/sticky`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(request),
        credentials: "include",
      },
      10000,
    );
    return await handleApiResponse<threadStickyUpdateResponse>(
      response,
      "Failed to update thread sticky status",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      "UNKNOWN_ERROR",
      "Failed to update thread sticky status",
    );
  }
}

export async function deleteThreadApi(
  id: string,
  csrfToken?: string,
): Promise<void> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
    const response = await fetchWithAuth(
      `${API_BASE_URL}/threads/${id}`,
      {
        method: "DELETE",
        headers,
        credentials: "include",
      },
      10000,
    );
    await handleApiResponse<void>(response, "Thread deletion failed");
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Thread deletion failed");
  }
}

export async function getThreadDetailsApi(
  id: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<threadsApiResponse["data"]> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/threads/${id}?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
      10000,
    );
    return await handleApiResponse<threadsApiResponse["data"]>(
      response,
      "Failed to fetch thread details",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to fetch thread details");
  }
}
