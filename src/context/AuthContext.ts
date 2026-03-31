import { createContext } from "react";
import type { AuthContextType } from "../types/context";
import type { User } from "../types/api";

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  csrfToken: null,
  loading: false,
  error: null,
  isInitialized: false,
  login: async (_username: string, _password: string) => {},
  logout: () => {},
  register: async (_username: string, _email: string, _password: string) => {},
  refresh: async () => "",
  updateUser: async (_data: Partial<User>) => {},
  deleteUser: async () => {},
  setUser: (_user: User | null) => {},
  changePassword: async (_currentPassword: string, _newPassword: string) => {},
});

export default AuthContext;
