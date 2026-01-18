import type { HTMLAttributes } from "react";

import "./HorizontalSeparator.css";

/**
 * Horizontal separator component for visual division.
 *
 * A reusable atom component that renders a 1px horizontal line for visual
 * separation between sections. Uses the design system's secondary text colour
 * token.
 *
 * This component is purely visual and has no operational significance, making
 * it suitable for separating content sections without adding semantic meaning.
 *
 * @param props - HorizontalSeparator configuration
 * @param props.className - Additional CSS classes applied to the separator
 */
export interface HorizontalSeparatorProps extends HTMLAttributes<HTMLHRElement> {}

export function HorizontalSeparator({ className = "", ...rest }: HorizontalSeparatorProps) {
  const separatorClassName = `horizontal-separator ${className}`.trim();

  return <hr className={separatorClassName} {...rest} />;
}
