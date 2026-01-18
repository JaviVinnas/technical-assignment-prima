import { memo } from "react";

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
 * This component is memoised to prevent unnecessary re-renders when used
 * in lists, as permission values are stable.
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

type BadgeVariant = "accent-1" | "accent-2" | "accent-3" | "accent-4" | "default";

/**
 * Maps UserPermission values to Badge variant values.
 *
 * Uses generic accent variants to keep Badge component domain-agnostic.
 */
const PERMISSION_TO_BADGE_VARIANT = {
  admin: "accent-1",
  editor: "accent-2",
  viewer: "accent-3",
  guest: "accent-4",
  owner: "default",
  inactive: "default",
} as const satisfies Record<UserPermission, BadgeVariant>;

function UserPermissionBadgeComponent({ permission, className = "" }: UserPermissionBadgeProps) {
  const badgeVariant = PERMISSION_TO_BADGE_VARIANT[permission];

  // Convert permission to uppercase for display
  const displayText = permission.toUpperCase();

  return (
    <Badge variant={badgeVariant} className={className}>
      {displayText}
    </Badge>
  );
}

export const UserPermissionBadge = memo(UserPermissionBadgeComponent);
