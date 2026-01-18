import { createContext, type ReactNode, useContext } from "react";

import { LocalStorageKeys, useLocalStorage } from "../../../hooks/useLocalStorage";
import type { UserDashboardState, UserPermission } from "../types";

/**
 * Context value type for user dashboard state.
 *
 * Provides all state values and setter functions for managing the user
 * dashboard, including search query and permission filters.
 */
interface UserDashboardContextValue {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  selectedPermissions: UserPermission[];
  setSelectedPermissions: (selectedPermissions: UserPermission[]) => void;
  togglePermission: (permission: UserPermission) => void;
}

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

  const setSearchQuery = (searchQuery: string) => {
    setState((prevState) => ({ ...prevState, searchQuery }));
  };

  const setSelectedPermissions = (selectedPermissions: UserPermission[]) => {
    setState((prevState) => ({ ...prevState, selectedPermissions }));
  };

  /**
   * Toggle a permission filter on/off.
   *
   * If the permission is already selected, it will be removed.
   * If it's not selected, it will be added.
   *
   * @param permission - Permission to toggle
   */
  const togglePermission = (permission: UserPermission) => {
    setState((prevState) => {
      const updatedPermissions = prevState.selectedPermissions.includes(permission)
        ? prevState.selectedPermissions.filter((p) => p !== permission)
        : [...prevState.selectedPermissions, permission];

      return { ...prevState, selectedPermissions: updatedPermissions };
    });
  };

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
  const dashboardState = useUserDashboardState();

  return (
    <UserDashboardContext.Provider value={dashboardState}>{children}</UserDashboardContext.Provider>
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
