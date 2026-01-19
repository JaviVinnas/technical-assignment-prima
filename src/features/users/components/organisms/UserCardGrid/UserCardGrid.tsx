import { CardGrid } from "../../../../../components/organisms/CardGrid";
import { EmptyState } from "../../../../../components/organisms/EmptyState";
import { ErrorState } from "../../../../../components/organisms/ErrorState";
import { showNotImplementedAlert } from "../../../../../utils";
import { DEFAULT_SKELETON_COUNT, USER_QUERY_ASYNC_OPTIONS } from "../../../../../constants";
import { useUserDashboardContext } from "../../../context";
import { useUsersQuery } from "../../../hooks/useUsersQuery";
import type { User } from "../../../types";
import { UserCard } from "../../molecules/UserCard";
import { UserCardGridSkeleton } from "./UserCardGrid.skeleton";

import "./UserCardGrid.css";

/**
 * UserCardGrid presentational component for displaying user cards in a grid layout.
 *
 * A pure presentational component that renders user cards based on provided data
 * and state. Handles loading, error, and empty states with appropriate UI feedback.
 * This component is easily testable in isolation as it accepts all data via props.
 *
 * Features:
 * - Responsive grid layout for user cards
 * - Loading state with skeleton placeholders
 * - Error state with retry capability
 * - Empty state for no results
 * - Flexible action handler injection
 *
 * For context-integrated usage, use UserCardGridContainer instead.
 *
 * @param props - UserCardGrid configuration
 * @param props.users - Array of users to display in the grid
 * @param props.isLoading - Whether data is currently loading
 * @param props.isError - Whether an error occurred during data fetch
 * @param props.error - Error object when isError is true
 * @param props.onRetry - Callback invoked when user clicks retry button
 * @param props.onViewDetails - Callback invoked when user clicks "View details" on a card
 * @param props.className - Additional CSS classes applied to the container
 */
export interface UserCardGridProps {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  onRetry: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export function UserCardGrid({
  users,
  isLoading,
  isError,
  error: _error,
  onRetry,
  onViewDetails,
  className = "",
}: UserCardGridProps) {
  const userCardGridClassName = `user-card-grid ${className}`.trim();

  if (isLoading) {
    return <UserCardGridSkeleton count={DEFAULT_SKELETON_COUNT} className={className} />;
  }

  if (isError) {
    return (
      <section className={userCardGridClassName}>
        <ErrorState message="Failed to load users." onRetry={onRetry} />
      </section>
    );
  }

  if (users.length === 0) {
    return (
      <section className={userCardGridClassName}>
        <EmptyState message="No users found matching your criteria." />
      </section>
    );
  }

  return (
    <section className={userCardGridClassName} aria-label="User Directory">
      <CardGrid aria-label="User Grid">
        {users.map((user) => (
          <UserCard key={user.contactInfo} user={user} onViewDetails={onViewDetails} />
        ))}
      </CardGrid>
    </section>
  );
}

/**
 * Container component that connects UserCardGrid to the user dashboard context.
 *
 * This container handles the integration with UserDashboardContext and data fetching,
 * managing the user query lifecycle including loading, error, and success states.
 * The presentational UserCardGrid component remains testable in isolation.
 *
 * Use this component in the user dashboard page where context integration is needed.
 * Use the base UserCardGrid component directly for testing or reuse in other contexts.
 *
 * @param props - UserCardGridContainer configuration
 * @param props.className - Additional CSS classes applied to the container
 */
export interface UserCardGridContainerProps {
  className?: string;
}

export function UserCardGridContainer({ className }: UserCardGridContainerProps) {
  const { searchQuery, selectedPermissions } = useUserDashboardContext();

  const asyncResult = useUsersQuery(searchQuery, selectedPermissions, USER_QUERY_ASYNC_OPTIONS);

  return (
    <UserCardGrid
      users={asyncResult.isSuccess ? asyncResult.data : []}
      isLoading={asyncResult.isLoading}
      isError={asyncResult.isError}
      error={asyncResult.isError ? asyncResult.error : undefined}
      onRetry={asyncResult.retry}
      onViewDetails={showNotImplementedAlert}
      className={className}
    />
  );
}
