import type { UseAsyncOptions } from "./hooks/useAsync";

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

/**
 * Default number of skeleton cards to show while loading.
 * Provides a consistent UI structure that matches typical initial data load.
 */
export const DEFAULT_SKELETON_COUNT = 6;
