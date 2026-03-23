import type { ReactNode, ChangeEvent } from "react";

export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

export interface TextInputProps {
  id: string;
  label?: string;
  type?: "text" | "email" | "number" | "url";
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  ariaLabel?: string;
  helperText?: string;
  className?: string;
  name?: string;
}

export interface AlertProps {
  type?: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
  closeable?: boolean;
  autoDismiss?: boolean;
  autoDismissTime?: number;
  className?: string;
}

export interface LoaderProps {
  size?: "small" | "medium" | "large";
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export interface ErrorMessageProps {
  code?: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  showDetails?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "small" | "medium" | "large";
  children: ReactNode;
  className?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
}

export interface PasswordInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  ariaLabel?: string;
  helperText?: string;
  className?: string;
  name?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
  className?: string;
}

export interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  className?: string;
}
