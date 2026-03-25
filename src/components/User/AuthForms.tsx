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
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePasswordMatch,
} from "../../utils/authFormValidation";
import "./AuthForms.scss";

const AuthForms: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, loading } = useAuth();

  const [authFormState, dispatch] = useReducer(authFormReducer, initialAuthFormState);
  const [isLogin, setIsLogin] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState<{ code?: string; message: string; details?: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AuthFormFieldErrors>({});

  useEffect(() => {
    if (isAuthenticated && showSuccess) {
      const timer = setTimeout(() => {
        navigate("/categories");
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

  const validateRegisterForm = (): boolean => {
    const errors: AuthFormFieldErrors = {};
    errors.username = validateUsername(authFormState.regUsername);
    errors.email = validateEmail(authFormState.regEmail);
    errors.password = validatePassword(authFormState.regPassword);
    errors.confirmPassword = validatePasswordMatch(
      authFormState.regPassword,
      authFormState.regConfirmPassword
    );
    
    if (!authFormState.termsAccepted) {
      errors.terms = "You must accept the terms and conditions";
    }

    setFieldErrors(errors);
    return !errors.username && !errors.email && !errors.password && !errors.confirmPassword && !errors.terms;
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
      setApiError({
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);
    setFieldErrors({});

    if (!validateRegisterForm()) return;

    try {
      await register(
        authFormState.regUsername.trim(),
        authFormState.regEmail.trim(),
        authFormState.regPassword.trim()
      );
      setShowSuccess(true);
      dispatch({ type: "RESET_FORM" });
    } catch (error) {
      setApiError({
        message: error instanceof Error ? error.message : "Registration failed",
      });
    }
  };

  const isLoginValid = authFormState.loginEmail && authFormState.loginPassword && !loading;
  const isRegisterValid = authFormState.regUsername && authFormState.regEmail && authFormState.regPassword && authFormState.regConfirmPassword && authFormState.termsAccepted && !loading;

  return (
    <div className="auth-forms">
      {showSuccess && (
        <Alert
          type="success"
          message={`${isLogin ? "Login" : "Registration"} successful! Redirecting...`}
          closeable={false}
        />
      )}

      {apiError && (
        <ErrorMessage
          message={apiError.message}
          details={apiError.details}
          onRetry={() => setApiError(null)}
        />
      )}

        <div className="auth-forms-header">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            className="auth-forms-toggle"
            onClick={() => {
              setIsLogin(!isLogin);
              setFieldErrors({});
              setApiError(null);
              dispatch({ type: "RESET_FORM" });
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>

      {isLogin && (
        <Form onSubmit={handleLoginSubmit}>
          <TextInput
            id="login-email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={authFormState.loginEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "SET_LOGIN_EMAIL", payload: e.target.value })}
            error={fieldErrors.email}
            required
            disabled={loading}
          />

          <PasswordInput
            id="login-password"
            label="Password"
            placeholder="Enter your password"
            value={authFormState.loginPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "SET_LOGIN_PASSWORD", payload: e.target.value })}
            error={fieldErrors.password}
            required
            disabled={loading}
          />

          {loading && (
            <div className="auth-forms-loader">
              <Loader size="small" message="Logging in..." />
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={!isLoginValid}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>
      )}

      {!isLogin && (
        <Form onSubmit={handleRegisterSubmit}>
          <TextInput
            id="register-username"
            label="Username"
            placeholder="Choose a username"
            value={authFormState.regUsername}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "SET_REG_USERNAME", payload: e.target.value })}
            error={fieldErrors.username}
            required
            disabled={loading}
          />

          <TextInput
            id="register-email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={authFormState.regEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "SET_REG_EMAIL", payload: e.target.value })}
            error={fieldErrors.email}
            required
            disabled={loading}
          />

          <PasswordInput
            id="register-password"
            label="Password"
            placeholder="Enter your password"
            value={authFormState.regPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "SET_REG_PASSWORD", payload: e.target.value })}
            error={fieldErrors.password}
            required
            disabled={loading}
          />

          <PasswordInput
            id="register-confirm-password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={authFormState.regConfirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "SET_REG_CONFIRM_PASSWORD", payload: e.target.value })}
            error={fieldErrors.confirmPassword}
            required
            disabled={loading}
          />

          <div className="auth-forms-checkbox-group">
            <input
              id="terms-checkbox"
              type="checkbox"
              checked={authFormState.termsAccepted}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "SET_TERMS_ACCEPTED", payload: e.target.checked })}
              disabled={loading}
            />
            <label htmlFor="terms-checkbox">
              I accept the terms and conditions.
            </label>
          </div>
          {fieldErrors.terms && (
            <div className="auth-forms-error">
              {fieldErrors.terms}
            </div>
          )}

          {loading && (
            <div className="auth-forms-loader">
              <Loader size="small" message="Creating account..." />
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={!isRegisterValid}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default AuthForms;
