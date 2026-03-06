# AuthContext Implementation Plan

A comprehensive, granular plan for building the `AuthContext` with step-by-step todos for your forum frontend project.

## Phase 6: Update Header/Navbar

### 6.1 Conditionally Render Links
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
