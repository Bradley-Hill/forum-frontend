/**
 * Auth Form Validation Functions
 * Pure functions for validating auth form fields
 * Returns undefined if valid, or error message string if invalid
 */

export const validateEmail = (email: string): string | undefined => {
  const trimmedEmail = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!trimmedEmail) return "Email is required";
  if (!emailRegex.test(trimmedEmail)) return "Please enter a valid email";

  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  const trimmedPassword = password.trim();

  if (!trimmedPassword) return "Password is required";
  if (trimmedPassword.length < 8)
    return "Password must be at least 8 characters";

  // Check for ASCII-only characters (letters, numbers, common symbols)
  // Allow: A-Z a-z 0-9 and common symbols like !@#$%^&*()-_=+[]{}|;:'",.<>?/`~
  const asciiRegex = /^[\x20-\x7E]+$/;
  if (!asciiRegex.test(trimmedPassword)) {
    return "Password can only contain standard ASCII characters (no unicode, emojis, or special letters)";
  }

  return undefined;
};

export const validateUsername = (username: string): string | undefined => {
  const trimmedUsername = username.trim();

  if (!trimmedUsername) return "Username is required";
  if (trimmedUsername.length < 3)
    return "Username must be at least 3 characters";

  return undefined;
};

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): string | undefined => {
  if (password.trim() !== confirmPassword.trim()) {
    return "Passwords do not match";
  }
  return undefined;
};
