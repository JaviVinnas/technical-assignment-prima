/**
 * User permission levels.
 *
 * Union type for user permission levels that correspond to Badge variants.
 * Use `UserPermissionValues` for stable access when needed.
 */
export type UserPermission = "admin" | "editor" | "viewer" | "guest" | "owner" | "inactive";

/**
 * Stable access to user permission values.
 *
 * Provides constant access to permission values for use cases where
 * stable object property access is preferred over string literals.
 *
 * @example
 * ```tsx
 * const permission = UserPermissionValues.ADMIN; // "admin"
 * ```
 */
export const UserPermissionValues = {
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
  GUEST: "guest",
  OWNER: "owner",
  INACTIVE: "inactive",
} as const satisfies Record<Uppercase<UserPermission>, UserPermission>;

/**
 * Structure for persisted user dashboard state in localStorage.
 *
 * Represents the state that is saved to localStorage for the user dashboard,
 * including search query and selected permission filters. The selectedPermissions
 * array is readonly to prevent accidental mutations.
 */
export interface UserDashboardState {
  searchQuery: string;
  selectedPermissions: readonly UserPermission[];
}

/**
 * User data structure.
 *
 * Represents a user with their profile information including role,
 * permission level, team, and contact information.
 */
export interface User {
  role: string;
  name: string;
  permission: UserPermission;
  team: string;
  /**
   * Contact information in email format.
   * Expected format: email address string (e.g., "user@example.com")
   * Note: No runtime validation enforced - consumers should validate if needed
   */
  contactInfo: string;
}
