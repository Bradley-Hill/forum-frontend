import { createContext } from 'react';
import type { AuthContextType } from '../types/context';
import type { User } from '../types/api';

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  isInitialized: false,
  login: async (username: string, password: string) => {},
  logout: () => {},
  register: async (username: string, email: string, password: string) => {},
  refresh: async () => {},
  updateUser: async (data: Partial<User>) => {},
  deleteUser: async () => {},
  setUser: (user: User | null) => {},
});

export default AuthContext;