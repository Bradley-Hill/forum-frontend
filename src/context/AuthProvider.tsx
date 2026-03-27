import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import type { User, updateUserRequest } from "../types/api";
import {
  loginApi,
  logoutApi,
  registerApi,
  refreshTokenApi,
} from "../api/authApi";
import { getMeApi, updateUserApi, deleteUserApi } from "../api/userApi";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const loginResponse = await loginApi(email, password);
      setCsrfToken(loginResponse.csrfToken);
      setIsAuthenticated(true);
      const userResponse = await getMeApi();
      setUser({
        id: userResponse.id,
        username: userResponse.username,
        email: userResponse.email,
        role: userResponse.role,
      });
    } catch (err) {
      setError((err as Error).message || "Login failed");
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
      setIsAuthenticated(false);
      setCsrfToken(null);
    } catch (err) {
      setError((err as Error).message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const registerResponse = await registerApi(username, email, password);
      setCsrfToken(registerResponse.csrfToken);
      setIsAuthenticated(true);
      const userResponse = await getMeApi();
      setUser({
        id: userResponse.id,
        username: userResponse.username,
        email: userResponse.email,
        role: userResponse.role,
      });
    } catch (err) {
      setError((err as Error).message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    try {
      const response = await refreshTokenApi();
      setCsrfToken(response.csrfToken);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      setCsrfToken(null);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      if (!user || !csrfToken) return;
      const updated = await updateUserApi(
        user.username,
        data as updateUserRequest,
        csrfToken,
      );
      setUser({ ...user, ...updated });
    } catch (err) {
      setError((err as Error).message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!csrfToken) return;
      await deleteUserApi(csrfToken);
      setUser(null);
      setIsAuthenticated(false);
      setCsrfToken(null);
    } catch (err) {
      setError((err as Error).message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userResponse = await getMeApi();
        setUser({
          id: userResponse.id,
          username: userResponse.username,
          email: userResponse.email,
          role: userResponse.role,
        });
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        csrfToken,
        loading,
        error,
        isInitialized,
        login,
        logout,
        register,
        refresh,
        updateUser,
        deleteUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
