import { createContext, type ReactNode, useCallback, useContext, useMemo } from "react";

import { LocalStorageKeys, useLocalStorage } from "../../../hooks/useLocalStorage";
import type { UserDashboardState, UserPermission } from "../types";

/**
 * Context value type for user dashboard state.
 *
 * Provides all state values and setter functions for managing the user
 * dashboard, including search query and permission filters. The selectedPermissions
 * array is readonly to prevent accidental mutations.
 *
 * This type is exported to enable better testability and type composition.
 * Components can use utility types to extract only the parts of the context
 * they need.
 */
export interface UserDashboardContextValue {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  selectedPermissions: readonly UserPermission[];
  setSelectedPermissions: (selectedPermissions: UserPermission[]) => void;
  togglePermission: (permission: UserPermission) => void;
}

/**
 * Type representing the state portion of the dashboard context.
 *
 * Extracts only the state properties (data) without the setter functions.
 * Useful for components that only read state without modifying it.
 *
 * @example
 * ```tsx
 * function DisplayComponent() {
 *   const { searchQuery, selectedPermissions }: UserDashboardStateOnly =
 *     useUserDashboardContext();
 *   // Component can only access state, not setters
 * }
 * ```
 */
export type UserDashboardStateOnly = Pick<
  UserDashboardContextValue,
  "searchQuery" | "selectedPermissions"
>;

/**
 * Type representing the actions portion of the dashboard context.
 *
 * Extracts only the action functions (setters) without the state values.
 * Useful for components that only modify state without reading it, or
 * for testing action handlers in isolation.
 *
 * @example
 * ```tsx
 * function ControlComponent() {
 *   const { setSearchQuery, togglePermission }: UserDashboardActions =
 *     useUserDashboardContext();
 *   // Component can only access actions, not state
 * }
 * ```
 */
export type UserDashboardActions = Pick<
  UserDashboardContextValue,
  "setSearchQuery" | "setSelectedPermissions" | "togglePermission"
>;

/**
 * React context for user dashboard state management.
 *
 * This context provides access to the user dashboard state within the
 * UserDashboardPage component tree. Components must be wrapped by
 * UserDashboardProvider to access this context.
 */
const UserDashboardContext = createContext<UserDashboardContextValue | undefined>(undefined);

/**
 * Default state values when no persisted state exists.
 */
const DEFAULT_STATE: UserDashboardState = {
  searchQuery: "",
  selectedPermissions: [],
};

/**
 * Type for partial state updates.
 *
 * Allows updating one or more state properties without requiring all properties.
 * Used for flexible state modifications where only specific fields need to change.
 */
export type UserDashboardStateUpdate = Partial<UserDashboardState>;

/**
 * Internal hook for managing user dashboard state with localStorage persistence.
 *
 * Manages search query and selected permission filters, persisting state to
 * localStorage and restoring it on initial mount.
 *
 * This hook is used internally by UserDashboardProvider and is not exported.
 *
 * @returns Object containing state values and setter functions
 */
function useUserDashboardState() {
  const [state, setState] = useLocalStorage(LocalStorageKeys.USER_DASHBOARD_STATE, DEFAULT_STATE);

  const setSearchQuery = useCallback(
    (searchQuery: string) => {
      setState((prevState) => ({ ...prevState, searchQuery }));
    },
    [setState],
  );

  const setSelectedPermissions = useCallback(
    (selectedPermissions: UserPermission[]) => {
      setState((prevState) => ({ ...prevState, selectedPermissions }));
    },
    [setState],
  );

  /**
   * Toggle a permission filter on/off.
   *
   * If the permission is already selected, it will be removed.
   * If it's not selected, it will be added.
   *
   * @param permission - Permission to toggle
   */
  const togglePermission = useCallback(
    (permission: UserPermission) => {
      setState((prevState) => {
        const updatedPermissions = prevState.selectedPermissions.includes(permission)
          ? prevState.selectedPermissions.filter((p) => p !== permission)
          : [...prevState.selectedPermissions, permission];

        return { ...prevState, selectedPermissions: updatedPermissions };
      });
    },
    [setState],
  );

  return {
    searchQuery: state.searchQuery,
    setSearchQuery,
    selectedPermissions: state.selectedPermissions,
    setSelectedPermissions,
    togglePermission,
  };
}

/**
 * Provider component for user dashboard state context.
 *
 * Wraps the user dashboard state management and provides it to all
 * child components via React Context. Manages state with localStorage
 * persistence internally.
 *
 * This provider scopes the dashboard state to the UserDashboardPage
 * component tree, preventing misuse of the state outside of its
 * intended context and allowing for future migration to local state
 * if needed.
 *
 * @param props - UserDashboardProvider configuration
 * @param props.children - Child components that will have access to the context
 *
 * @example
 * ```tsx
 * <UserDashboardProvider>
 *   <UserDashboardPage />
 * </UserDashboardProvider>
 * ```
 */
export function UserDashboardProvider({ children }: { children: ReactNode }) {
  const {
    searchQuery,
    setSearchQuery,
    selectedPermissions,
    setSelectedPermissions,
    togglePermission,
  } = useUserDashboardState();

  const contextValue = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      selectedPermissions,
      setSelectedPermissions,
      togglePermission,
    }),
    [searchQuery, selectedPermissions, setSearchQuery, setSelectedPermissions, togglePermission],
  );

  return (
    <UserDashboardContext.Provider value={contextValue}>{children}</UserDashboardContext.Provider>
  );
}

/**
 * Custom hook to access user dashboard state context.
 *
 * Returns the user dashboard state and setter functions. Must be used
 * within a component that is wrapped by UserDashboardProvider.
 *
 * Throws an error if used outside of the provider to prevent misuse
 * and provide clear debugging information.
 *
 * @returns User dashboard state and setter functions
 * @throws Error if used outside UserDashboardProvider
 *
 * @example
 * ```tsx
 * function UserSearchBox() {
 *   const { searchQuery, setSearchQuery } = useUserDashboardContext();
 *   // Use searchQuery and setSearchQuery...
 * }
 * ```
 */
export function useUserDashboardContext(): UserDashboardContextValue {
  const context = useContext(UserDashboardContext);

  if (context === undefined) {
    throw new Error("useUserDashboardContext must be used within a UserDashboardProvider");
  }

  return context;
}
