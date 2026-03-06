import { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import type { User, updateUserRequest } from '../types/api';
import { loginApi, logoutApi, registerApi, refreshTokenApi } from '../api/authApi';
import { getMeApi, updateUserApi, deleteUserApi } from '../api/userApi';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await loginApi(email, password);
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setIsAuthenticated(true);
      const userResponse = await getMeApi(newAccessToken);
      setUser({
        id: userResponse.id,
        username: userResponse.username,
        email: userResponse.email,
        role: userResponse.role,
      });
    } catch (err) {
      setError((err as Error).message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch (err) {
      setError((err as Error).message || 'Logout failed');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setRefreshToken(null);
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setError(null);
    try {
      await registerApi(username, email, password);
      await login(email, password);
    } catch (err) {
      setError((err as Error).message || 'Registration failed');
    }
  };

  const refresh = async () => {
    try {
      if (!refreshToken) return;
      const response = await refreshTokenApi(refreshToken);
      localStorage.setItem('accessToken', response.accessToken);
      setAccessToken(response.accessToken);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      if (!user) return;
      const updated = await updateUserApi(user.username, data as updateUserRequest);
      setUser({ ...user, ...updated });
    } catch (err) {
      setError((err as Error).message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteUserApi();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setRefreshToken(null);
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError((err as Error).message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (!storedAccessToken || !storedRefreshToken) return;
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        try {
          const userResponse = await getMeApi(storedAccessToken);
          setUser({
            id: userResponse.id,
            username: userResponse.username,
            email: userResponse.email,
            role: userResponse.role,
          });
          setIsAuthenticated(true);
        } catch {
          try {
            const response = await refreshTokenApi(storedRefreshToken);
            localStorage.setItem('accessToken', response.accessToken);
            setAccessToken(response.accessToken);
            const userResponse = await getMeApi(response.accessToken);
            setUser({
              id: userResponse.id,
              username: userResponse.username,
              email: userResponse.email,
              role: userResponse.role,
            });
            setIsAuthenticated(true);
          } catch {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
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
        accessToken,
        refreshToken,
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


