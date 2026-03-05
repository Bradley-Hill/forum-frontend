import type {
  getUserResponse,
  updateUserRequest,
  updateUserResponse,
  
  ErrorResponse,
} from "../types/api";

const API_BASE_URL = "https://api.bradley-hill.com/api";

export async function getUserApi(username: string): Promise<getUserResponse> {
  const response = await fetch(`${API_BASE_URL}/users/${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }
  const json = (await response.json()) as {
    data?: getUserResponse;
    error?: ErrorResponse;
  };
  return json.data as getUserResponse;
}

export async function updateUserApi(
  username: string,
  request: updateUserRequest,
): Promise<updateUserResponse> {
  const response = await fetch(`${API_BASE_URL}/users/${username}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }
  const json = (await response.json()) as {
    data?: updateUserResponse;
    error?: ErrorResponse;
  };
  return json.data as updateUserResponse;
}

export async function deleteUserApi(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }
  return;
}
