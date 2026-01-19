import type { User, UserPermission } from "../types";

/**
 * Filters users based on search query and selected permissions.
 *
 * Applies two filters with AND logic:
 * 1. Text search: matches if user name contains the search query (case-insensitive)
 * 2. Permission filter: matches if user permission is in selected permissions array
 *    (OR logic - if no permissions selected, shows all users)
 *
 * Accepts readonly arrays to ensure immutability and prevent accidental
 * mutations of the source data.
 *
 * @param users - Array of users to filter (readonly)
 * @param searchQuery - Search query string to match against user names (case-insensitive)
 * @param selectedPermissions - Array of selected permission levels for filtering (readonly)
 * @returns Filtered array of users matching both criteria
 *
 * @example
 * ```tsx
 * const filtered = filterUsers(users, "john", ["admin", "editor"]);
 * // Returns users with "john" in name AND (admin OR editor permission)
 * ```
 */
export function filterUsers(
  users: readonly User[],
  searchQuery: string,
  selectedPermissions: readonly UserPermission[],
): User[] {
  return users.filter((user) => {
    // Text search: match if name contains search query (case-insensitive)
    // Normalize multiple spaces in search query to handle "bob   smith" -> "bob smith"
    const normalizedQuery = searchQuery.toLowerCase().trim().replace(/\s+/g, " ");
    const normalizedName = user.name.toLowerCase().replace(/\s+/g, " ");

    const matchesSearch = normalizedQuery === "" || normalizedName.includes(normalizedQuery);

    // Permission filter: match if permission is in selected permissions
    // If no permissions selected, show all users (OR logic)
    const matchesPermission =
      selectedPermissions.length === 0 || selectedPermissions.includes(user.permission);

    // Both filters must match (AND logic)
    return matchesSearch && matchesPermission;
  });
}
