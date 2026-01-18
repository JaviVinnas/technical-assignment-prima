import type { ButtonHTMLAttributes, ReactNode } from "react";

import "../Badge/Badge.css";
import { CheckIcon } from "../icons/CheckIcon";
import "./BadgeToggle.css";

/**
 * BadgeToggle component with variant styles and toggle functionality.
 *
 * An interactive badge toggle component that acts as a toggle button.
 * Displays small, clickable pill-shaped badges with 5 variants (admin, editor,
 * viewer, guest, deactivated) using accent colours from the design system.
 * Text is automatically transformed to uppercase via CSS.
 *
 * When `isActive` is true, displays a checkmark icon on the right side of the label.
 * Supports keyboard navigation (Enter/Space) and has proper ARIA attributes
 * for accessibility.
 *
 * For static display badges without interaction, use Badge instead.
 *
 * @param props - BadgeToggle configuration
 * @param props.variant - Style variant: "admin", "editor", "viewer", "guest", or "deactivated" (required)
 * @param props.children - Badge content (text, icons, etc.)
 * @param props.isActive - Whether the toggle is in active state (shows checkmark when true)
 * @param props.className - Additional CSS classes
 * @param props.onClick - Click handler function
 */
export interface BadgeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "admin" | "editor" | "viewer" | "guest" | "deactivated";
  children: ReactNode;
  isActive?: boolean;
}

export function BadgeToggle({
  variant,
  children,
  isActive = false,
  className = "",
  type = "button",
  ...rest
}: BadgeToggleProps) {
  const badgeClassName = `badge badge--${variant} badge-toggle ${className}`.trim();
  const checkmarkClassName =
    `badge-toggle__checkmark ${isActive ? "badge-toggle__checkmark--visible" : ""}`.trim();

  return (
    <button type={type} className={badgeClassName} aria-pressed={isActive} {...rest}>
      {children}
      <CheckIcon size={12} className={checkmarkClassName} />
    </button>
  );
}
