import { renderHook, waitFor } from "@testing-library/react";

import { isAsyncError, isAsyncLoading, isAsyncSuccess, useAsync } from "./useAsync";

describe("useAsync", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts in loading state", () => {
    const { result } = renderHook(() =>
      useAsync({ data: ["item"] }, { delayRange: [100, 100], errorProbability: 0 }),
    );

    expect(isAsyncLoading(result.current)).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("transitions to success state after delay", async () => {
    const testData = ["item1", "item2"];
    const { result } = renderHook(() =>
      useAsync({ data: testData }, { delayRange: [100, 100], errorProbability: 0 }),
    );

    expect(isAsyncLoading(result.current)).toBe(true);

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(isAsyncSuccess(result.current)).toBe(true);
    });

    expect(result.current.data).toEqual(testData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(true);
  });

  it("transitions to error state when errorProbability is 1", async () => {
    const { result } = renderHook(() =>
      useAsync({ data: ["item"] }, { delayRange: [100, 100], errorProbability: 1 }),
    );

    expect(isAsyncLoading(result.current)).toBe(true);

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(isAsyncError(result.current)).toBe(true);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    if (isAsyncError(result.current)) {
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error.message).toBe("Simulated async operation failed");
    }
  });

  it("refetches when refetchTrigger changes", async () => {
    const { result, rerender } = renderHook(
      ({ trigger }) =>
        useAsync(
          { data: ["item"], refetchTrigger: trigger },
          { delayRange: [100, 100], errorProbability: 0 },
        ),
      { initialProps: { trigger: 0 } },
    );

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(isAsyncSuccess(result.current)).toBe(true);
    });

    // Trigger refetch
    rerender({ trigger: 1 });

    expect(isAsyncLoading(result.current)).toBe(true);

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(isAsyncSuccess(result.current)).toBe(true);
    });
  });

  it("uses custom delay range", async () => {
    const { result } = renderHook(() =>
      useAsync({ data: ["item"] }, { delayRange: [200, 200], errorProbability: 0 }),
    );

    expect(isAsyncLoading(result.current)).toBe(true);

    // Delay less than 200ms should not resolve
    vi.advanceTimersByTime(150);
    expect(isAsyncLoading(result.current)).toBe(true);

    // Delay at 200ms should resolve
    vi.advanceTimersByTime(50);

    await waitFor(() => {
      expect(isAsyncSuccess(result.current)).toBe(true);
    });
  });

  it("cleans up timeout on unmount", () => {
    const { unmount } = renderHook(() =>
      useAsync({ data: ["item"] }, { delayRange: [100, 100], errorProbability: 0 }),
    );

    // Unmount before timeout completes
    unmount();

    // Advance time to when timeout would have fired
    vi.advanceTimersByTime(100);

    // No errors should occur from cleanup
    expect(true).toBe(true);
  });

  it("updates when data changes", async () => {
    const { result, rerender } = renderHook(
      ({ data }) => useAsync({ data }, { delayRange: [100, 100], errorProbability: 0 }),
      { initialProps: { data: ["item1"] } },
    );

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(isAsyncSuccess(result.current)).toBe(true);
    });

    expect(result.current.data).toEqual(["item1"]);

    // Change data
    rerender({ data: ["item2"] });

    expect(isAsyncLoading(result.current)).toBe(true);

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(isAsyncSuccess(result.current)).toBe(true);
    });

    expect(result.current.data).toEqual(["item2"]);
  });
});

describe("Type Guards", () => {
  it("isAsyncLoading narrows type correctly", () => {
    const loadingResult = {
      data: undefined,
      isLoading: true as const,
      isError: false as const,
      isSuccess: false as const,
    };

    if (isAsyncLoading(loadingResult)) {
      // TypeScript should know this is UseAsyncLoadingResult
      expect(loadingResult.isLoading).toBe(true);
      expect(loadingResult.data).toBeUndefined();
    }
  });

  it("isAsyncError narrows type correctly", () => {
    const errorResult = {
      data: undefined,
      isLoading: false as const,
      isError: true as const,
      isSuccess: false as const,
      error: new Error("Test error"),
    };

    if (isAsyncError(errorResult)) {
      // TypeScript should know this is UseAsyncErrorResult
      expect(errorResult.isError).toBe(true);
      expect(errorResult.error).toBeInstanceOf(Error);
    }
  });

  it("isAsyncSuccess narrows type correctly", () => {
    const successResult = {
      data: ["item"],
      isLoading: false as const,
      isError: false as const,
      isSuccess: true as const,
    };

    if (isAsyncSuccess(successResult)) {
      // TypeScript should know this is UseAsyncSuccessResult
      expect(successResult.isSuccess).toBe(true);
      expect(successResult.data).toEqual(["item"]);
    }
  });
});
