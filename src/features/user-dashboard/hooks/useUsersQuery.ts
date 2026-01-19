import { useCallback } from "react";
import type { UseAsyncOptions, UseAsyncResult } from "../../../hooks/useAsync";
import { useAsyncFiltered } from "../../../hooks/useAsyncFiltered";
import { mockUsers } from "../data/mockUsers";
import type { User, UserPermission } from "../types";
import { filterUsers } from "../utils/filterUsers";

/**
 * Custom hook for querying users with filtering and async loading simulation.
 *
 * Encapsulates user data fetching and filtering logic, combining name search
 * and permission filtering with simulated async behaviour. The hook manages
 * the entire query lifecycle including loading, error, and success states.
 *
 * The filter is memoised to prevent unnecessary recalculations when dependencies
 * haven't changed. The returned result includes a retry() callback for refetching
 * data after errors.
 *
 * @param nameContains - Search query string to match against user names (case-insensitive)
 * @param selectedPermissions - Array of permission levels to filter by (empty array shows all)
 * @param options - Optional async configuration for delay range and error probability
 * @returns Async result containing filtered users array and loading/error states
 *
 * @example
 * ```tsx
 * const result = useUsersQuery("john", ["admin", "editor"], {
 *   delayRange: [0, 500],
 *   errorProbability: 0.1,
 * });
 *
 * if (result.isLoading) return <Skeleton />;
 * if (result.isError) return <ErrorState onRetry={result.retry} />;
 * return <UserList users={result.data} />;
 * ```
 */
export function useUsersQuery(
  nameContains: string,
  selectedPermissions: UserPermission[],
  options?: UseAsyncOptions,
): UseAsyncResult<User[]> {
  const filterFn = useCallback(
    (users: User[]) => filterUsers(users, nameContains, selectedPermissions),
    [nameContains, selectedPermissions],
  );

  return useAsyncFiltered(mockUsers, filterFn, options);
}
