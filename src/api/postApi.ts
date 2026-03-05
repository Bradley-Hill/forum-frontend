import type { postCreateRequest,postCreateResponse,ErrorResponse } from "../types/api";

const API_BASE_URL = "https://api.bradley-hill.com/api";

export async function createPostApi(request: postCreateRequest): Promise<postCreateResponse> {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }

  const json = (await response.json()) as { data?: postCreateResponse; error?: ErrorResponse };
  return json.data as postCreateResponse;
}

export async function updatePostApi(id: string, content: string): Promise<postCreateResponse> {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }

  const json = (await response.json()) as { data?: postCreateResponse; error?: ErrorResponse };
  return json.data as postCreateResponse;
}

export async function deletePostApi(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }
}
