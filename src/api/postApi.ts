import type {
  postCreateRequest,
  postCreateResponse,
  ErrorResponse,
} from "../types/api";
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

export async function createPostApi(
  request: postCreateRequest,
  csrfToken?: string,
): Promise<postCreateResponse> {
  try {
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

    return await handleApiResponse<postCreateResponse>(
      response,
      "Failed to create post",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to create post");
  }
}

export async function updatePostApi(
  id: string,
  content: string,
  csrfToken?: string,
): Promise<postCreateResponse> {
  try {
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

    return await handleApiResponse<postCreateResponse>(
      response,
      "Failed to update post",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to update post");
  }
}

export async function deletePostApi(
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
      `${API_BASE_URL}/posts/${id}`,
      {
        method: "DELETE",
        headers,
        credentials: "include",
      },
      10000,
    );

    await handleApiResponse<void>(response, "Failed to delete post");
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to delete post");
  }
}
