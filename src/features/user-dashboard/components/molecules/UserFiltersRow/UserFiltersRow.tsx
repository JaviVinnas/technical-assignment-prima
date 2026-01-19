import { FiltersRow } from "../../../../../components/molecules/FiltersRow";
import { useUserDashboardContext } from "../../../context";
import type { UserPermission } from "../../../types";
import { UserPermissionValues } from "../../../types";
import { UserPermissionBadgeToggle } from "../../atoms/UserPermissionBadgeToggle";

/**
 * All available user permission options for filtering.
 *
 * Marked as readonly to prevent accidental mutations and ensure
 * the list of available permissions remains constant.
 */
const PERMISSION_OPTIONS: readonly UserPermission[] = [
  UserPermissionValues.ADMIN,
  UserPermissionValues.EDITOR,
  UserPermissionValues.VIEWER,
  UserPermissionValues.GUEST,
  UserPermissionValues.OWNER,
  UserPermissionValues.INACTIVE,
] as const;

/**
 * Renders a permission filter option as a badge toggle.
 *
 * Extracted as a module-level function to maintain stable reference identity
 * without unnecessary useCallback or memoisation overhead.
 *
 * @param permission - User permission level to render
 * @param isSelected - Whether this permission is currently selected
 * @param onClick - Callback to invoke when the badge is clicked
 */
function renderPermissionOption(
  permission: UserPermission,
  isSelected: boolean,
  onClick: () => void,
) {
  return (
    <UserPermissionBadgeToggle permission={permission} isActive={isSelected} onClick={onClick} />
  );
}

/**
 * User-specific filter row presentational component for permission filtering.
 *
 * A pure presentational component that displays a row of clickable permission
 * filters. Supports multiple selection with OR logic (users matching any
 * selected permission are shown). This component is easily testable in isolation
 * as it accepts all data via props.
 *
 * For context-integrated usage, use UserFiltersRowContainer instead.
 *
 * @param props - UserFiltersRow configuration
 * @param props.selectedPermissions - Array of currently selected permission filters
 * @param props.onToggle - Callback invoked when a permission filter is toggled
 * @param props.className - Additional CSS classes applied to the container
 */
export interface UserFiltersRowProps {
  selectedPermissions: readonly UserPermission[];
  onToggle: (permission: UserPermission) => void;
  className?: string;
}

export function UserFiltersRow({
  selectedPermissions,
  onToggle,
  className = "",
}: UserFiltersRowProps) {
  return (
    <FiltersRow
      label="FILTER BY:"
      options={PERMISSION_OPTIONS}
      selected={selectedPermissions}
      onToggle={onToggle}
      renderOption={renderPermissionOption}
      className={className}
    />
  );
}

/**
 * Container component that connects UserFiltersRow to the user dashboard context.
 *
 * This container handles the integration with UserDashboardContext, managing
 * the selected permissions state through localStorage-backed context. The
 * presentational UserFiltersRow component remains testable in isolation.
 *
 * Use this component in the user dashboard page where context integration is needed.
 * Use the base UserFiltersRow component directly for testing or reuse in other contexts.
 *
 * @param props - UserFiltersRowContainer configuration
 * @param props.className - Additional CSS classes applied to the container
 */
export interface UserFiltersRowContainerProps {
  className?: string;
}

export function UserFiltersRowContainer({ className }: UserFiltersRowContainerProps) {
  const { selectedPermissions, togglePermission } = useUserDashboardContext();

  return (
    <UserFiltersRow
      selectedPermissions={selectedPermissions}
      onToggle={togglePermission}
      className={className}
    />
  );
}
