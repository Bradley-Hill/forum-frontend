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

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function registerApi(
  username: string,
  email: string,
  password: string,
): Promise<RegisterResponse["data"]> {
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

  const json = (await response.json()) as {
    data?: RegisterResponse["data"];
    error?: ErrorResponse;
  };

  if (!response.ok) {
    throw new Error(json.error?.message || "Registration failed");
  }

  return json.data as RegisterResponse["data"];
}

export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResponse["data"]> {
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

  const json = (await response.json()) as {
    data?: LoginResponse["data"];
    error?: ErrorResponse;
  };

  if (!response.ok) {
    throw new Error(json.error?.message || "Login failed");
  }

  return json.data as LoginResponse["data"];
}

export async function refreshTokenApi(): Promise<RefreshResponse["data"]> {
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

  const json = (await response.json()) as {
    data?: RefreshResponse["data"];
    error?: ErrorResponse;
  };

  if (!response.ok) {
    throw new Error(json.error?.message || "Token refresh failed");
  }

  return json.data as RefreshResponse["data"];
}

export async function logoutApi(): Promise<LogoutResponse> {
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

  const json = (await response.json()) as {
    data?: LogoutResponse;
    error?: ErrorResponse;
  };

  if (!response.ok) {
    throw new Error(json.error?.message || "Logout failed");
  }

  return json.data as LogoutResponse;
}
