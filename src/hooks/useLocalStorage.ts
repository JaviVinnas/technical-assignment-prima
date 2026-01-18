import { useRef, useSyncExternalStore } from "react";

import type { UserDashboardState } from "../features/user-dashboard/types";

/**
 * All available localStorage keys defined as a const object.
 *
 * Using `as const satisfies` ensures keys are literal types that are
 * "resistant" to value changes while maintaining type inference.
 * New keys should be added here as the application grows.
 */
export const LocalStorageKeys = {
  USER_DASHBOARD_STATE: "userDashboardState",
} as const satisfies Record<string, string>;

/**
 * Type mapping that associates each localStorage key with its value type.
 *
 * This interface ensures type safety by mapping keys to their corresponding
 * value types. When adding new keys, update both LocalStorageKeys and this
 * interface.
 */
export interface LocalStorageValueMap {
  [LocalStorageKeys.USER_DASHBOARD_STATE]: UserDashboardState;
}

/**
 * Extracted union type of all valid localStorage keys.
 *
 * Can be used for type annotations when keys need to be referenced
 * without the full LocalStorageKeys object.
 */
export type LocalStorageKey = keyof typeof LocalStorageKeys;

/**
 * Factory function that creates a type-safe localStorage hook.
 *
 * Returns a React hook that manages state in localStorage with full type safety.
 * The hook ensures that only keys defined in the type map can be used, and
 * the value types match the expected types for each key.
 *
 * Uses `useSyncExternalStore` to automatically sync with localStorage changes,
 * including cross-tab synchronization via storage events.
 *
 * @returns A configured useLocalStorage hook with type safety enforced
 */
function buildLocalStorageHook<TMap extends LocalStorageValueMap>() {
  return function useLocalStorage<K extends keyof TMap>(
    key: K,
    defaultValue: TMap[K],
  ): [TMap[K], (value: TMap[K] | ((prevValue: TMap[K]) => TMap[K])) => void] {
    // Cache the last snapshot value and serialized string to ensure stable references
    // This prevents infinite loops when getSnapshot returns new object references
    const snapshotCacheRef = useRef<{
      value: TMap[K];
      serialized: string;
    } | null>(null);

    const getSnapshot = (): TMap[K] => {
      try {
        const item = localStorage.getItem(key as string);
        let newValue: TMap[K];
        let serialized: string;

        if (item) {
          newValue = JSON.parse(item) as TMap[K];
          serialized = item;
        } else {
          newValue = defaultValue;
          serialized = JSON.stringify(defaultValue);
        }

        // If the cached value exists and the serialized strings match, return the cached reference
        // This ensures stable references for the same value, preventing infinite loops
        if (snapshotCacheRef.current && snapshotCacheRef.current.serialized === serialized) {
          return snapshotCacheRef.current.value;
        }

        // Value has changed, update cache and return new reference
        snapshotCacheRef.current = {
          value: newValue,
          serialized,
        };

        return newValue;
      } catch {
        // Silently fall back to default value if localStorage is unavailable
        // This is expected behaviour for localStorage (private browsing, etc.)
        const serialized = JSON.stringify(defaultValue);

        // Check if cached value matches default
        if (snapshotCacheRef.current && snapshotCacheRef.current.serialized === serialized) {
          return snapshotCacheRef.current.value;
        }

        snapshotCacheRef.current = {
          value: defaultValue,
          serialized,
        };

        return defaultValue;
      }
    };

    const getServerSnapshot = (): TMap[K] => {
      // Server-side rendering: localStorage is not available
      // Use cached reference if available to maintain consistency
      const serialized = JSON.stringify(defaultValue);

      if (snapshotCacheRef.current && snapshotCacheRef.current.serialized === serialized) {
        return snapshotCacheRef.current.value;
      }

      snapshotCacheRef.current = {
        value: defaultValue,
        serialized,
      };

      return defaultValue;
    };

    const subscribe = (onStoreChange: () => void) => {
      // Listen for storage events (cross-tab synchronization)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key || e.key === null) {
          // e.key === null means all keys were cleared
          onStoreChange();
        }
      };

      window.addEventListener("storage", handleStorageChange);

      // Also listen for custom events from same-tab updates
      // This ensures we catch updates made in the same tab
      const handleCustomStorageChange = (e: CustomEvent<string>) => {
        if (e.detail === key) {
          onStoreChange();
        }
      };

      window.addEventListener("localStorageChange", handleCustomStorageChange as EventListener);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener(
          "localStorageChange",
          handleCustomStorageChange as EventListener,
        );
      };
    };

    const storedValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const setValue = (value: TMap[K] | ((prevValue: TMap[K]) => TMap[K])) => {
      try {
        const newValue =
          typeof value === "function"
            ? (value as (prevValue: TMap[K]) => TMap[K])(getSnapshot())
            : value;
        localStorage.setItem(key as string, JSON.stringify(newValue));
        // Dispatch custom event for same-tab synchronization
        window.dispatchEvent(new CustomEvent("localStorageChange", { detail: key }));
      } catch {
        // Silently fail if localStorage is unavailable
        // This is expected behaviour for localStorage (private browsing, etc.)
      }
    };

    return [storedValue, setValue];
  };
}

/**
 * Type-safe localStorage hook configured with LocalStorageValueMap.
 *
 * This is the single point of access for localStorage in React components.
 * It enforces type safety by only accepting keys defined in LocalStorageKeys
 * and ensuring value types match the LocalStorageValueMap.
 *
 * @example
 * ```tsx
 * const [state, setState] = useLocalStorage(
 *   LocalStorageKeys.USER_DASHBOARD_STATE,
 *   { searchQuery: "", selectedPermissions: [] }
 * );
 * ```
 */
export const useLocalStorage = buildLocalStorageHook<LocalStorageValueMap>();
