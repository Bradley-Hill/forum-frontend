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
import { ApiError } from "../../utils/apiErrors";

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading } = useAuth();

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
    return (
      !errors.username &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword &&
      !errors.terms
    );
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
      if (error instanceof ApiError) {
        setApiError({
          code: error.code,
          message: error.message,
          details: error.details,
        });
      } else {
        setApiError({
          message: error instanceof Error ? error.message : "Registration failed",
        });
      }
    }
  };

  const isRegisterValid =
    authFormState.regUsername &&
    authFormState.regEmail &&
    authFormState.regPassword &&
    authFormState.regConfirmPassword &&
    authFormState.termsAccepted &&
    !loading;

  return (
    <div className="register-form">
      {showSuccess && (
        <Alert
          type="success"
          message="Registration successful! Redirecting..."
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

      <Form onSubmit={handleRegisterSubmit}>
        <TextInput
          id="register-username"
          label="Username"
          placeholder="Choose a username"
          value={authFormState.regUsername}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch({ type: "SET_REG_USERNAME", payload: e.target.value })
          }
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch({ type: "SET_REG_EMAIL", payload: e.target.value })
          }
          error={fieldErrors.email}
          required
          disabled={loading}
        />

        <PasswordInput
          id="register-password"
          label="Password"
          placeholder="Enter your password"
          value={authFormState.regPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch({ type: "SET_REG_PASSWORD", payload: e.target.value })
          }
          error={fieldErrors.password}
          required
          disabled={loading}
        />

        <PasswordInput
          id="register-confirm-password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={authFormState.regConfirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch({ type: "SET_REG_CONFIRM_PASSWORD", payload: e.target.value })
          }
          error={fieldErrors.confirmPassword}
          required
          disabled={loading}
        />

        <div className="auth-forms-checkbox-group">
          <input
            id="terms-checkbox"
            type="checkbox"
            checked={authFormState.termsAccepted}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({ type: "SET_TERMS_ACCEPTED", payload: e.target.checked })
            }
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

        <Button type="submit" variant="primary" disabled={!isRegisterValid}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </Form>
    </div>
  );
};

export default RegisterForm;
