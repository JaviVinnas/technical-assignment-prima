import type { HTMLAttributes, ReactNode } from "react";

import "./Badge.css";

/**
 * Badge component with variant styles.
 *
 * A reusable badge atom component following atomic design principles.
 * Displays small, static pill-shaped badges with 5 variants (admin, editor,
 * viewer, guest, deactivated) using accent colours from the design system.
 * Text is automatically transformed to uppercase via CSS.
 *
 * This is a static display component with no interactions. For interactive
 * toggle functionality, use BadgeToggle instead.
 *
 * @param props - Badge configuration
 * @param props.variant - Style variant: "admin", "editor", "viewer", "guest", or "deactivated" (required)
 * @param props.children - Badge content (text, icons, etc.)
 * @param props.className - Additional CSS classes
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: "admin" | "editor" | "viewer" | "guest" | "deactivated";
  children: ReactNode;
}

export function Badge({ variant, children, className = "", ...rest }: BadgeProps) {
  const badgeClassName = `badge badge--${variant} ${className}`.trim();

  return (
    <span className={badgeClassName} {...rest}>
      {children}
    </span>
  );
}
