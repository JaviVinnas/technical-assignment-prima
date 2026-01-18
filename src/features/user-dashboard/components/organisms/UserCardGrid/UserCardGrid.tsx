import { useMemo } from "react";

import { CardGrid } from "../../../../../components/organisms/CardGrid";
import { EmptyState } from "../../../../../components/organisms/EmptyState";
import { useUserDashboardContext } from "../../../context";
import { mockUsers } from "../../../data/mockUsers";
import { filterUsers } from "../../../utils/filterUsers";
import { UserCard } from "../../molecules/UserCard";

import "./UserCardGrid.css";

/**
 * UserCardGrid component for displaying filtered user cards in a grid layout.
 *
 * Displays user cards in a responsive grid, automatically filtered based on
 * the current search query and selected permission filters. Shows an empty
 * state message when no users match the current filter criteria.
 *
 * Features:
 * - Real-time filtering: updates automatically as filters change
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

  const filteredUsers = useMemo(
    () => filterUsers(mockUsers, searchQuery, selectedPermissions),
    [searchQuery, selectedPermissions],
  );

  const userCardGridClassName = `user-card-grid ${className}`.trim();

  if (filteredUsers.length === 0) {
    return (
      <section className={userCardGridClassName}>
        <EmptyState message="No users found matching your criteria." />
      </section>
    );
  }

  return (
    <section className={userCardGridClassName}>
      <CardGrid>
        {filteredUsers.map((user) => (
          <UserCard key={user.contactInfo} user={user} />
        ))}
      </CardGrid>
    </section>
  );
}
