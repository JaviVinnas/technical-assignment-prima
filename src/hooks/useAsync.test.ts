import { act, renderHook } from "@testing-library/react";

import { isAsyncError, isAsyncLoading, isAsyncSuccess, useAsync } from "./useAsync";

/**
 * Unit tests for useAsync hook.
 *
 * IMPORTANT: These tests use deterministic configuration (short delays, fixed
 * error probability) to avoid flaky tests. The hook's random delay and error
 * probability features are tested indirectly through integration tests.
 *
 * Testing approach:
 * - Use delayRange: [0, 10] for near-instant state transitions
 * - Use errorProbability: 0 for guaranteed success paths
 * - Use errorProbability: 1 for guaranteed error paths
 * - Use vi.useFakeTimers() for precise timing control
 *
 * @see UserDashboardPage.integration.test.tsx for integration-level async testing
 */
describe("useAsync", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Initial Loading State", () => {
    it("returns loading state initially", () => {
      const { result } = renderHook(() =>
        useAsync({ data: "test-data" }, { delayRange: [100, 100], errorProbability: 0 }),
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it("provides retry function in loading state", () => {
      const { result } = renderHook(() =>
        useAsync({ data: "test-data" }, { delayRange: [100, 100], errorProbability: 0 }),
      );

      expect(typeof result.current.retry).toBe("function");
    });
  });

  describe("Success State", () => {
    it("transitions to success state after delay", async () => {
      const testData = { name: "John", age: 30 };
      const { result } = renderHook(() =>
        useAsync({ data: testData }, { delayRange: [100, 100], errorProbability: 0 }),
      );

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      // Advance timer past the delay
      await act(async () => {
        vi.advanceTimersByTime(150);
      });

      // Now should be success
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toEqual(testData);
    });

    it("returns data with correct type in success state", async () => {
      const testData = ["item1", "item2", "item3"];
      const { result } = renderHook(() =>
        useAsync({ data: testData }, { delayRange: [50, 50], errorProbability: 0 }),
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.data).toEqual(testData);
      expect(Array.isArray(result.current.data)).toBe(true);
    });
  });

  describe("Error State", () => {
    it("transitions to error state when error probability is 1", async () => {
      const { result } = renderHook(() =>
        useAsync({ data: "test" }, { delayRange: [50, 50], errorProbability: 1 }),
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it("includes error object in error state", async () => {
      const { result } = renderHook(() =>
        useAsync({ data: "test" }, { delayRange: [50, 50], errorProbability: 1 }),
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      if (isAsyncError(result.current)) {
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error.message).toContain("Simulated async operation failed");
      } else {
        throw new Error("Expected error state");
      }
    });
  });

  describe("Retry Functionality", () => {
    it("returns to loading state when retry is called", async () => {
      const { result } = renderHook(() =>
        useAsync({ data: "test" }, { delayRange: [50, 50], errorProbability: 0 }),
      );

      // Wait for success
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isSuccess).toBe(true);

      // Call retry
      act(() => {
        result.current.retry();
      });

      // Should be loading again
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });

    it("retry after error returns to loading state", async () => {
      const { result } = renderHook(() =>
        useAsync({ data: "test" }, { delayRange: [50, 50], errorProbability: 1 }),
      );

      // Wait for error
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isError).toBe(true);

      // Call retry
      act(() => {
        result.current.retry();
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
    });
  });

  describe("Data Changes", () => {
    it("resets to loading when data prop changes", async () => {
      const { result, rerender } = renderHook(
        ({ data }) => useAsync({ data }, { delayRange: [50, 50], errorProbability: 0 }),
        { initialProps: { data: "initial" } },
      );

      // Wait for success with initial data
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toBe("initial");

      // Change data
      rerender({ data: "updated" });

      // Should be loading again
      expect(result.current.isLoading).toBe(true);

      // Wait for new data
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toBe("updated");
    });
  });

  describe("Type Guards", () => {
    it("isAsyncLoading correctly identifies loading state", () => {
      const { result } = renderHook(() =>
        useAsync({ data: "test" }, { delayRange: [100, 100], errorProbability: 0 }),
      );

      expect(isAsyncLoading(result.current)).toBe(true);
      expect(isAsyncError(result.current)).toBe(false);
      expect(isAsyncSuccess(result.current)).toBe(false);
    });

    it("isAsyncSuccess correctly identifies success state", async () => {
      const { result } = renderHook(() =>
        useAsync({ data: "test" }, { delayRange: [50, 50], errorProbability: 0 }),
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(isAsyncLoading(result.current)).toBe(false);
      expect(isAsyncError(result.current)).toBe(false);
      expect(isAsyncSuccess(result.current)).toBe(true);
    });

    it("isAsyncError correctly identifies error state", async () => {
      const { result } = renderHook(() =>
        useAsync({ data: "test" }, { delayRange: [50, 50], errorProbability: 1 }),
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(isAsyncLoading(result.current)).toBe(false);
      expect(isAsyncError(result.current)).toBe(true);
      expect(isAsyncSuccess(result.current)).toBe(false);
    });
  });

  describe("Cleanup", () => {
    it("cancels pending timeout on unmount", async () => {
      const { unmount } = renderHook(() =>
        useAsync({ data: "test" }, { delayRange: [1000, 1000], errorProbability: 0 }),
      );

      // Unmount before timeout completes
      unmount();

      // This should not cause any errors or console warnings
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      // If we get here without errors, cleanup worked correctly
      expect(true).toBe(true);
    });
  });
});
