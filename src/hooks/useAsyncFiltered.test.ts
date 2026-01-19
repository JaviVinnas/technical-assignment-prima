import { act, renderHook } from "@testing-library/react";

import { useAsyncFiltered } from "./useAsyncFiltered";

/**
 * Unit tests for useAsyncFiltered hook.
 *
 * Tests the composition of filtering logic with async loading behaviour.
 * Uses deterministic configuration to ensure reliable test execution.
 *
 * @see useAsync.test.ts for base async hook tests
 */
describe("useAsyncFiltered", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const testData = [
    { id: 1, name: "Alice", active: true },
    { id: 2, name: "Bob", active: false },
    { id: 3, name: "Carol", active: true },
  ];

  describe("Filtering Behaviour", () => {
    it("applies filter function to data before async loading", async () => {
      const filterFn = (data: readonly (typeof testData)[number][]) =>
        data.filter((item) => item.active);

      const { result } = renderHook(() =>
        useAsyncFiltered(testData, filterFn, { delayRange: [50, 50], errorProbability: 0 }),
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toHaveLength(2);
      expect(result.current.data).toEqual([
        { id: 1, name: "Alice", active: true },
        { id: 3, name: "Carol", active: true },
      ]);
    });

    it("returns all data when filter function returns all items", async () => {
      const filterFn = (data: readonly (typeof testData)[number][]) => [...data];

      const { result } = renderHook(() =>
        useAsyncFiltered(testData, filterFn, { delayRange: [50, 50], errorProbability: 0 }),
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.data).toHaveLength(3);
    });

    it("returns empty array when filter matches nothing", async () => {
      const filterFn = (data: readonly (typeof testData)[number][]) =>
        data.filter((item) => item.id > 100);

      const { result } = renderHook(() =>
        useAsyncFiltered(testData, filterFn, { delayRange: [50, 50], errorProbability: 0 }),
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.data).toEqual([]);
    });
  });

  describe("Loading State", () => {
    it("shows loading state initially", () => {
      const filterFn = (data: readonly (typeof testData)[number][]) => [...data];

      const { result } = renderHook(() =>
        useAsyncFiltered(testData, filterFn, { delayRange: [100, 100], errorProbability: 0 }),
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe("Retry Functionality", () => {
    it("provides retry function", async () => {
      const filterFn = (data: readonly (typeof testData)[number][]) => [...data];

      const { result } = renderHook(() =>
        useAsyncFiltered(testData, filterFn, { delayRange: [50, 50], errorProbability: 0 }),
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(typeof result.current.retry).toBe("function");

      // Retry should reset to loading
      act(() => {
        result.current.retry();
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe("Readonly Array Support", () => {
    it("accepts readonly data array", async () => {
      const readonlyData = testData as readonly (typeof testData)[number][];
      const filterFn = (data: readonly (typeof testData)[number][]) =>
        data.filter((item) => item.active);

      const { result } = renderHook(() =>
        useAsyncFiltered(readonlyData, filterFn, { delayRange: [50, 50], errorProbability: 0 }),
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toHaveLength(2);
    });
  });

  describe("Filter Function Updates", () => {
    it("re-filters when filter function changes", async () => {
      const initialFilter = (data: readonly (typeof testData)[number][]) =>
        data.filter((item) => item.active);
      const updatedFilter = (data: readonly (typeof testData)[number][]) =>
        data.filter((item) => !item.active);

      const { result, rerender } = renderHook(
        ({
          filterFn,
        }: {
          filterFn: (data: readonly (typeof testData)[number][]) => (typeof testData)[number][];
        }) => useAsyncFiltered(testData, filterFn, { delayRange: [50, 50], errorProbability: 0 }),
        { initialProps: { filterFn: initialFilter } },
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.data).toHaveLength(2); // Alice and Carol

      // Change filter
      rerender({ filterFn: updatedFilter });

      // Should reset to loading with new filter
      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.data).toHaveLength(1); // Only Bob
      expect(result.current.data?.[0].name).toBe("Bob");
    });
  });
});
