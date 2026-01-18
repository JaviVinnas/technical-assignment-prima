import type { SVGProps } from "react";

import "./CheckIcon.css";

/**
 * CheckIcon component - a checkmark SVG icon.
 *
 * A reusable checkmark icon component that can be styled and sized as needed.
 * Uses currentColor for the stroke, allowing it to inherit the text colour
 * from its parent container.
 *
 * @param props - CheckIcon configuration
 * @param props.size - Size of the icon (defaults to 12)
 * @param props.className - Additional CSS classes
 */
export interface CheckIconProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height" | "viewBox"> {
  size?: number;
}

export function CheckIcon({ size = 12, className = "", ...rest }: CheckIconProps) {
  return (
    <svg
      className={`check-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...rest}
    >
      <path
        d="M2 7L5 10L12 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
