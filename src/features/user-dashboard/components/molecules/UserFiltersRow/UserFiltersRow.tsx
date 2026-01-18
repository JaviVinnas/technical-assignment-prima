import { useCallback } from "react";

import { FiltersRow } from "../../../../../components/molecules/FiltersRow";
import { useUserDashboardContext } from "../../../context";
import type { UserPermission } from "../../../types";
import { UserPermissionValues } from "../../../types";
import { UserPermissionBadgeToggle } from "../../atoms/UserPermissionBadgeToggle";

import "./UserFiltersRow.css";

/**
 * User-specific filter row component for permission filtering.
 *
 * Displays a row of clickable permission filters for filtering users in
 * the dashboard. Supports multiple selection with OR logic (users matching
 * any selected permission are shown).
 *
 * @param props - UserFiltersRow configuration
 * @param props.className - Additional CSS classes applied to the container
 */
export interface UserFiltersRowProps {
  className?: string;
}

/**
 * All available user permission options for filtering.
 */
const PERMISSION_OPTIONS: UserPermission[] = [
  UserPermissionValues.ADMIN,
  UserPermissionValues.EDITOR,
  UserPermissionValues.VIEWER,
  UserPermissionValues.GUEST,
  UserPermissionValues.OWNER,
  UserPermissionValues.INACTIVE,
];

export function UserFiltersRow({ className = "" }: UserFiltersRowProps) {
  const { selectedPermissions, togglePermission } = useUserDashboardContext();

  const renderPermissionOption = useCallback(
    (permission: UserPermission, isSelected: boolean, onClick: () => void) => {
      return (
        <UserPermissionBadgeToggle
          permission={permission}
          isActive={isSelected}
          onClick={onClick}
        />
      );
    },
    [],
  );

  return (
    <FiltersRow
      label="FILTER BY:"
      options={PERMISSION_OPTIONS}
      selected={selectedPermissions}
      onToggle={togglePermission}
      renderOption={renderPermissionOption}
      className={className}
    />
  );
}
