import { renderHook, waitFor } from "@testing-library/react";

import { isAsyncSuccess } from "./useAsync";
import { useAsyncFiltered } from "./useAsyncFiltered";

describe("useAsyncFiltered", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("applies filter function to data", async () => {
    const data = [1, 2, 3, 4, 5];
    const filterFn = (items: number[]) => items.filter((n) => n % 2 === 0);

    const { result } = renderHook(() =>
      useAsyncFiltered(data, filterFn, undefined, { delayRange: [100, 100], errorProbability: 0 }),
    );

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(isAsyncSuccess(result.current)).toBe(true);
    });

    expect(result.current.data).toEqual([2, 4]);
  });

  it("memoises filter function results", async () => {
    const data = [1, 2, 3];
    const filterFn = vi.fn((items: number[]) => items);

    const { rerender } = renderHook(() =>
      useAsyncFiltered(data, filterFn, undefined, { delayRange: [100, 100], errorProbability: 0 }),
    );

    vi.advanceTimersByTime(100);
    await waitFor(() => expect(filterFn).toHaveBeenCalledTimes(1));

    // Rerender without changing data or filterFn
    rerender();

    // Filter should not be called again due to useMemo
    expect(filterFn).toHaveBeenCalledTimes(1);
  });

  it("recalculates when data changes", async () => {
    const filterFn = (items: number[]) => items.filter((n) => n > 2);

    const { result, rerender } = renderHook(
      ({ data }) =>
        useAsyncFiltered(data, filterFn, undefined, {
          delayRange: [100, 100],
          errorProbability: 0,
        }),
      { initialProps: { data: [1, 2, 3, 4] } },
    );

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(isAsyncSuccess(result.current)).toBe(true);
    });

    expect(result.current.data).toEqual([3, 4]);

    // Change data
    rerender({ data: [5, 6, 7] });

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(isAsyncSuccess(result.current)).toBe(true);
    });

    expect(result.current.data).toEqual([5, 6, 7]);
  });

  it("recalculates when filter function changes", async () => {
    const data = [1, 2, 3, 4, 5];
    const filterEven = (items: number[]) => items.filter((n) => n % 2 === 0);
    const filterOdd = (items: number[]) => items.filter((n) => n % 2 !== 0);

    const { result, rerender } = renderHook(
      ({ filterFn }) =>
        useAsyncFiltered(data, filterFn, undefined, {
          delayRange: [100, 100],
          errorProbability: 0,
        }),
      { initialProps: { filterFn: filterEven } },
    );

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(isAsyncSuccess(result.current)).toBe(true);
    });

    expect(result.current.data).toEqual([2, 4]);

    // Change filter function
    rerender({ filterFn: filterOdd });

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(isAsyncSuccess(result.current)).toBe(true);
    });

    expect(result.current.data).toEqual([1, 3, 5]);
  });

  it("handles empty filter results", async () => {
    const data = [1, 2, 3];
    const filterFn = (items: number[]) => items.filter((n) => n > 10);

    const { result } = renderHook(() =>
      useAsyncFiltered(data, filterFn, undefined, { delayRange: [100, 100], errorProbability: 0 }),
    );

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(isAsyncSuccess(result.current)).toBe(true);
    });

    expect(result.current.data).toEqual([]);
  });

  it("supports refetch trigger", async () => {
    const data = [1, 2, 3];
    const filterFn = (items: number[]) => items;

    const { result, rerender } = renderHook(
      ({ trigger }) =>
        useAsyncFiltered(data, filterFn, trigger, { delayRange: [100, 100], errorProbability: 0 }),
      { initialProps: { trigger: 0 } },
    );

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(isAsyncSuccess(result.current)).toBe(true);
    });

    expect(result.current.data).toEqual([1, 2, 3]);

    // Trigger refetch
    rerender({ trigger: 1 });

    expect(result.current.isLoading).toBe(true);

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(isAsyncSuccess(result.current)).toBe(true);
    });

    expect(result.current.data).toEqual([1, 2, 3]);
  });

  it("passes through async options", async () => {
    const data = [1, 2, 3];
    const filterFn = (items: number[]) => items;

    const { result } = renderHook(() =>
      useAsyncFiltered(data, filterFn, undefined, { delayRange: [100, 100], errorProbability: 1 }),
    );

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.data).toBeUndefined();
  });
});
