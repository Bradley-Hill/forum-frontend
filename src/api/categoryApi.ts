import type {
  categoryRequest,
  categoryResponse,
  categoryUpdateRequest,
  categoryUpdateResponse,
  categoryThreadsResponse,
  categoriesListResponse,
  ErrorResponse,
} from "../types/api";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function createCategoryApi(
  name: string,
  description: string,
  csrfToken?: string,
): Promise<categoryResponse> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }
  const response = await fetchWithAuth(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name, description } as categoryRequest),
    credentials: "include",
  }, 10000);

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
  csrfToken?: string,
): Promise<categoryUpdateResponse> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }
  const response = await fetchWithAuth(`${API_BASE_URL}/categories/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ name, description } as categoryUpdateRequest),
    credentials: "include",
  }, 10000);

  const json = (await response.json()) as {
    data?: categoryUpdateResponse;
    error?: ErrorResponse;
  };

  if (!response.ok) {
    throw new Error(json.error?.message || "Category update failed");
  }

  return json.data as categoryUpdateResponse;
}

export async function deleteCategoryApi(id: string, csrfToken?: string): Promise<void> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }
  const response = await fetchWithAuth(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers,
    credentials: "include",
  }, 10000);

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
): Promise<categoryThreadsResponse["data"]> {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/categories/${id}/threads?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
    10000
  );

  const json = (await response.json()) as {
    data?: categoryThreadsResponse["data"];
    error?: ErrorResponse;
  };

  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to fetch category threads");
  }

  return json.data as categoryThreadsResponse["data"];
}

export async function getCategoriesApi(): Promise<categoriesListResponse['data']> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/categories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  }, 10000);

  const json = (await response.json()) as {
    data?: categoriesListResponse["data"];
    error?: ErrorResponse;
  };

  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to fetch categories");
  }

  return json.data as categoriesListResponse["data"];
}
