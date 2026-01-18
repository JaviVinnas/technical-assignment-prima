import type { HTMLAttributes, ReactNode } from "react";

import "./Badge.css";

/**
 * Badge component with variant styles.
 *
 * A reusable badge atom component following atomic design principles.
 * Displays small, static pill-shaped badges with 5 variants using accent
 * colours from the design system. Text is automatically transformed to
 * uppercase via CSS.
 *
 * This is a domain-agnostic component that can be used for any badge use case.
 * For domain-specific badges (e.g., user permissions), create wrapper components
 * that map domain values to these generic variants.
 *
 * This is a static display component with no interactions. For interactive
 * toggle functionality, use BadgeToggle instead.
 *
 * @param props - Badge configuration
 * @param props.variant - Style variant: "accent-1", "accent-2", "accent-3", "accent-4", or "default" (required)
 * @param props.children - Badge content (text, icons, etc.)
 * @param props.className - Additional CSS classes
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: "accent-1" | "accent-2" | "accent-3" | "accent-4" | "default";
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
