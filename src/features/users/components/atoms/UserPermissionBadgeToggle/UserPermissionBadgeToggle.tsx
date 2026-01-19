import type { BadgeToggleProps } from "../../../../../components/atoms/BadgeToggle";
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

type BadgeToggleVariant = BadgeToggleProps["variant"];

/**
 * Type alias for permission to badge toggle variant mapping.
 *
 * Makes the mapping type more semantic and reusable. Using Record ensures
 * all permissions are mapped and TypeScript will error if any are missing.
 */
type PermissionBadgeToggleMap = Record<UserPermission, BadgeToggleVariant>;

/**
 * Maps UserPermission values to BadgeToggle variant values.
 *
 * Uses generic accent variants to keep BadgeToggle component domain-agnostic.
 * The mapping ensures type safety at compile time while documenting the
 * relationship between permissions and their visual representation.
 *
 * TypeScript ensures exhaustive mapping - compilation fails if any
 * permission is missing from the map.
 */
const PERMISSION_TO_BADGE_VARIANT: PermissionBadgeToggleMap = {
  admin: "accent-1",
  editor: "accent-2",
  viewer: "accent-3",
  guest: "accent-4",
  owner: "default",
  inactive: "default",
} as const satisfies PermissionBadgeToggleMap;

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
