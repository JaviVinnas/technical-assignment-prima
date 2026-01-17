import type { ButtonHTMLAttributes, ReactNode } from "react";

import "./Button.css";

/**
 * Button component with size variants.
 *
 * A reusable button atom component following atomic design principles.
 * Supports two size variants (big and small) with consistent styling
 * using design system tokens.
 *
 * @param props - Button configuration
 * @param props.variant - Size variant: "big" or "small" (required)
 * @param props.children - Button content (text, icons, etc.)
 * @param props.className - Additional CSS classes
 * @param props.disabled - Whether the button is disabled
 * @param props.type - Button type (defaults to "button")
 * @param props.onClick - Click handler function
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "big" | "small";
  children: ReactNode;
}

export function Button({
  variant,
  children,
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...rest
}: ButtonProps) {
  const buttonClassName = `button button--${variant} ${className}`.trim();

  return (
    <button type={type} className={buttonClassName} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
