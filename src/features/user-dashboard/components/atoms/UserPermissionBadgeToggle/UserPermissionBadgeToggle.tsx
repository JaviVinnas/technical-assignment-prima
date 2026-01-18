import { BadgeToggle } from "../../../../../components/atoms/BadgeToggle";
import type { UserPermission } from "../../../types";

import "./UserPermissionBadgeToggle.css";

/**
 * BadgeToggle component for displaying and toggling user permission levels.
 *
 * Displays a clickable badge toggle for a user permission level. Shows the
 * permission name in uppercase. When active, displays a checkmark icon to
 * indicate the toggle state. Supports keyboard navigation and has proper
 * ARIA attributes for accessibility.
 *
 * For static display badges without interaction, use UserPermissionBadge instead.
 *
 * @param props - UserPermissionBadgeToggle configuration
 * @param props.permission - User permission level (required)
 * @param props.isActive - Whether the toggle is in active state (shows checkmark when true)
 * @param props.className - Additional CSS classes
 * @param props.onClick - Click handler function
 */
export interface UserPermissionBadgeToggleProps {
  permission: UserPermission;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

type BadgeToggleVariant = "admin" | "editor" | "viewer" | "guest" | "owner" | "deactivated";

/**
 * Maps UserPermission values to BadgeToggle variant values.
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
} as const satisfies Record<UserPermission, BadgeToggleVariant>;

export function UserPermissionBadgeToggle({
  permission,
  isActive = false,
  className = "",
  onClick,
}: UserPermissionBadgeToggleProps) {
  const badgeVariant = PERMISSION_TO_BADGE_VARIANT[permission];

  const displayText = permission.toUpperCase();

  return (
    <BadgeToggle variant={badgeVariant} className={className} isActive={isActive} onClick={onClick}>
      {displayText}
    </BadgeToggle>
  );
}
