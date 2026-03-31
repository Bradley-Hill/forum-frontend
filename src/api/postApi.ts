import type {
  postCreateRequest,
  postCreateResponse,
  ErrorResponse,
} from "../types/api";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function createPostApi(
  request: postCreateRequest,
  csrfToken?: string,
): Promise<postCreateResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }
  const response = await fetchWithAuth(
    `${API_BASE_URL}/posts`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(request),
      credentials: "include",
    },
    10000,
  );

  const json = (await response.json()) as {
    data?: postCreateResponse;
    error?: ErrorResponse;
  };
  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to create post");
  }

  return json.data as postCreateResponse;
}

export async function updatePostApi(
  id: string,
  content: string,
  csrfToken?: string,
): Promise<postCreateResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }
  const response = await fetchWithAuth(
    `${API_BASE_URL}/posts/${id}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({ content }),
      credentials: "include",
    },
    10000,
  );

  const json = (await response.json()) as {
    data?: postCreateResponse;
    error?: ErrorResponse;
  };
  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to update post");
  }

  return json.data as postCreateResponse;
}

export async function deletePostApi(
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
    `${API_BASE_URL}/posts/${id}`,
    {
      method: "DELETE",
      headers,
      credentials: "include",
    },
    10000,
  );

  if (!response.ok) {
    const json = (await response.json()) as { error?: ErrorResponse };
    throw new Error(json.error?.message || "Failed to delete post");
  }
}
