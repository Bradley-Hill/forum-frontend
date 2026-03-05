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

const API_BASE_URL = "https://api.bradley-hill.com/api";

export async function getThreadsApi(
  id: string,
  page: number,
  pageSize: number,
): Promise<threadsApiResponse> {
  const response = await fetch(
    `${API_BASE_URL}/categories/${id}/threads?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );
  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }
  const json = (await response.json()) as {
    data?: threadsApiResponse;
    error?: ErrorResponse;
  };
  return json.data as threadsApiResponse;
}

export async function createThreadApi(
  request: createThreadRequest,
): Promise<createThreadResponse> {
  const response = await fetch(`${API_BASE_URL}/threads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }
  const json = (await response.json()) as {
    data?: createThreadResponse;
    error?: ErrorResponse;
  };
  return json.data as createThreadResponse;
}

export async function updateThreadApi(
  id: string,
  request: threadUpdateRequest,
): Promise<threadUpdateResponse> {
  const response = await fetch(`${API_BASE_URL}/threads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }
  const json = (await response.json()) as {
    data?: threadUpdateResponse;
    error?: ErrorResponse;
  };
  return json.data as threadUpdateResponse;
}

export async function threadLockUpdateApi(id: string, request: threadLockUpdateRequest): Promise<threadLockUpdateResponse> {
  const response = await fetch(`${API_BASE_URL}/threads/${id}/lock`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }
  const json = (await response.json()) as {
    data?: threadLockUpdateResponse;
    error?: ErrorResponse;
  };
  return json.data as threadLockUpdateResponse;
}

export async function threadStickyUpdateApi(id: string, request: threadStickyUpdateRequest): Promise<threadStickyUpdateResponse> {
  const response = await fetch(`${API_BASE_URL}/threads/${id}/sticky`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }
  const json = (await response.json()) as {
    data?: threadStickyUpdateResponse;
    error?: ErrorResponse;
  };
  return json.data as threadStickyUpdateResponse;
}

export async function deleteThreadApi(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/threads/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const json = (await response.json()) as { error?: ErrorResponse };
    throw new Error(json.error?.message || "Thread deletion failed");
  }
  return;
}