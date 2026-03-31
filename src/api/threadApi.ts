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

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getThreadsApi(
  id: string,
  page: number,
  pageSize: number,
): Promise<threadsApiResponse> {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/categories/${id}/threads?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
    10000,
  );
  const json = (await response.json()) as {
    data?: threadsApiResponse;
    error?: ErrorResponse;
  };
  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to fetch threads");
  }
  return json.data as threadsApiResponse;
}

export async function createThreadApi(
  request: createThreadRequest,
  csrfToken?: string,
): Promise<createThreadResponse> {
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
  const json = (await response.json()) as {
    data?: createThreadResponse;
    error?: ErrorResponse;
  };
  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to create thread");
  }
  return json.data as createThreadResponse;
}

export async function updateThreadApi(
  id: string,
  request: threadUpdateRequest,
  csrfToken?: string,
): Promise<threadUpdateResponse> {
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
  const json = (await response.json()) as {
    data?: threadUpdateResponse;
    error?: ErrorResponse;
  };
  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to update thread");
  }
  return json.data as threadUpdateResponse;
}

export async function threadLockUpdateApi(
  id: string,
  request: threadLockUpdateRequest,
  csrfToken?: string,
): Promise<threadLockUpdateResponse> {
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
  const json = (await response.json()) as {
    data?: threadLockUpdateResponse;
    error?: ErrorResponse;
  };
  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to lock/unlock thread");
  }
  return json.data as threadLockUpdateResponse;
}

export async function threadStickyUpdateApi(
  id: string,
  request: threadStickyUpdateRequest,
  csrfToken?: string,
): Promise<threadStickyUpdateResponse> {
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
  const json = (await response.json()) as {
    data?: threadStickyUpdateResponse;
    error?: ErrorResponse;
  };
  if (!response.ok) {
    throw new Error(
      json.error?.message || "Failed to update thread sticky status",
    );
  }
  return json.data as threadStickyUpdateResponse;
}

export async function deleteThreadApi(
  id: string,
  csrfToken?: string,
): Promise<void> {
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

  if (!response.ok) {
    const json = (await response.json()) as { error?: ErrorResponse };
    throw new Error(json.error?.message || "Thread deletion failed");
  }
  return;
}

export async function getThreadDetailsApi(
  id: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<threadsApiResponse["data"]> {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/threads/${id}?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
    10000,
  );
  const json = (await response.json()) as {
    data?: threadsApiResponse["data"];
    error?: ErrorResponse;
  };
  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to fetch thread details");
  }
  return json.data as threadsApiResponse["data"];
}
