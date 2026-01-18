import { Badge } from "../../../../../components/atoms/Badge";
import type { UserPermission } from "../../../types";

import "./UserPermissionBadge.css";

/**
 * Badge component for displaying user permission levels.
 *
 * Wrapper around the generic Badge component that maps UserPermission
 * union type values to Badge variants. Most permission values match Badge
 * variant names directly, with "inactive" mapped to "deactivated" variant.
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

type BadgeVariant = "admin" | "editor" | "viewer" | "guest" | "owner" | "deactivated";

/**
 * Maps UserPermission values to Badge variant values.
 *
 * Most permissions map directly to their badge variant, with "inactive"
 * mapping to "deactivated".
 */
const PERMISSION_TO_BADGE_VARIANT = {
  admin: "admin",
  editor: "editor",
  viewer: "viewer",
  guest: "guest",
  owner: "deactivated",
  inactive: "deactivated",
} as const satisfies Record<UserPermission, BadgeVariant>;

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
