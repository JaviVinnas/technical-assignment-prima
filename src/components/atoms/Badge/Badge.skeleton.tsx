import type { HTMLAttributes } from "react";

import "./Badge.skeleton.css";

/**
 * Badge skeleton component for loading states.
 *
 * A skeleton placeholder that matches the dimensions of the Badge component.
 * Used during loading states to prevent layout shift. Displays as a light
 * grey rectangle with the same padding, border radius, and sizing as the
 * actual Badge component.
 *
 * @param props - BadgeSkeleton configuration
 * @param props.className - Additional CSS classes
 */
export interface BadgeSkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

export function BadgeSkeleton({ className = "", ...rest }: BadgeSkeletonProps) {
  const skeletonClassName = `badge-skeleton ${className}`.trim();

  return <span className={skeletonClassName} {...rest} />;
}
