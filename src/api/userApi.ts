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

// const API_BASE_URL = "https://api.bradley-hill.com/api"; // Production
const API_BASE_URL = "http://localhost:3000/api"; // Development

export async function getMeApi(): Promise<getMeResponse["data"]> {
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
  const json = (await response.json()) as {
    data?: getMeResponse["data"];
    error?: ErrorResponse;
  };
  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to fetch user profile");
  }
  return json.data as getMeResponse["data"];
}

export async function getUserApi(username: string): Promise<getUserResponse> {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/users/${username}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
    10000,
  );
  const json = (await response.json()) as {
    data?: getUserResponse["data"];
    error?: ErrorResponse;
  };
  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to fetch user");
  }
  return json as getUserResponse;
}

export async function getUserThreadsApi(
  username: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<getUserThreadsResponse["data"]> {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/users/${username}/threads?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
    10000,
  );
  const json = (await response.json()) as {
    data?: getUserThreadsResponse["data"];
    error?: ErrorResponse;
  };
  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to fetch user threads");
  }
  return json.data as getUserThreadsResponse["data"];
}

export async function updateUserApi(
  request: updateUserRequest,
  csrfToken?: string,
): Promise<updateUserResponse["data"]> {
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
  const json = (await response.json()) as {
    data?: updateUserResponse["data"];
    error?: ErrorResponse;
  };
  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to update user");
  }
  return json.data as updateUserResponse["data"];
}

export async function deleteUserApi(csrfToken?: string): Promise<void> {
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
  const json = (await response.json()) as {
    error?: ErrorResponse;
  };
  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to delete user");
  }
  return;
}
