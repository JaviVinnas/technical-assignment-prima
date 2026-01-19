import type { BadgeProps } from "../../../../../components/atoms/Badge";
import { Badge } from "../../../../../components/atoms/Badge";
import type { UserPermission } from "../../../types";

/**
 * Badge component for displaying user permission levels.
 *
 * Wrapper around the generic Badge component that maps UserPermission
 * union type values to Badge variants. Most permission values match Badge
 * variant names directly, with "inactive" mapped to "default" variant.
 *
 * Automatically renders the permission value as uppercase text.
 *
 * This is a static display component with no interactions. For interactive
 * toggle functionality, use UserPermissionBadgeToggle instead.
 *
 * @param props - UserPermissionBadge configuration
 * @param props.permission - User permission level (required)
 * @param props.className - Additional CSS classes
 */
export interface UserPermissionBadgeProps {
  permission: UserPermission;
  className?: string;
}

type BadgeVariant = BadgeProps["variant"];

/**
 * Type alias for permission to badge variant mapping.
 *
 * Makes the mapping type more semantic and reusable. Using Record ensures
 * all permissions are mapped and TypeScript will error if any are missing.
 */
type PermissionBadgeMap = Record<UserPermission, BadgeVariant>;

/**
 * Maps UserPermission values to Badge variant values.
 *
 * Uses generic accent variants to keep Badge component domain-agnostic.
 * The mapping ensures type safety at compile time while documenting the
 * relationship between permissions and their visual representation.
 *
 * TypeScript ensures exhaustive mapping - compilation fails if any
 * permission is missing from the map.
 */
const PERMISSION_TO_BADGE_VARIANT: PermissionBadgeMap = {
  admin: "accent-1",
  editor: "accent-2",
  viewer: "accent-3",
  guest: "accent-4",
  owner: "default",
  inactive: "default",
} as const satisfies PermissionBadgeMap;

export function UserPermissionBadge({ permission, className = "" }: UserPermissionBadgeProps) {
  const badgeVariant = PERMISSION_TO_BADGE_VARIANT[permission];

  // Convert permission to uppercase for display
  const displayText = permission.toUpperCase();

  return (
    <Badge variant={badgeVariant} className={className}>
      {displayText}
    </Badge>
  );
}
