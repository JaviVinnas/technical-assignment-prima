import type { ReactNode } from "react";

import { CardGrid, type CardGridProps } from "./CardGrid";

/**
 * CardGrid skeleton component for loading states.
 *
 * A skeleton placeholder that renders multiple skeleton cards in a grid layout.
 * Accepts children to allow flexibility in what skeleton cards to render.
 * Uses the real CardGrid component for consistent layout.
 *
 * @param props - CardGridSkeleton configuration
 * @param props.children - Skeleton card components to display (required)
 * @param props.minColumnWidth - Minimum width for each grid column (inherited from CardGrid)
 * @param props.gap - Gap between grid items (inherited from CardGrid)
 * @param props.className - Additional CSS classes
 */
export interface CardGridSkeletonProps
  extends Omit<CardGridProps, "children" | "minColumnWidth" | "gap"> {
  children: ReactNode;
  minColumnWidth?: string;
  gap?: string;
}

export function CardGridSkeleton({
  children,
  minColumnWidth,
  gap,
  ...rest
}: CardGridSkeletonProps) {
  return (
    <CardGrid minColumnWidth={minColumnWidth} gap={gap} {...rest}>
      {children}
    </CardGrid>
  );
}
