import type { TextInputProps } from '../../types/components';
import './TextInput.scss';

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  required = false,
  ariaLabel,
  helperText,
  className = '',
  name,
}) => {
  const inputClasses = [
    'text-input',
    error ? 'text-input--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Build aria-describedby to include both helper text and error messages
  const describedByParts = [];
  if (helperText) describedByParts.push(`${id}-helper`);
  if (error) describedByParts.push(`${id}-error`);
  const ariaDescribedBy = describedByParts.length > 0 ? describedByParts.join(' ') : undefined;

  return (
    <div className="text-input-wrapper" role="group">
      {label && (
        <label htmlFor={id} className="text-input-label">
          {label}
          {required && <span className="text-input-required" aria-label="required">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name || id}
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-label={!label ? ariaLabel : undefined}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
      />
      {helperText && !error && (
        <span id={`${id}-helper`} className="text-input-helper">
          {helperText}
        </span>
      )}
      {error && (
        <span
          id={`${id}-error`}
          className="text-input-error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default TextInput;
