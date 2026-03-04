import type {
  categoryRequest,
  categoryResponse,
  categoryUpdateRequest,
  categoryUpdateResponse,
  categoryThreadsResponse,
  ErrorResponse,
} from "../types/api";

const API_BASE_URL = "https://api.bradley-hill.com/api";

export async function createCategoryApi(
  name: string,
  description: string,
): Promise<categoryResponse> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description } as categoryRequest),
  });

  const json = (await response.json()) as {
    data?: categoryResponse;
    error?: ErrorResponse;
  };

  if (!response.ok) {
    throw new Error(json.error?.message || "Category creation failed");
  }

  return json.data as categoryResponse;
}

export async function updateCategoryApi(
  id: string,
  name?: string,
  description?: string,
): Promise<categoryUpdateResponse> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description } as categoryUpdateRequest),
  });

  const json = (await response.json()) as {
    data?: categoryUpdateResponse;
    error?: ErrorResponse;
  };

  if (!response.ok) {
    throw new Error(json.error?.message || "Category update failed");
  }

  return json.data as categoryUpdateResponse;
}

export async function deleteCategoryApi(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const json = (await response.json()) as { error?: ErrorResponse };
    throw new Error(json.error?.message || "Category deletion failed");
  }
  return;
}

export async function getCategoryThreadsApi(
  id: string,
  page?: number,
  pageSize?: number,
): Promise<categoryThreadsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/categories/${id}/threads?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  const json = (await response.json()) as {
    data?: categoryThreadsResponse;
    error?: ErrorResponse;
  };

  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to fetch category threads");
  }

  return json.data as categoryThreadsResponse;
}
