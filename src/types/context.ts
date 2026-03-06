import type { User } from "./api";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  refresh: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  deleteUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}