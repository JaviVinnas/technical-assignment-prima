import type { UseAsyncOptions } from "../../hooks/useAsync";

/**
 * Default async options for the user dashboard data fetching.
 *
 * Controls the simulated delay range and error probability for data loading.
 * These values balance UX (showing loading states) with development convenience.
 */
export const USER_QUERY_ASYNC_OPTIONS: UseAsyncOptions = {
  /** Delay range in milliseconds [min, max] for simulated loading */
  delayRange: [0, 500] as [number, number],
  /** Probability of simulated errors (0-1) for testing error states */
  errorProbability: 0.1,
};
