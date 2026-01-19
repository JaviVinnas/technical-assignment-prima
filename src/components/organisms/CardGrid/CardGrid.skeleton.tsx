import { CardGrid, type CardGridProps } from "./CardGrid";

/**
 * CardGrid skeleton component for loading states.
 *
 * A skeleton placeholder that renders multiple skeleton cards in a grid layout.
 * Accepts children to allow flexibility in what skeleton cards to render.
 * Uses the real CardGrid component for consistent layout.
 *
 * Directly extends CardGridProps to inherit all props including children,
 * minColumnWidth, and gap. This ensures type consistency and eliminates
 * redundant type declarations.
 *
 * @param props - CardGridSkeleton configuration
 * @param props.children - Skeleton card components to display (required)
 * @param props.minColumnWidth - Minimum width for each grid column (inherited from CardGrid)
 * @param props.gap - Gap between grid items (inherited from CardGrid)
 * @param props.className - Additional CSS classes
 */
export interface CardGridSkeletonProps extends CardGridProps {
  // All props inherited from CardGridProps
}

export function CardGridSkeleton(props: CardGridSkeletonProps) {
  return <CardGrid {...props} />;
}
