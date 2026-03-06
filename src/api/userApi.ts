import type {
  getMeResponse,
  getUserResponse,
  updateUserRequest,
  updateUserResponse,
  ErrorResponse,
} from "../types/api";

const API_BASE_URL = "https://api.bradley-hill.com/api";

export async function getMeApi(accessToken: string): Promise<getMeResponse['data']> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }
  const json = (await response.json()) as {
    data?: getMeResponse['data'];
    error?: ErrorResponse;
  };
  return json.data as getMeResponse['data'];
}

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
): Promise<updateUserResponse['data']> {
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
    data?: updateUserResponse['data'];
    error?: ErrorResponse;
  };
  return json.data as updateUserResponse['data'];
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
