import { useState, useEffect, useRef } from "react";
import AuthContext from "./AuthContext";
import type { User, updateUserRequest } from "../types/api";
import {
  loginApi,
  logoutApi,
  registerApi,
  refreshTokenApi,
} from "../api/authApi";
import { getMeApi, updateUserApi, deleteUserApi } from "../api/userApi";
import { isRateLimitAllowed } from "../utils/rateLimit";
import { registerTokenRefreshHandler } from "../utils/fetchWithAuth";
import { retryWithBackoff } from "../utils/retryWithBackoff";

const getErrorMessage = (err: unknown, defaultMessage: string): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return defaultMessage;
};

const isValidUpdateUserRequest = (data: unknown): data is updateUserRequest => {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return Object.keys(obj).every((key) =>
    ["email", "currentPassword", "newPassword"].includes(key),
  );
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Loading your session...",
  );
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const initializeRef = useRef(false);

  const login = async (email: string, password: string) => {
    if (!isRateLimitAllowed("login", 2000)) {
      setError("Please wait before trying to login again");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const loginResponse = await loginApi(email, password);
      // Set CSRF token immediately so it's available even if getMeApi fails
      setCsrfToken(loginResponse.csrfToken);
      const userResponse = await getMeApi();
      setUser(userResponse);
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutApi();
      setUser(null);
      setCsrfToken(null);
    } catch (err) {
      // Always clear the user state on logout, even if API fails
      setUser(null);
      setCsrfToken(null);
      setError(getErrorMessage(err, "Logout failed"));
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    if (!isRateLimitAllowed("register", 3000)) {
      setError("Please wait before trying to register again");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const registerResponse = await registerApi(username, email, password);
      // Set CSRF token immediately so it's available even if getMeApi fails
      setCsrfToken(registerResponse.csrfToken);
      const userResponse = await getMeApi();
      setUser(userResponse);
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refresh = async (): Promise<string> => {
    try {
      const response = await retryWithBackoff(
        () => refreshTokenApi(),
        3,
        2000,
        (attempt) =>
          setLoadingMessage(`Server is warming up... (Attempt ${attempt})`),
      );
      setCsrfToken(response.csrfToken);
      return response.csrfToken;
    } catch {
      console.debug("Token refresh failed");
      return csrfToken ?? "";
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!isRateLimitAllowed("updateUser", 2000)) {
      setError("Please wait before updating your profile again");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (!user || !csrfToken)
        throw new Error("Session expired, please log in again");
      if (!isValidUpdateUserRequest(data)) {
        throw new Error("Invalid user update data");
      }
      const updated = await updateUserApi(data, csrfToken);
      setUser({ ...user, ...updated });
    } catch (err) {
      setError(getErrorMessage(err, "Update failed"));
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    if (!isRateLimitAllowed("changePassword", 2000)) {
      throw new Error("Please wait before changing your password again");
    }
    if (!user || !csrfToken)
      throw new Error("Session expired, please log in again");
    await updateUserApi({ currentPassword, newPassword }, csrfToken);
  };

  const deleteUser = async () => {
    if (!isRateLimitAllowed("deleteUser", 2000)) {
      setError("Please wait before deleting your account again");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (!csrfToken) return;
      await deleteUserApi(csrfToken);
      setUser(null);
      setCsrfToken(null);
    } catch (err) {
      setError(getErrorMessage(err, "Delete failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    registerTokenRefreshHandler((token) => setCsrfToken(token));
  }, []);

  useEffect(() => {
    if (initializeRef.current) return;
    initializeRef.current = true;

    const initializeAuth = async () => {
      try {
        const refreshResponse = await retryWithBackoff(
          () => refreshTokenApi(),
          3,
          2000,
          (attempt) =>
            setLoadingMessage(`Loading your session... (Attempt ${attempt})`),
        );
        setCsrfToken(refreshResponse.csrfToken);
        const userResponse = await getMeApi();
        setUser(userResponse);
      } catch (err) {
        console.debug("Auth initialization failed:", err);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        csrfToken,
        loading,
        loadingMessage,
        error,
        isInitialized,
        login,
        logout,
        register,
        refresh,
        updateUser,
        changePassword,
        deleteUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
