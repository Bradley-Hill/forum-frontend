import type { User } from "./api";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  csrfToken: string | null;
  loading: boolean;
  loadingMessage: string;
  error: string | null;
  isInitialized: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  refresh: () => Promise<string>;
  updateUser: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}
