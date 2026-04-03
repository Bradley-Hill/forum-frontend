import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ErrorResponse,
  RefreshRequest,
  RefreshResponse,
  LogoutRequest,
  LogoutResponse,
} from "../types/api";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { ApiError } from "../utils/apiErrors";

const API_BASE_URL = import.meta.env.VITE_API_URL;

async function handleApiResponse<T>(response: Response, defaultMessage: string): Promise<T> {
  const json = await response.json() as {
    data?: T;
    error?: ErrorResponse;
  };

  if (!response.ok) {
    const errorData = json.error || { message: defaultMessage, code: "UNKNOWN_ERROR" };
    throw new ApiError(
      errorData.code || "UNKNOWN_ERROR",
      errorData.message || defaultMessage,
    );
  }

  return json.data as T;
}

export async function registerApi(
  username: string,
  email: string,
  password: string,
): Promise<RegisterResponse["data"]> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password } as RegisterRequest),
        credentials: "include",
      },
      10000,
    );

    return await handleApiResponse<RegisterResponse["data"]>(response, "Registration failed");
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Registration failed");
  }
}

export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResponse["data"]> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password } as LoginRequest),
        credentials: "include",
      },
      10000,
    );

    return await handleApiResponse<LoginResponse["data"]>(response, "Login failed");
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Login failed");
  }
}

export async function refreshTokenApi(): Promise<RefreshResponse["data"]> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({} as RefreshRequest),
        credentials: "include",
      },
      10000,
    );

    return await handleApiResponse<RefreshResponse["data"]>(response, "Token refresh failed");
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Token refresh failed");
  }
}

export async function logoutApi(): Promise<LogoutResponse["data"]> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/auth/logout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({} as LogoutRequest),
        credentials: "include",
      },
      10000,
    );

    return await handleApiResponse<LogoutResponse["data"]>(response, "Logout failed");
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("UNKNOWN_ERROR", "Logout failed");
  }
}
