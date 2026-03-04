# AuthContext Implementation Plan

A comprehensive, granular plan for building the `AuthContext` with step-by-step todos for your forum frontend project.

---

## Phase 1: Foundation & Types

### 1.1 Create Type Definitions

**File:** `src/types/auth.ts`

```ts
// filepath: src/types/auth.ts
export interface User {
  id: string;
  username: string;
  role: "member" | "admin";
}

export interface AuthContextValue {
  // State
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
}
```

**Checklist:**

- [x] Create `src/types/auth.ts`
- [x] Define `User` interface
- [x] Define `AuthContextValue` interface
- [x] Define `LoginResponse` interface
- [x] Define `RegisterResponse` interface

---

## Phase 2: API Utilities

### 2.1 Create API Client Base

**File:** `src/api/client.ts`

```ts
// filepath: src/api/client.ts
const API_BASE_URL = "https://api.bradley-hill.com/api";

interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = localStorage.getItem("accessToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(json.error?.message || "API request failed");
  }

  return json.data as T;
}
```

**Checklist:**

- [ ] Create `src/api/client.ts`
- [ ] Define `API_BASE_URL` constant
- [ ] Create `apiCall` utility function
- [ ] Handle authorization headers
- [ ] Handle error responses

### 2.2 Create Auth API Functions

**File:** `src/api/authApi.ts`

```ts
// filepath: src/api/authApi.ts
import { apiCall } from "./client";
import { LoginResponse, RegisterResponse } from "../types/auth";

export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiCall<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(
  username: string,
  email: string,
  password: string,
): Promise<RegisterResponse> {
  return apiCall<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export async function refreshTokenApi(
  refreshToken: string,
): Promise<{ accessToken: string }> {
  return apiCall<{ accessToken: string }>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function logoutApi(refreshToken: string): Promise<void> {
  return apiCall<void>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}
```

**Checklist:**

- [ ] Create `src/api/authApi.ts`
- [ ] Create `loginApi` function
- [ ] Create `registerApi` function
- [ ] Create `refreshTokenApi` function
- [ ] Create `logoutApi` function

---

## Phase 3: Context Creation

### 3.1 Create Auth Context

**File:** `src/context/AuthContext.ts`

```ts
// filepath: src/context/AuthContext.ts
import { createContext } from "react";
import { AuthContextValue } from "../types/auth";

const AuthContext = createContext<AuthContextValue | null>(null);

export default AuthContext;
```

**Checklist:**

- [ ] Create `src/context/AuthContext.ts`
- [ ] Create `AuthContext` with `createContext`
- [ ] Export context

### 3.2 Create Auth Provider Component

**File:** `src/context/AuthProvider.tsx`

```tsx
// filepath: src/context/AuthProvider.tsx
import React, { useState, useEffect, useCallback } from "react";
import AuthContext from "./AuthContext";
import { AuthContextValue, User } from "../types/auth";
import {
  loginApi,
  registerApi,
  refreshTokenApi,
  logoutApi,
} from "../api/authApi";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedAccessToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");
    const savedUser = localStorage.getItem("user");

    if (savedAccessToken && savedUser) {
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Login action
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await loginApi(email, password);

      // TODO: Fetch user info from /api/users/me or similar
      // For now, decode JWT or use a separate endpoint
      // Placeholder user (you'll need to fetch this)
      const placeholderUser: User = {
        id: "placeholder",
        username: "user",
        role: "member",
      };

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(placeholderUser);
      setIsLoggedIn(true);

      // Persist to localStorage
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("user", JSON.stringify(placeholderUser));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register action
  const register = useCallback(
    async (username: string, email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await registerApi(username, email, password);
        // After registration, user should log in
        // You could auto-login or redirect to login page
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Registration failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Logout action
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
      setIsLoggedIn(false);
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setError(null);

      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken]);

  // Refresh access token
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      setIsLoggedIn(false);
      return;
    }
    try {
      const { accessToken: newAccessToken } =
        await refreshTokenApi(refreshToken);
      setAccessToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);
    } catch (err) {
      // Token refresh failed, user should log out
      setIsLoggedIn(false);
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }, [refreshToken]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextValue = {
    isLoggedIn,
    user,
    accessToken,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshAccessToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
```

**Checklist:**

- [ ] Create `src/context/AuthProvider.tsx`
- [ ] Initialize state: `isLoggedIn`, `user`, `accessToken`, `refreshToken`, `isLoading`, `error`
- [ ] Implement `useEffect` to hydrate from localStorage
- [ ] Implement `login` action
- [ ] Implement `register` action
- [ ] Implement `logout` action
- [ ] Implement `refreshAccessToken` action
- [ ] Implement `clearError` action
- [ ] Persist to localStorage on login
- [ ] Clear localStorage on logout

---

## Phase 4: Custom Hook

### 4.1 Create useAuth Hook

**File:** `src/hooks/useAuth.ts`

```ts
// filepath: src/hooks/useAuth.ts
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

**Checklist:**

- [ ] Create `src/hooks/useAuth.ts`
- [ ] Create `useAuth` hook
- [ ] Add error check for context usage

---

## Phase 5: Integration with App

### 5.1 Wrap App with Provider

**File:** `src/App.tsx`

```tsx
// filepath: src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import Layout from "./components/Layout/Layout";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import NotFound from "./routes/NotFound";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

**Checklist:**

- [ ] Wrap `App` with `AuthProvider`
- [ ] Test that context is accessible in components

---

## Phase 6: Update Header/Navbar

### 6.1 Conditionally Render Links

**File:** `src/components/Layout/Header.tsx`

Update to show/hide links based on auth state:

```tsx
// filepath: src/components/Layout/Header.tsx
import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useAuth } from "../../hooks/useAuth";
import "./Header.scss";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();

  return (
    <header className="navbar">
      <nav role="navigation" aria-label="Main navigation">
        <button
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="main-nav-list"
        >
          <RxHamburgerMenu />
        </button>
        <ul className={`navbarList ${isOpen ? "open" : ""}`} id="main-nav-list">
          {/* Always visible links */}
          <li className="navbarItem">
            <a
              className="navLink"
              href="https://bradley-hill.com/"
              onClick={() => setIsOpen(false)}
              aria-label="Go to Home Page"
            >
              Home Page
            </a>
          </li>
          <li className="navbarItem">
            <a
              className="navLink"
              href="https://bradley-hill.com/projects"
              onClick={() => setIsOpen(false)}
              aria-label="Go to Projects"
            >
              Projects
            </a>
          </li>
          <li className="navbarItem">
            <a
              className="navLink"
              href="/"
              onClick={() => setIsOpen(false)}
              aria-label="Go to Forum"
            >
              Forum
            </a>
          </li>

          {/* Logged in links */}
          {isLoggedIn && (
            <>
              <li className="navbarItem">
                <a
                  className="navLink"
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  aria-label="Go to Profile"
                >
                  Profile
                </a>
              </li>
              {user?.role === "admin" && (
                <li className="navbarItem">
                  <a
                    className="navLink"
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    aria-label="Go to Admin"
                  >
                    Admin
                  </a>
                </li>
              )}
              <li className="navbarItem">
                <a
                  className="navLink"
                  href="/logout"
                  onClick={() => setIsOpen(false)}
                  aria-label="Logout"
                >
                  Logout
                </a>
              </li>
            </>
          )}

          {/* Not logged in links */}
          {!isLoggedIn && (
            <>
              <li className="navbarItem">
                <a
                  className="navLink"
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  aria-label="Go to Login"
                >
                  Login
                </a>
              </li>
              <li className="navbarItem">
                <a
                  className="navLink"
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  aria-label="Go to Register"
                >
                  Register
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
```

**Checklist:**

- [ ] Import `useAuth` hook
- [ ] Conditionally render Login/Register links
- [ ] Conditionally render Profile/Logout links
- [ ] Conditionally render Admin link if user is admin
- [ ] Test navbar updates when logging in/out

---

## Phase 7: Create Login Page

### 7.1 Build Login Form

**File:** `src/routes/Login.tsx`

```tsx
// filepath: src/routes/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      // Error is already in context
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default Login;
```

**Checklist:**

- [ ] Create `src/routes/Login.tsx`
- [ ] Build login form with email and password fields
- [ ] Use `useAuth` hook
- [ ] Handle form submission
- [ ] Display error messages
- [ ] Redirect to home on successful login
- [ ] Disable form while loading

---

## Phase 8: Create Register Page

### 8.1 Build Register Form

**File:** `src/routes/Register.tsx`

```tsx
// filepath: src/routes/Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register(username, email, password);
      // Redirect to login
      navigate("/login");
    } catch (err) {
      // Error is already in context
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Register;
```

**Checklist:**

- [ ] Create `src/routes/Register.tsx`
- [ ] Build register form with username, email, password fields
- [ ] Use `useAuth` hook
- [ ] Handle form submission
- [ ] Display error messages
- [ ] Redirect to login on successful registration
- [ ] Disable form while loading

---

## Phase 9: Create Logout Endpoint

### 9.1 Create Logout Route

**File:** `src/routes/Logout.tsx`

```tsx
// filepath: src/routes/Logout.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        navigate("/login");
      } catch (err) {
        console.error("Logout error:", err);
        navigate("/login");
      }
    };

    performLogout();
  }, [logout, navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
```

### 9.2 Add Logout Route to App

**File:** `src/App.tsx`

```tsx
<Route path="/logout" element={<Logout />} />
```

**Checklist:**

- [ ] Create `src/routes/Logout.tsx`
- [ ] Add logout route to `App.tsx`
- [ ] Perform logout on component mount
- [ ] Redirect to login after logout

---

## Phase 10: Protected Routes (Optional)

### 10.1 Create ProtectedRoute Component

**File:** `src/components/ProtectedRoute.tsx`

```tsx
// filepath: src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRole?: "member" | "admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRole,
}) => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
```

**Checklist:**

- [ ] Create `src/components/ProtectedRoute.tsx`
- [ ] Check if user is logged in
- [ ] Check required role if specified
- [ ] Redirect to login or home if unauthorized

---

## Phase 11: Testing & Verification

### 11.1 Manual Testing Checklist

- [ ] Start the dev server
- [ ] Open the app in browser
- [ ] Verify navbar renders correctly (not logged in)
- [ ] Click "Register" link
- [ ] Fill in registration form
- [ ] Submit and verify redirect to login
- [ ] Click "Login" link
- [ ] Fill in login form with registered credentials
- [ ] Submit and verify:
  - [ ] Redirect to home
  - [ ] Navbar shows Profile, Logout, (Admin if applicable)
  - [ ] Login/Register links are hidden
- [ ] Click "Profile" link (should work once profile page exists)
- [ ] Click "Logout"
- [ ] Verify redirect to login and navbar updated
- [ ] Refresh page and verify user is still logged in
- [ ] Test error handling (wrong password, etc.)

---

## Phase 12: Known Issues & TODO

### 12.1 Issues to Address

- [ ] **User Info Fetching**: Currently using placeholder user. Need to:
  - [ ] Decode JWT token to get user info, OR
  - [ ] Add a `GET /api/users/me` endpoint to fetch current user
  - [ ] Update `login` action to fetch real user data

- [ ] **Token Expiration Handling**: Currently doesn't auto-refresh expired tokens
  - [ ] Implement interceptor in `apiCall` to refresh token on 401
  - [ ] Or implement periodic token refresh

- [ ] **Error Messages**: Currently just showing raw error messages
  - [ ] Map error codes to user-friendly messages
  - [ ] Consider toast/notification UI

- [ ] **Loading States**: UI doesn't fully reflect loading state
  - [ ] Add loading spinner/skeleton
  - [ ] Disable buttons/inputs properly

- [ ] **Protected Routes**: Not yet implemented in routing
  - [ ] Create profile, admin routes
  - [ ] Use `ProtectedRoute` component

---

## Summary Checklist

**Phase 1: Foundation & Types**

- [ ] Create `src/types/auth.ts`

**Phase 2: API Utilities**

- [ ] Create `src/api/client.ts`
- [ ] Create `src/api/authApi.ts`

**Phase 3: Context Creation**

- [ ] Create `src/context/AuthContext.ts`
- [ ] Create `src/context/AuthProvider.tsx`

**Phase 4: Custom Hook**

- [ ] Create `src/hooks/useAuth.ts`

**Phase 5: Integration**

- [ ] Update `src/App.tsx` with `AuthProvider`

**Phase 6: Header Update**

- [ ] Update `src/components/Layout/Header.tsx`

**Phase 7 & 8: Pages**

- [ ] Create `src/routes/Login.tsx`
- [ ] Create `src/routes/Register.tsx`

**Phase 9: Logout**

- [ ] Create `src/routes/Logout.tsx`
- [ ] Update `src/App.tsx` with logout route

**Phase 10: Protected Routes**

- [ ] Create `src/components/ProtectedRoute.tsx`

**Phase 11: Testing**

- [ ] Manual testing checklist

**Phase 12: Known Issues**

- [ ] Address token refresh, user info fetching, error handling

---

This is a complete, granular roadmap! Start with Phase 1 and work through each phase sequentially.
