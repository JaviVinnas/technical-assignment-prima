import { act, renderHook, waitFor } from "@testing-library/react";

import { LocalStorageKeys, useLocalStorage } from "./useLocalStorage";

/**
 * Test suite for useLocalStorage hook.
 *
 * Tests the localStorage hook's ability to store, retrieve, and synchronise data.
 * Focuses on user-facing behaviours: persisting state, syncing across tabs,
 * and handling localStorage errors gracefully.
 */
describe("useLocalStorage", () => {
  const testKey = LocalStorageKeys.USER_DASHBOARD_STATE;
  const defaultValue = {
    searchQuery: "",
    selectedPermissions: [] as const,
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("Initial Value", () => {
    it("returns default value when localStorage is empty", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      expect(result.current[0]).toEqual(defaultValue);
    });

    it("returns stored value when localStorage has data", () => {
      const storedValue = {
        searchQuery: "test query",
        selectedPermissions: ["admin"] as const,
      };
      localStorage.setItem(testKey, JSON.stringify(storedValue));

      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      expect(result.current[0]).toEqual(storedValue);
    });

    it("returns default value when localStorage contains invalid JSON", () => {
      localStorage.setItem(testKey, "invalid json {");

      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      expect(result.current[0]).toEqual(defaultValue);
    });

    it("returns default value when localStorage is unavailable", () => {
      const getItemSpy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("localStorage unavailable");
      });

      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      expect(result.current[0]).toEqual(defaultValue);

      getItemSpy.mockRestore();
    });
  });

  describe("Setting Values", () => {
    it("stores value in localStorage when setValue is called", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      const newValue = {
        searchQuery: "new search",
        selectedPermissions: ["editor"] as const,
      };

      act(() => {
        result.current[1](newValue);
      });

      const stored = localStorage.getItem(testKey);
      expect(stored).toBe(JSON.stringify(newValue));
    });

    it("updates hook value after setting", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      const newValue = {
        searchQuery: "updated",
        selectedPermissions: ["admin", "viewer"] as const,
      };

      act(() => {
        result.current[1](newValue);
      });

      expect(result.current[0]).toEqual(newValue);
    });

    it("handles multiple updates correctly", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      act(() => {
        result.current[1]({
          searchQuery: "first",
          selectedPermissions: [] as const,
        });
      });

      expect(result.current[0].searchQuery).toBe("first");

      act(() => {
        result.current[1]({
          searchQuery: "second",
          selectedPermissions: ["admin"] as const,
        });
      });

      expect(result.current[0].searchQuery).toBe("second");
      expect(result.current[0].selectedPermissions).toEqual(["admin"]);

      act(() => {
        result.current[1]({
          searchQuery: "third",
          selectedPermissions: ["editor", "viewer"] as const,
        });
      });

      expect(result.current[0].searchQuery).toBe("third");
      expect(result.current[0].selectedPermissions).toEqual(["editor", "viewer"]);
    });

    it("handles updater function pattern", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      act(() => {
        result.current[1]({
          searchQuery: "initial",
          selectedPermissions: ["admin"] as const,
        });
      });

      act(() => {
        result.current[1]((prev) => ({
          ...prev,
          searchQuery: "updated",
        }));
      });

      expect(result.current[0].searchQuery).toBe("updated");
      expect(result.current[0].selectedPermissions).toEqual(["admin"]);
    });

    it("handles updater function with multiple updates", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      act(() => {
        result.current[1]((prev) => ({
          ...prev,
          searchQuery: "first",
        }));
      });

      act(() => {
        result.current[1]((prev) => ({
          ...prev,
          searchQuery: `${prev.searchQuery} second`,
        }));
      });

      expect(result.current[0].searchQuery).toBe("first second");
    });

    it("handles setting to default value", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      act(() => {
        result.current[1]({
          searchQuery: "something",
          selectedPermissions: ["admin"] as const,
        });
      });

      act(() => {
        result.current[1](defaultValue);
      });

      expect(result.current[0]).toEqual(defaultValue);
    });

    it("silently handles localStorage setItem errors", () => {
      const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("localStorage full");
      });

      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      expect(() => {
        act(() => {
          result.current[1]({
            searchQuery: "test",
            selectedPermissions: [] as const,
          });
        });
      }).not.toThrow();

      setItemSpy.mockRestore();
    });
  });

  describe("JSON Serialisation", () => {
    it("correctly serialises and deserialises objects", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      const complexValue = {
        searchQuery: "test with 'quotes' and \"double quotes\"",
        selectedPermissions: ["admin", "editor"] as const,
      };

      act(() => {
        result.current[1](complexValue);
      });

      expect(result.current[0]).toEqual(complexValue);
    });

    it("correctly serialises empty strings", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      act(() => {
        result.current[1]({
          searchQuery: "",
          selectedPermissions: [] as const,
        });
      });

      expect(result.current[0].searchQuery).toBe("");
    });

    it("correctly serialises empty arrays", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      act(() => {
        result.current[1]({
          searchQuery: "test",
          selectedPermissions: [] as const,
        });
      });

      expect(result.current[0].selectedPermissions).toEqual([]);
    });

    it("preserves data types through serialisation", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      const value = {
        searchQuery: "test",
        selectedPermissions: ["admin", "editor", "viewer"] as const,
      };

      act(() => {
        result.current[1](value);
      });

      expect(typeof result.current[0].searchQuery).toBe("string");
      expect(Array.isArray(result.current[0].selectedPermissions)).toBe(true);
    });
  });

  describe("Cross-Tab Synchronisation", () => {
    it("updates value when storage event is fired", async () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      const newValue = {
        searchQuery: "from another tab",
        selectedPermissions: ["guest"] as const,
      };

      act(() => {
        localStorage.setItem(testKey, JSON.stringify(newValue));
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: testKey,
            newValue: JSON.stringify(newValue),
            oldValue: JSON.stringify(defaultValue),
            storageArea: localStorage,
          }),
        );
      });

      await waitFor(() => {
        expect(result.current[0]).toEqual(newValue);
      });
    });

    it("updates when storage event with null key is fired (clear all)", async () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      act(() => {
        result.current[1]({
          searchQuery: "test",
          selectedPermissions: ["admin"] as const,
        });
      });

      act(() => {
        localStorage.clear();
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: null,
            newValue: null,
            oldValue: null,
            storageArea: localStorage,
          }),
        );
      });

      await waitFor(() => {
        expect(result.current[0]).toEqual(defaultValue);
      });
    });

    it("does not update when storage event is for different key", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      const initialValue = result.current[0];

      act(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "someOtherKey",
            newValue: "someValue",
            oldValue: null,
            storageArea: localStorage,
          }),
        );
      });

      expect(result.current[0]).toEqual(initialValue);
    });
  });

  describe("Same-Tab Synchronisation", () => {
    it("syncs between multiple hook instances in same component tree", () => {
      const { result: result1 } = renderHook(() => useLocalStorage(testKey, defaultValue));
      const { result: result2 } = renderHook(() => useLocalStorage(testKey, defaultValue));

      const newValue = {
        searchQuery: "synced",
        selectedPermissions: ["owner"] as const,
      };

      act(() => {
        result1.current[1](newValue);
      });

      expect(result1.current[0]).toEqual(newValue);
      expect(result2.current[0]).toEqual(newValue);
    });

    it("updates all instances when custom event is dispatched", async () => {
      const { result: result1 } = renderHook(() => useLocalStorage(testKey, defaultValue));
      const { result: result2 } = renderHook(() => useLocalStorage(testKey, defaultValue));

      const newValue = {
        searchQuery: "custom event",
        selectedPermissions: ["inactive"] as const,
      };

      act(() => {
        localStorage.setItem(testKey, JSON.stringify(newValue));
        window.dispatchEvent(new CustomEvent("localStorageChange", { detail: testKey }));
      });

      await waitFor(() => {
        expect(result1.current[0]).toEqual(newValue);
        expect(result2.current[0]).toEqual(newValue);
      });
    });
  });

  describe("Event Cleanup", () => {
    it("removes event listeners on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() => useLocalStorage(testKey, defaultValue));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith("storage", expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "localStorageChange",
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });

    it("does not update after unmount", () => {
      const { result, unmount } = renderHook(() => useLocalStorage(testKey, defaultValue));

      const beforeUnmount = result.current[0];
      unmount();

      act(() => {
        localStorage.setItem(
          testKey,
          JSON.stringify({
            searchQuery: "after unmount",
            selectedPermissions: [] as const,
          }),
        );
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: testKey,
            newValue: JSON.stringify({
              searchQuery: "after unmount",
              selectedPermissions: [] as const,
            }),
          }),
        );
      });

      expect(result.current[0]).toEqual(beforeUnmount);
    });
  });

  describe("Stability and Performance", () => {
    it("does not cause infinite loops with object references", () => {
      let renderCount = 0;

      const { result } = renderHook(() => {
        renderCount++;
        return useLocalStorage(testKey, defaultValue);
      });

      act(() => {
        result.current[1]({
          searchQuery: "test",
          selectedPermissions: ["admin"] as const,
        });
      });

      expect(renderCount).toBeLessThan(10);
    });

    it("returns same reference when value has not changed", () => {
      const { result, rerender } = renderHook(() => useLocalStorage(testKey, defaultValue));

      const initialValue = result.current[0];
      rerender();
      const afterRerender = result.current[0];

      expect(initialValue).toBe(afterRerender);
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid successive updates", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current[1]({
            searchQuery: `query ${i}`,
            selectedPermissions: [] as const,
          });
        }
      });

      expect(result.current[0].searchQuery).toBe("query 9");
    });

    it("handles setting same value multiple times", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      const value = {
        searchQuery: "same",
        selectedPermissions: ["admin"] as const,
      };

      act(() => {
        result.current[1](value);
        result.current[1](value);
        result.current[1](value);
      });

      expect(result.current[0]).toEqual(value);
    });

    it("handles complex nested updater functions", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      act(() => {
        result.current[1]((prev) => ({
          ...prev,
          searchQuery: "first",
        }));
      });

      act(() => {
        result.current[1]((prev) => ({
          ...prev,
          searchQuery: `${prev.searchQuery} second`,
          selectedPermissions: ["admin"] as const,
        }));
      });

      expect(result.current[0]).toEqual({
        searchQuery: "first second",
        selectedPermissions: ["admin"],
      });
    });

    it("handles switching between direct values and updater functions", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      act(() => {
        result.current[1]({
          searchQuery: "direct",
          selectedPermissions: [] as const,
        });
      });

      act(() => {
        result.current[1]((prev) => ({
          ...prev,
          searchQuery: "updater",
        }));
      });

      act(() => {
        result.current[1]({
          searchQuery: "direct again",
          selectedPermissions: ["viewer"] as const,
        });
      });

      expect(result.current[0]).toEqual({
        searchQuery: "direct again",
        selectedPermissions: ["viewer"],
      });
    });
  });

  describe("Real-World Usage Scenarios", () => {
    it("persists user search query across page reloads", () => {
      const { result, unmount } = renderHook(() => useLocalStorage(testKey, defaultValue));

      act(() => {
        result.current[1]({
          searchQuery: "George Harris",
          selectedPermissions: [] as const,
        });
      });

      unmount();

      const { result: result2 } = renderHook(() => useLocalStorage(testKey, defaultValue));

      expect(result2.current[0].searchQuery).toBe("George Harris");
    });

    it("persists user filter selections", () => {
      const { result, unmount } = renderHook(() => useLocalStorage(testKey, defaultValue));

      act(() => {
        result.current[1]({
          searchQuery: "",
          selectedPermissions: ["admin", "editor"] as const,
        });
      });

      unmount();

      const { result: result2 } = renderHook(() => useLocalStorage(testKey, defaultValue));

      expect(result2.current[0].selectedPermissions).toEqual(["admin", "editor"]);
    });

    it("allows user to clear search and filters", () => {
      const { result } = renderHook(() => useLocalStorage(testKey, defaultValue));

      act(() => {
        result.current[1]({
          searchQuery: "test",
          selectedPermissions: ["admin"] as const,
        });
      });

      act(() => {
        result.current[1](defaultValue);
      });

      expect(result.current[0]).toEqual(defaultValue);
    });

    it("syncs user actions across multiple browser tabs", async () => {
      const { result: tab1 } = renderHook(() => useLocalStorage(testKey, defaultValue));
      const { result: tab2 } = renderHook(() => useLocalStorage(testKey, defaultValue));

      act(() => {
        tab1.current[1]({
          searchQuery: "synced query",
          selectedPermissions: ["guest"] as const,
        });
      });

      act(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: testKey,
            newValue: JSON.stringify({
              searchQuery: "synced query",
              selectedPermissions: ["guest"],
            }),
          }),
        );
      });

      await waitFor(() => {
        expect(tab2.current[0].searchQuery).toBe("synced query");
        expect(tab2.current[0].selectedPermissions).toEqual(["guest"]);
      });
    });
  });
});
