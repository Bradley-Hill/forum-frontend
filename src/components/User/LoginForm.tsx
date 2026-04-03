import Form from "../Shared/Form";
import TextInput from "../Shared/TextInput";
import Button from "../Shared/Button";
import PasswordInput from "../Shared/PasswordInput";
import ErrorMessage from "../Shared/ErrorMessage";
import Loader from "../Shared/Loader";
import Alert from "../Shared/Alert";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthFormFieldErrors } from "../../types/authForm";
import { authFormReducer, initialAuthFormState } from "../../types/authFormReducer";
import { validateEmail, validatePassword } from "../../utils/authFormValidation";
import { ApiError } from "../../utils/apiErrors";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  const [authFormState, dispatch] = useReducer(authFormReducer, initialAuthFormState);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState<{ code?: string; message: string; details?: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AuthFormFieldErrors>({});

  useEffect(() => {
    if (isAuthenticated && showSuccess) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, showSuccess, navigate]);

  const validateLoginForm = (): boolean => {
    const errors: AuthFormFieldErrors = {};
    errors.email = validateEmail(authFormState.loginEmail);
    errors.password = validatePassword(authFormState.loginPassword);
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);
    setFieldErrors({});

    if (!validateLoginForm()) return;

    try {
      await login(authFormState.loginEmail.trim(), authFormState.loginPassword.trim());
      setShowSuccess(true);
      dispatch({ type: "RESET_FORM" });
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError({
          code: error.code,
          message: error.message,
          details: error.details,
        });
      } else {
        setApiError({
          message: error instanceof Error ? error.message : "Login failed",
        });
      }
    }
  };

  const isLoginValid = authFormState.loginEmail && authFormState.loginPassword && !loading;

  return (
    <div className="login-form">
      {showSuccess && (
        <Alert
          type="success"
          message="Login successful! Redirecting..."
          closeable={false}
        />
      )}

      {apiError && (
        <ErrorMessage
          code={apiError.code}
          message={apiError.message}
          details={apiError.details}
          onRetry={() => setApiError(null)}
        />
      )}

      <Form onSubmit={handleLoginSubmit}>
        <TextInput
          id="login-email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={authFormState.loginEmail}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch({ type: "SET_LOGIN_EMAIL", payload: e.target.value })
          }
          error={fieldErrors.email}
          required
          disabled={loading}
        />

        <PasswordInput
          id="login-password"
          label="Password"
          placeholder="Enter your password"
          value={authFormState.loginPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch({ type: "SET_LOGIN_PASSWORD", payload: e.target.value })
          }
          error={fieldErrors.password}
          required
          disabled={loading}
        />

        {loading && (
          <div className="auth-forms-loader">
            <Loader size="small" message="Logging in..." />
          </div>
        )}

        <Button type="submit" variant="primary" disabled={!isLoginValid}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
