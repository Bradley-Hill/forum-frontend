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
import { ApiError } from "../utils/apiErrors";

const API_BASE_URL = import.meta.env.VITE_API_URL;

async function handleApiResponse<T>(
  response: Response,
  defaultMessage: string,
): Promise<T> {
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

export async function createCategoryApi(
  name: string,
  description: string,
  csrfToken?: string,
): Promise<categoryResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
    const response = await fetchWithAuth(
      `${API_BASE_URL}/categories`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ name, description } as categoryRequest),
        credentials: "include",
      },
      10000,
    );

    return await handleApiResponse<categoryResponse>(
      response,
      "Category creation failed",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Category creation failed");
  }
}

export async function updateCategoryApi(
  id: string,
  name?: string,
  description?: string,
  csrfToken?: string,
): Promise<categoryUpdateResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
    const response = await fetchWithAuth(
      `${API_BASE_URL}/categories/${id}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ name, description } as categoryUpdateRequest),
        credentials: "include",
      },
      10000,
    );

    return await handleApiResponse<categoryUpdateResponse>(
      response,
      "Category update failed",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Category update failed");
  }
}

export async function deleteCategoryApi(
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
      `${API_BASE_URL}/categories/${id}`,
      {
        method: "DELETE",
        headers,
        credentials: "include",
      },
      10000,
    );

    await handleApiResponse<void>(response, "Category deletion failed");
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Category deletion failed");
  }
}

export async function updateCategoryPositionApi(
  id: string,
  position: number,
  csrfToken?: string,
): Promise<categoriesListResponse["data"]> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
    const response = await fetchWithAuth(
      `${API_BASE_URL}/categories/${id}/position`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ position }),
        credentials: "include",
      },
      10000,
    );

    return await handleApiResponse<categoriesListResponse["data"]>(
      response,
      "Category reorder failed",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Category reorder failed");
  }
}

export async function getCategoryThreadsApi(
  id: string,
  page?: number,
  pageSize?: number,
): Promise<categoryThreadsResponse["data"]> {
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

    return await handleApiResponse<categoryThreadsResponse["data"]>(
      response,
      "Failed to fetch category threads",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to fetch category threads");
  }
}

export async function getCategoriesApi(): Promise<
  categoriesListResponse["data"]
> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/categories`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
      10000,
    );

    return await handleApiResponse<categoriesListResponse["data"]>(
      response,
      "Failed to fetch categories",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to fetch categories");
  }
}
