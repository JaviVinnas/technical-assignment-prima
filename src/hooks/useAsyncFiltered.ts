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
 * The returned result includes a retry() callback for refetching data, which
 * is passed through from the underlying useAsync hook.
 *
 * @param data - Original data array to filter
 * @param filterFn - Filter function to apply to data
 * @param options - Async behaviour configuration (delay, error probability)
 * @returns Async result with filtered data and retry callback
 *
 * @example
 * ```tsx
 * const result = useAsyncFiltered(
 *   users,
 *   (users) => users.filter(u => u.isActive),
 *   { delayRange: [500, 2000] }
 * );
 *
 * // Use retry callback to refetch data
 * if (result.isError) {
 *   return <ErrorState onRetry={result.retry} />;
 * }
 * ```
 */
export function useAsyncFiltered<T>(
  data: T[],
  filterFn: (data: T[]) => T[],
  options?: UseAsyncOptions,
): UseAsyncResult<T[]> {
  const filteredData = useMemo(() => filterFn(data), [data, filterFn]);

  return useAsync({ data: filteredData }, options);
}
