import { useMemo } from "react";

import type { UseAsyncOptions, UseAsyncResult } from "./useAsync";
import { useAsync } from "./useAsync";

/**
 * Custom hook that combines filtering logic with async data loading.
 *
 * Applies a filter function to data before simulating async loading, making
 * it easy to compose filtering with async behaviour. The filter is memoised
 * to prevent unnecessary recalculations.
 *
 * @param data - Original data array to filter
 * @param filterFn - Filter function to apply to data
 * @param refetchTrigger - Optional trigger to refetch data
 * @param options - Async behaviour configuration (delay, error probability)
 * @returns Async result with filtered data
 *
 * @example
 * ```tsx
 * const result = useAsyncFiltered(
 *   users,
 *   (users) => users.filter(u => u.isActive),
 *   refetchTrigger,
 *   { delayRange: [500, 2000] }
 * );
 * ```
 */
export function useAsyncFiltered<T>(
  data: T[],
  filterFn: (data: T[]) => T[],
  refetchTrigger?: number,
  options?: UseAsyncOptions,
): UseAsyncResult<T[]> {
  const filteredData = useMemo(() => filterFn(data), [data, filterFn]);

  return useAsync({ data: filteredData, refetchTrigger }, options);
}
