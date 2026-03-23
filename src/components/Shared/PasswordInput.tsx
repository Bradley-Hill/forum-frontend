import type { PasswordInputProps } from "../../types/components";
import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Button from "./Button";
import "./PasswordInput.scss";

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  required = false,
  ariaLabel,
  helperText,
  className = "",
  name,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = showPassword ? "text" : "password";
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;
  const describedBy =
    [errorId, helperId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      className={`password-input ${className}`.trim()}
      role="group"
      aria-labelledby={label ? `${id}-label` : undefined}
    >
      {label && (
        <label htmlFor={id} id={`${id}-label`} className="password-input-label">
          {label}
          {required && (
            <span
              className="password-input-required"
              aria-label="required"
              title="This field is required"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className="password-input-wrapper">
        <input
          id={id}
          type={inputType}
          className={`password-input-field ${error ? "password-input-field--error" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          name={name}
        />

        <Button
          className="password-input-toggle"
          onClick={togglePasswordVisibility}
          variant="secondary"
          size="small"
          type="button"
          disabled={disabled}
        >
          {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
        </Button>
      </div>

      {error && (
        <div
          id={errorId}
          className="password-input-error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      {helperText && !error && (
        <div id={helperId} className="password-input-helper">
          {helperText}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
