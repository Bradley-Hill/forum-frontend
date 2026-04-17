import type {
  getMeResponse,
  getUserResponse,
  getUserThreadsResponse,
  updateUserRequest,
  updateUserResponse,
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

export async function getMeApi(): Promise<getMeResponse["data"]> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/users/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
      10000,
    );
    return await handleApiResponse<getMeResponse["data"]>(
      response,
      "Failed to fetch user profile",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to fetch user profile");
  }
}

export async function getUserApi(username: string): Promise<getUserResponse> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/users/${username}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
      10000,
    );
    const json = await handleApiResponse<getUserResponse["data"]>(
      response,
      "Failed to fetch user",
    );
    return { data: json } as getUserResponse;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to fetch user");
  }
}

export async function getUserThreadsApi(
  username: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<getUserThreadsResponse["data"]> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/users/${username}/threads?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
      10000,
    );
    return await handleApiResponse<getUserThreadsResponse["data"]>(
      response,
      "Failed to fetch user threads",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to fetch user threads");
  }
}

export async function updateUserApi(
  request: updateUserRequest,
  csrfToken?: string,
): Promise<updateUserResponse["data"]> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
    const response = await fetchWithAuth(
      `${API_BASE_URL}/users/me`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(request),
        credentials: "include",
      },
      10000,
    );
    return await handleApiResponse<updateUserResponse["data"]>(
      response,
      "Failed to update user",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to update user");
  }
}

export async function deleteUserApi(csrfToken?: string): Promise<void> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
    const response = await fetchWithAuth(
      `${API_BASE_URL}/users/me`,
      {
        method: "DELETE",
        headers,
        credentials: "include",
      },
      10000,
    );
    await handleApiResponse<void>(response, "Failed to delete user");
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to delete user");
  }
}

export async function uploadAvatarApi(
  file: File,
  csrfToken?: string,
): Promise<{ avatar_url: string }> {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const headers: Record<string, string> = {};
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }

    const response = await fetchWithAuth(
      `${API_BASE_URL}/users/me/avatar`,
      {
        method: "POST",
        headers,
        body: formData,
        credentials: "include",
      },
      30000,
    );

    return await handleApiResponse<{ avatar_url: string }>(
      response,
      "Failed to upload avatar",
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Failed to upload avatar");
  }
}
