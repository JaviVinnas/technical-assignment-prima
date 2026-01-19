import type { HTMLAttributes, ReactNode } from "react";

import "./CardGrid.css";

/**
 * CardGrid component for displaying cards in a responsive grid layout.
 *
 * A reusable organism component that provides a responsive grid layout
 * for displaying cards. Uses CSS Grid with auto-fill to create a flexible
 * layout that adapts to different screen sizes.
 *
 * This is a reusable component that can be used in any context where a
 * grid of cards is needed (product grids, dashboard widgets, gallery views).
 *
 * @param props - CardGrid configuration
 * @param props.children - Card components to display in the grid (required)
 * @param props.minColumnWidth - Minimum width for each grid column (defaults to var(--grid-min-column-width))
 * @param props.gap - Gap between grid items (defaults to var(--spacing-lg))
 * @param props.className - Additional CSS classes
 */
export interface CardGridProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  minColumnWidth?: string;
  gap?: string;
}

export function CardGrid({
  children,
  minColumnWidth = "var(--grid-min-column-width)",
  gap = "var(--spacing-lg)",
  className = "",
  style,
  ...rest
}: CardGridProps) {
  const cardGridClassName = `card-grid ${className}`.trim();
  const cardGridStyle: React.CSSProperties & {
    "--card-grid-min-column-width": string;
    "--card-grid-gap": string;
  } = {
    ...style,
    "--card-grid-min-column-width": minColumnWidth,
    "--card-grid-gap": gap,
  };

  return (
    <section className={cardGridClassName} style={cardGridStyle} {...rest}>
      {children}
    </section>
  );
}
