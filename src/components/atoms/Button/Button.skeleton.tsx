import type { HTMLAttributes } from "react";

import "./Button.skeleton.css";

/**
 * Button skeleton component for loading states.
 *
 * A skeleton placeholder that matches the dimensions of the Button component.
 * Used during loading states to prevent layout shift. Displays as a light
 * grey rectangle with the same height, border radius, and sizing as the
 * actual Button component. Supports both size variants (small and big).
 *
 * @param props - ButtonSkeleton configuration
 * @param props.variant - Size variant: "big" or "small" (required)
 * @param props.className - Additional CSS classes
 */
export interface ButtonSkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  variant: "big" | "small";
  className?: string;
}

export function ButtonSkeleton({ variant, className = "", ...rest }: ButtonSkeletonProps) {
  const skeletonClassName = `button-skeleton button-skeleton--${variant} ${className}`.trim();

  return <span className={skeletonClassName} {...rest} />;
}
