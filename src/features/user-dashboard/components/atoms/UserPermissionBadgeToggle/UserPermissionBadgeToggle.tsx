import { BadgeToggle } from "../../../../../components/atoms/BadgeToggle";
import type { UserPermission } from "../../../types";

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

type BadgeToggleVariant = "accent-1" | "accent-2" | "accent-3" | "accent-4" | "default";

/**
 * Maps UserPermission values to BadgeToggle variant values.
 *
 * Uses generic accent variants to keep BadgeToggle component domain-agnostic.
 */
const PERMISSION_TO_BADGE_VARIANT = {
  admin: "accent-1",
  editor: "accent-2",
  viewer: "accent-3",
  guest: "accent-4",
  owner: "default",
  inactive: "default",
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
