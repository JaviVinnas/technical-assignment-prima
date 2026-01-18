import { useCallback, useState } from "react";

import { CardGrid } from "../../../../../components/organisms/CardGrid";
import { EmptyState } from "../../../../../components/organisms/EmptyState";
import { ErrorState } from "../../../../../components/organisms/ErrorState";
import { useAsyncFiltered } from "../../../../../hooks/useAsyncFiltered";
import { useUserDashboardContext } from "../../../context";
import { mockUsers } from "../../../data/mockUsers";
import type { User } from "../../../types";
import { filterUsers } from "../../../utils/filterUsers";
import { UserCard } from "../../molecules/UserCard";
import { UserCardGridSkeleton } from "./UserCardGrid.skeleton";

import "./UserCardGrid.css";

/**
 * UserCardGrid component for displaying filtered user cards in a grid layout.
 *
 * Displays user cards in a responsive grid, automatically filtered based on
 * the current search query and selected permission filters. Handles loading,
 * error, and empty states with appropriate UI feedback.
 *
 * Features:
 * - Real-time filtering: updates automatically as filters change
 * - Async data loading: shows skeleton during data fetch
 * - Error handling: displays error state with retry capability
 * - Automatic empty state: displays message when no results match
 * - Integrated state management: synchronised with dashboard filters
 *
 * @param props - UserCardGrid configuration
 * @param props.className - Additional CSS classes applied to the container
 */
export interface UserCardGridProps {
  className?: string;
}

export function UserCardGrid({ className = "" }: UserCardGridProps) {
  const { searchQuery, selectedPermissions } = useUserDashboardContext();
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const filterFn = useCallback(
    (users: User[]) => filterUsers(users, searchQuery, selectedPermissions),
    [searchQuery, selectedPermissions],
  );

  const asyncResult = useAsyncFiltered(mockUsers, filterFn, refetchTrigger, {
    delayRange: [0, 500],
    errorProbability: 0.1,
  });

  const userCardGridClassName = `user-card-grid ${className}`.trim();

  const handleRetry = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  if (asyncResult.isLoading) {
    return <UserCardGridSkeleton count={6} className={className} />;
  }

  if (asyncResult.isError) {
    return (
      <section className={userCardGridClassName}>
        <ErrorState message="Failed to load users. Please try again." onRetry={handleRetry} />
      </section>
    );
  }

  if (asyncResult.data.length === 0) {
    return (
      <section className={userCardGridClassName}>
        <EmptyState message="No users found matching your criteria." />
      </section>
    );
  }

  return (
    <section className={userCardGridClassName}>
      <CardGrid>
        {asyncResult.data.map((user) => (
          <UserCard key={user.contactInfo} user={user} />
        ))}
      </CardGrid>
    </section>
  );
}
