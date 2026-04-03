import type { ButtonProps } from "../../types/sharedComponents";

import React from "react";
import "./Button.scss";

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  onClick,
  type = "button",
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}) => {
  const baseClass = "btn";
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;

  const combinedClasses =
    `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();
  return (
    <button
      className={combinedClasses}
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
    >
      {children}
    </button>
  );
};

export default Button;
