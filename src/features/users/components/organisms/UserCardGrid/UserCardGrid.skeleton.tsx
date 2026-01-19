import { CardGridSkeleton } from "../../../../../components/organisms/CardGrid/CardGrid.skeleton";
import { UserCardSkeleton } from "../../molecules/UserCard/UserCard.skeleton";

/**
 * UserCardGrid skeleton component for loading states.
 *
 * A skeleton placeholder that matches the structure of UserCardGrid, displaying
 * multiple UserCard skeletons in a grid layout. Used during data fetching to
 * prevent layout shift and provide visual feedback that content is loading.
 *
 * @param props - UserCardGridSkeleton configuration
 * @param props.count - Number of skeleton cards to display (defaults to 6)
 * @param props.className - Additional CSS classes
 */
export interface UserCardGridSkeletonProps {
  count?: number;
  className?: string;
}

export function UserCardGridSkeleton({ count = 6, className = "" }: UserCardGridSkeletonProps) {
  const userCardGridClassName = `user-card-grid ${className}`.trim();

  return (
    <section className={userCardGridClassName} aria-busy="true" aria-label="Loading users">
      <CardGridSkeleton>
        {Array.from({ length: count }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton items are static and presentational, order never changes
          <UserCardSkeleton key={`user-card-skeleton-${index}`} />
        ))}
      </CardGridSkeleton>
    </section>
  );
}
