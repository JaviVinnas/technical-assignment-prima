import { useEffect, useState } from "react";

/**
 * Configuration options for the useAsync hook.
 *
 * Allows customisation of loading behaviour including delay range and error probability.
 */
export interface UseAsyncOptions {
  /**
   * Range for random loading delay in milliseconds [min, max].
   * Defaults to [500, 2000]ms.
   */
  delayRange?: [number, number];

  /**
   * Probability of error occurring (0-1).
   * Defaults to 0.1 (10% error rate).
   */
  errorProbability?: number;
}

/**
 * Loading state result from useAsync hook.
 *
 * Represents the state when data is being fetched asynchronously.
 */
export interface UseAsyncLoadingResult {
  data: undefined;
  isLoading: true;
  isError: false;
  isSuccess: false;
}

/**
 * Error state result from useAsync hook.
 *
 * Represents the state when data fetching has failed with an error.
 */
export interface UseAsyncErrorResult {
  data: undefined;
  isLoading: false;
  isError: true;
  isSuccess: false;
  error: Error;
}

/**
 * Success state result from useAsync hook.
 *
 * Represents the state when data has been successfully fetched.
 */
export interface UseAsyncSuccessResult<T> {
  data: T;
  isLoading: false;
  isError: false;
  isSuccess: true;
}

/**
 * Discriminated union type for all possible useAsync states.
 *
 * Provides type-safe state checking similar to React Query.
 */
export type UseAsyncResult<T> =
  | UseAsyncLoadingResult
  | UseAsyncErrorResult
  | UseAsyncSuccessResult<T>;

/**
 * Input for the useAsync hook containing data and optional refetch trigger.
 */
export interface UseAsyncInput<T> {
  data: T;
  refetchTrigger?: number;
}

/**
 * Type guard to check if async result is in loading state.
 *
 * Use this type guard in conditional statements to narrow the UseAsyncResult type.
 * TypeScript will understand that within the if block, result.isLoading is true
 * and result.data is undefined.
 *
 * @param result - Async result to check
 * @returns True if result is loading state, false otherwise
 *
 * @example
 * ```tsx
 * if (isAsyncLoading(result)) {
 *   // TypeScript knows result.data is undefined
 *   return <LoadingSkeleton />;
 * }
 * ```
 */
export function isAsyncLoading<T>(result: UseAsyncResult<T>): result is UseAsyncLoadingResult {
  return result.isLoading;
}

/**
 * Type guard to check if async result is in error state.
 *
 * Use this type guard to narrow the type and safely access the error property.
 * TypeScript will understand that within the if block, result.error exists
 * and result.data is undefined.
 *
 * @param result - Async result to check
 * @returns True if result is error state, false otherwise
 *
 * @example
 * ```tsx
 * if (isAsyncError(result)) {
 *   // TypeScript knows result.error is defined
 *   return <ErrorState error={result.error} />;
 * }
 * ```
 */
export function isAsyncError<T>(result: UseAsyncResult<T>): result is UseAsyncErrorResult {
  return result.isError;
}

/**
 * Type guard to check if async result is in success state.
 *
 * Use this type guard to narrow the type and safely access the data property.
 * TypeScript will understand that within the if block, result.data is defined
 * and is of type T (not undefined).
 *
 * @param result - Async result to check
 * @returns True if result is success state, false otherwise
 *
 * @example
 * ```tsx
 * if (isAsyncSuccess(result)) {
 *   // TypeScript knows result.data is T (not undefined)
 *   return <DataDisplay data={result.data} />;
 * }
 * ```
 */
export function isAsyncSuccess<T>(result: UseAsyncResult<T>): result is UseAsyncSuccessResult<T> {
  return result.isSuccess;
}

/**
 * Custom hook that simulates asynchronous data fetching with loading, error, and success states.
 *
 * Mimics the behaviour of React Query with a discriminated union return type for
 * type-safe state checking. Useful for testing and demonstrating loading states
 * without requiring actual API calls.
 *
 * The hook simulates real async behaviour with:
 * - Random loading delay within a configurable range
 * - Configurable error probability
 * - Automatic state transitions (loading -> success/error)
 * - Refetch capability via refetchTrigger
 *
 * @param input - Object containing data and optional refetch trigger
 * @param options - Configuration for loading delay and error probability
 * @returns Discriminated union representing loading, error, or success state
 *
 * @example
 * ```tsx
 * const result = useAsync({ data: users });
 *
 * if (isAsyncLoading(result)) {
 *   return <Skeleton />;
 * }
 *
 * if (isAsyncError(result)) {
 *   return <ErrorState error={result.error} />;
 * }
 *
 * // TypeScript knows result.data is T here
 * return <UserList users={result.data} />;
 * ```
 */
export function useAsync<T>(input: UseAsyncInput<T>, options?: UseAsyncOptions): UseAsyncResult<T> {
  const { data, refetchTrigger = 0 } = input;
  const { delayRange = [200, 800], errorProbability = 0.1 } = options || {};

  const [state, setState] = useState<UseAsyncResult<T>>({
    data: undefined,
    isLoading: true,
    isError: false,
    isSuccess: false,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: refetchTrigger is intentionally a dependency to enable retry functionality, delayRange and errorProbability are configuration options that should not trigger refetch
  useEffect(() => {
    // Destructure delayRange at the start to avoid issues with dependency array
    const [minDelay, maxDelay] = delayRange;

    // Reset to loading state when data or options change
    setState({
      data: undefined,
      isLoading: true,
      isError: false,
      isSuccess: false,
    });

    // Calculate random delay within range
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;

    // Determine if this request should error
    const shouldError = Math.random() < errorProbability;

    const timeoutId = setTimeout(() => {
      if (shouldError) {
        setState({
          data: undefined,
          isLoading: false,
          isError: true,
          isSuccess: false,
          error: new Error("Simulated async operation failed"),
        });
      } else {
        setState({
          data,
          isLoading: false,
          isError: false,
          isSuccess: true,
        });
      }
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [data, refetchTrigger]);

  return state;
}
