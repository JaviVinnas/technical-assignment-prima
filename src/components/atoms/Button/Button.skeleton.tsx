import type { HTMLAttributes } from "react";

import type { ButtonProps } from "./Button";
import "./Button.skeleton.css";

/**
 * Button skeleton component for loading states.
 *
 * A skeleton placeholder that matches the dimensions of the Button component.
 * Used during loading states to prevent layout shift. Displays as a light
 * grey rectangle with the same height, border radius, and sizing as the
 * actual Button component. Supports both size variants (small and big).
 *
 * The variant type is composed directly from ButtonProps to ensure it stays
 * in sync with the Button component's variant type.
 *
 * This component explicitly does not accept children as it is a simple
 * placeholder element with no content.
 *
 * @param props - ButtonSkeleton configuration
 * @param props.variant - Size variant: "big" or "small" (required)
 * @param props.className - Additional CSS classes
 */
export interface ButtonSkeletonProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  variant: ButtonProps["variant"];
  className?: string;
}

export function ButtonSkeleton({ variant, className = "", ...rest }: ButtonSkeletonProps) {
  const skeletonClassName = `button-skeleton button-skeleton--${variant} ${className}`.trim();

  return <span className={skeletonClassName} {...rest} />;
}
