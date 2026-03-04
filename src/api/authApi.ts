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

const API_BASE_URL = "https://api.bradley-hill.com/api";

export async function registerApi(
  username: string,
  email: string,
  password: string,
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password } as RegisterRequest),
  });

  const json = (await response.json()) as {
    data?: RegisterResponse;
    error?: ErrorResponse;
  };

  if (!response.ok) {
    throw new Error(json.error?.message || "Registration failed");
  }

  return json.data as RegisterResponse;
}

export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password } as LoginRequest),
  });

  const json = (await response.json()) as {
    data?: LoginResponse;
    error?: ErrorResponse;
  };

  if (!response.ok) {
    throw new Error(json.error?.message || "Login failed");
  }

  return json.data as LoginResponse;
}

export async function refreshTokenApi(
  refreshToken: string,
): Promise<RefreshResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken } as RefreshRequest),
  });

  const json = (await response.json()) as {
    data?: RefreshResponse;
    error?: ErrorResponse;
  };

  if (!response.ok) {
    throw new Error(json.error?.message || "Token refresh failed");
  }

  return json.data as RefreshResponse;
}

export async function logoutApi(refreshToken: string): Promise<LogoutResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken } as LogoutRequest),
  });

  const json = (await response.json()) as {
    data?: LogoutResponse;
    error?: ErrorResponse;
  };

  if (!response.ok) {
    throw new Error(json.error?.message || "Logout failed");
  }

  return json.data as LogoutResponse;
}
