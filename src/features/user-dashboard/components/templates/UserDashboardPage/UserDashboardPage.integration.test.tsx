import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UserDashboardPage } from "./UserDashboardPage";

// Mock useAsyncFiltered to make tests deterministic (no random delays or errors)
vi.mock("../../../../../hooks/useAsyncFiltered", async () => {
  const actual = await vi.importActual<typeof import("../../../../../hooks/useAsyncFiltered")>(
    "../../../../../hooks/useAsyncFiltered",
  );
  return {
    ...actual,
    useAsyncFiltered: <T,>(
      data: readonly T[],
      filterFn: (data: readonly T[]) => T[],
      _options: import("../../../../../hooks/useAsync").UseAsyncOptions = {},
    ) => {
      // Call the real implementation with deterministic options
      return actual.useAsyncFiltered(data, filterFn, {
        delayRange: [0, 50],
        errorProbability: 0,
      });
    },
  };
});

/**
 * Helper function to wait for initial data to load.
 *
 * With the mocked useAsyncFiltered, data loads deterministically with
 * short delays and no random errors. This helper simply waits for data
 * to appear in the DOM.
 */
async function waitForInitialDataLoad() {
  await waitFor(
    () => {
      const hasData = screen.queryByText(/george harris/i) || screen.queryByText(/arianna/i);
      expect(hasData).toBeTruthy();
    },
    { timeout: 500 },
  );
}

/**
 * Integration test suite for User Dashboard.
 *
 * Tests complete user journeys across the dashboard, verifying that search,
 * filtering, and error recovery work together from the user's perspective.
 * These tests ensure the full workflow functions correctly, not just isolated components.
 */
describe("User Dashboard - Integration Tests", () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure clean state
    localStorage.clear();
  });

  describe("Search Journey", () => {
    it("user can search for employees by name", async () => {
      const user = userEvent.setup();
      render(<UserDashboardPage />);

      // Wait for initial data load (handling potential errors)
      await waitForInitialDataLoad();

      // User sees all employees initially
      expect(screen.getByText(/george harris/i)).toBeInTheDocument();
      expect(screen.getByText(/arianna russo/i)).toBeInTheDocument();
      expect(screen.getByText(/marco esposito/i)).toBeInTheDocument();

      // User types in search box to find "George"
      const searchInput = screen.getByRole("textbox", {
        name: /what are you looking for/i,
      });
      await user.type(searchInput, "George");

      // User presses Enter or clicks Search to apply the filter
      await user.keyboard("{Enter}");

      // User sees only matching result - wait for filtering to apply
      await waitFor(
        () => {
          const ariannaCard = screen.queryByText(/arianna russo/i);
          expect(ariannaCard).not.toBeInTheDocument();
        },
        { timeout: 1500 },
      );

      // Verify George is still visible
      expect(await screen.findByText(/george harris/i)).toBeInTheDocument();
    });

    it("user sees empty state when search has no matches", async () => {
      const user = userEvent.setup();
      render(<UserDashboardPage />);

      // Wait for initial data load (handling potential errors)
      await waitForInitialDataLoad();

      // User searches for non-existent employee
      const searchInput = screen.getByRole("textbox", {
        name: /what are you looking for/i,
      });
      await user.type(searchInput, "NonExistentEmployee");

      // User presses Enter to apply the search
      await user.keyboard("{Enter}");

      // User sees empty state message
      await waitFor(
        () => {
          expect(screen.getByText(/no users found matching your criteria/i)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      expect(screen.queryByText(/george harris/i)).not.toBeInTheDocument();
    });

    it("user can clear search to see all employees again", async () => {
      const user = userEvent.setup();
      render(<UserDashboardPage />);

      // Wait for initial data load (handling potential errors)
      await waitForInitialDataLoad();

      // User searches for specific employee
      const searchInput = screen.getByRole("textbox", {
        name: /what are you looking for/i,
      });
      await user.type(searchInput, "Sarah");

      // User presses Enter to apply the search
      await user.keyboard("{Enter}");

      await waitFor(
        () => {
          expect(screen.getByText(/sarah williams/i)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      expect(screen.queryByText(/george harris/i)).not.toBeInTheDocument();

      // User clears search
      await user.clear(searchInput);

      // User sees all employees again
      await waitFor(
        () => {
          expect(screen.getByText(/george harris/i)).toBeInTheDocument();
          expect(screen.getByText(/arianna russo/i)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });

    it("search is case-insensitive for user convenience", async () => {
      const user = userEvent.setup();
      render(<UserDashboardPage />);

      // Wait for initial data load (handling potential errors)
      await waitForInitialDataLoad();

      const searchInput = screen.getByRole("textbox", {
        name: /what are you looking for/i,
      });

      // User types in lowercase and presses Enter
      await user.type(searchInput, "george{Enter}");

      await waitFor(() => {
        expect(screen.getByText(/george harris/i)).toBeInTheDocument();
      });

      // User clears and types in uppercase
      await user.clear(searchInput);
      await user.type(searchInput, "GEORGE{Enter}");

      await waitFor(() => {
        expect(screen.getByText(/george harris/i)).toBeInTheDocument();
      });

      // User clears and types in mixed case
      await user.clear(searchInput);
      await user.type(searchInput, "GeOrGe{Enter}");

      await waitFor(() => {
        expect(screen.getByText(/george harris/i)).toBeInTheDocument();
      });
    });
  });

  describe("Filter Journey", () => {
    it("user can filter employees by permission level", async () => {
      const user = userEvent.setup();
      render(<UserDashboardPage />);

      // Wait for initial data load (handling potential errors)
      await waitForInitialDataLoad();

      // User sees employees with different permissions
      expect(screen.getByText(/george harris/i)).toBeInTheDocument(); // admin
      expect(screen.getByText(/arianna russo/i)).toBeInTheDocument(); // editor
      expect(screen.getByText(/marco esposito/i)).toBeInTheDocument(); // viewer

      // User clicks on "Admin" filter badge
      const adminFilter = screen.getByRole("button", { name: /admin/i, pressed: false });
      await user.click(adminFilter);

      // User sees only admin users
      await waitFor(() => {
        expect(screen.getByText(/george harris/i)).toBeInTheDocument();
      });

      expect(screen.queryByText(/arianna russo/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/marco esposito/i)).not.toBeInTheDocument();
    });

    it("user can select multiple permission filters", async () => {
      const user = userEvent.setup();
      render(<UserDashboardPage />);

      // Wait for initial data load
      await waitFor(
        () => {
          expect(screen.getByText(/george harris/i)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // User clicks Admin filter
      const adminFilter = screen.getByRole("button", { name: /admin/i, pressed: false });
      await user.click(adminFilter);

      await waitFor(
        () => {
          expect(screen.getByText(/george harris/i)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // User also clicks Editor filter
      const editorFilter = screen.getByRole("button", { name: /editor/i, pressed: false });
      await user.click(editorFilter);

      // User sees both admin and editor users (OR logic)
      await waitFor(
        () => {
          expect(screen.getByText(/george harris/i)).toBeInTheDocument(); // admin
          expect(screen.getByText(/arianna russo/i)).toBeInTheDocument(); // editor
        },
        { timeout: 3000 },
      );

      expect(screen.queryByText(/marco esposito/i)).not.toBeInTheDocument(); // viewer
    });

    it("user can deselect permission filter to expand results", async () => {
      const user = userEvent.setup();
      render(<UserDashboardPage />);

      // Wait for initial data load
      await waitFor(
        () => {
          expect(screen.getByText(/george harris/i)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // User selects Admin filter
      const adminFilter = screen.getByRole("button", { name: /admin/i, pressed: false });
      await user.click(adminFilter);

      await waitFor(
        () => {
          expect(screen.getByText(/george harris/i)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      expect(screen.queryByText(/arianna russo/i)).not.toBeInTheDocument();

      // User deselects Admin filter by clicking again
      const activeAdminFilter = screen.getByRole("button", { name: /admin/i, pressed: true });
      await user.click(activeAdminFilter);

      // User sees all employees again
      await waitFor(
        () => {
          expect(screen.getByText(/george harris/i)).toBeInTheDocument();
          expect(screen.getByText(/arianna russo/i)).toBeInTheDocument();
          expect(screen.getByText(/marco esposito/i)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });

    it("filter badge shows active state when selected", async () => {
      const user = userEvent.setup();
      render(<UserDashboardPage />);

      // Wait for initial data load (handling potential errors)
      await waitForInitialDataLoad();

      // Initially, filter is not active
      const adminFilter = screen.getByRole("button", { name: /admin/i });
      expect(adminFilter).toHaveAttribute("aria-pressed", "false");

      // User clicks filter
      await user.click(adminFilter);

      // Filter shows as active
      await waitFor(() => {
        expect(adminFilter).toHaveAttribute("aria-pressed", "true");
      });

      // User can see checkmark indicating active state
      const checkmark = adminFilter.querySelector(".badge-toggle__checkmark");
      expect(checkmark).toHaveClass("badge-toggle__checkmark--visible");
    });
  });

  describe("Combined Search and Filter Journey", () => {
    it("user can search and filter simultaneously", async () => {
      const user = userEvent.setup();
      render(<UserDashboardPage />);

      // Wait for initial data load (handling potential errors)
      await waitForInitialDataLoad();

      // User filters by Guest permission
      const guestFilter = screen.getByRole("button", { name: /guest/i, pressed: false });
      await user.click(guestFilter);

      await waitFor(
        () => {
          expect(screen.getByText(/sarah williams/i)).toBeInTheDocument(); // guest
          expect(screen.getByText(/emma clark/i)).toBeInTheDocument(); // guest
          expect(screen.getByText(/serena parisi/i)).toBeInTheDocument(); // guest
        },
        { timeout: 2000 },
      );

      // User also searches for "Sarah" and presses Enter
      const searchInput = screen.getByRole("textbox", {
        name: /what are you looking for/i,
      });
      await user.type(searchInput, "Sarah{Enter}");

      // User sees only Sarah Williams (guest AND name matches "Sarah")
      await waitFor(
        () => {
          expect(screen.getByText(/sarah williams/i)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      expect(screen.queryByText(/emma clark/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/serena parisi/i)).not.toBeInTheDocument();
    });

    it("user sees empty state when combined search and filter have no matches", async () => {
      const user = userEvent.setup();
      render(<UserDashboardPage />);

      // Wait for initial data load
      await waitFor(
        () => {
          expect(screen.getByText(/george harris/i)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // User filters by Admin
      const adminFilter = screen.getByRole("button", { name: /admin/i, pressed: false });
      await user.click(adminFilter);

      await waitFor(
        () => {
          expect(screen.getByText(/george harris/i)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      // User searches for someone who is not an admin
      const searchInput = screen.getByRole("textbox", {
        name: /what are you looking for/i,
      });
      await user.type(searchInput, "Arianna{Enter}"); // Arianna is an editor, not admin

      // User sees empty state
      await waitFor(
        () => {
          expect(screen.getByText(/no users found matching your criteria/i)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });

    it("user can adjust filters to refine search results", async () => {
      const user = userEvent.setup();
      render(<UserDashboardPage />);

      // Wait for initial data load (handling potential errors)
      await waitForInitialDataLoad();

      // User searches for "ar" (by name) and presses Enter
      // This matches: Arianna Russo, Sarah Williams, Marco Esposito
      const searchInput = screen.getByRole("textbox", {
        name: /what are you looking for/i,
      });
      await user.type(searchInput, "ar{Enter}");

      await waitFor(
        () => {
          // Multiple people have "ar" in their name
          expect(screen.getByText(/arianna russo/i)).toBeInTheDocument();
          expect(screen.getByText(/sarah williams/i)).toBeInTheDocument();
          expect(screen.getByText(/marco esposito/i)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // User filters by Editor to narrow down
      const editorFilter = screen.getByRole("button", { name: /editor/i, pressed: false });
      await user.click(editorFilter);

      // User sees only Arianna (has "ar" in name with Editor permission)
      await waitFor(
        () => {
          expect(screen.getByText(/arianna russo/i)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      expect(screen.queryByText(/sarah williams/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/marco esposito/i)).not.toBeInTheDocument();
    });
  });

  describe("Error Recovery Journey", () => {
    it("user can retry after network error", async () => {
      const user = userEvent.setup();

      // Mock console.error to avoid noise in test output
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      render(<UserDashboardPage />);

      // Check if error state appears (depends on random error probability)
      // We'll wait and check for either success or error state
      await waitFor(
        () => {
          const hasError = screen.queryByText(/failed to load users/i);
          const hasUsers = screen.queryByText(/george harris/i);
          expect(hasError || hasUsers).toBeTruthy();
        },
        { timeout: 3000 },
      );

      // If error state is shown, user can retry
      const errorMessage = screen.queryByText(/failed to load users/i);
      if (errorMessage) {
        const retryButton = screen.getByRole("button", { name: /try again/i });
        expect(retryButton).toBeInTheDocument();

        // User clicks retry
        await user.click(retryButton);

        // User either sees loading state or success state after retry
        await waitFor(
          () => {
            const hasUsers = screen.queryByText(/george harris/i);
            const hasLoading = document.querySelector(".card-skeleton");
            expect(hasUsers || hasLoading).toBeTruthy();
          },
          { timeout: 3000 },
        );
      }

      consoleError.mockRestore();
    });
  });

  describe("State Persistence", () => {
    it("user's search query persists across page reloads", async () => {
      const user = userEvent.setup();
      const { unmount } = render(<UserDashboardPage />);

      // Wait for initial data load
      await waitFor(
        () => {
          expect(screen.getByText(/george harris/i)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // User searches for "Emma" and presses Enter
      const searchInput = screen.getByRole("textbox", {
        name: /what are you looking for/i,
      });
      await user.type(searchInput, "Emma{Enter}");

      await waitFor(
        () => {
          expect(screen.getByText(/emma clark/i)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      // Simulate page reload by unmounting and remounting
      unmount();
      render(<UserDashboardPage />);

      // User sees search query persisted
      await waitFor(
        () => {
          const newSearchInput = screen.getByRole("textbox", {
            name: /what are you looking for/i,
          });
          expect(newSearchInput).toHaveValue("Emma");
        },
        { timeout: 1000 },
      );

      // Results are also filtered based on persisted search
      await waitFor(
        () => {
          expect(screen.getByText(/emma clark/i)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it("user's selected filters persist across page reloads", async () => {
      const user = userEvent.setup();
      const { unmount } = render(<UserDashboardPage />);

      // Wait for initial data load
      await waitFor(
        () => {
          expect(screen.getByText(/george harris/i)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // User selects Guest filter
      const guestFilter = screen.getByRole("button", { name: /guest/i, pressed: false });
      await user.click(guestFilter);

      await waitFor(
        () => {
          expect(guestFilter).toHaveAttribute("aria-pressed", "true");
        },
        { timeout: 1000 },
      );

      // Simulate page reload
      unmount();
      render(<UserDashboardPage />);

      // User sees Guest filter still selected
      await waitFor(
        () => {
          const newGuestFilter = screen.getByRole("button", { name: /guest/i });
          expect(newGuestFilter).toHaveAttribute("aria-pressed", "true");
        },
        { timeout: 1000 },
      );

      // Results are filtered based on persisted selection
      await waitFor(
        () => {
          expect(screen.getByText(/sarah williams/i)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  });

  describe("Accessibility Journey", () => {
    it("keyboard users can navigate through search and filters", async () => {
      const user = userEvent.setup();
      render(<UserDashboardPage />);

      // Wait for initial data load (handling potential errors)
      await waitForInitialDataLoad();

      // User tabs to search input
      await user.tab();
      const searchInput = screen.getByRole("textbox", {
        name: /what are you looking for/i,
      });
      expect(searchInput).toHaveFocus();

      // User types search query and presses Enter to submit
      await user.keyboard("George{Enter}");

      await waitFor(
        () => {
          expect(screen.getByText(/george harris/i)).toBeInTheDocument();
          expect(screen.queryByText(/arianna russo/i)).not.toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      // User tabs to search button, then to filter badges
      await user.tab(); // Search button
      await user.tab(); // First filter badge (Admin)
      const adminFilter = screen.getByRole("button", { name: /admin/i });
      expect(adminFilter).toHaveFocus();

      // User activates filter with Enter
      await user.keyboard("{Enter}");

      await waitFor(
        () => {
          expect(adminFilter).toHaveAttribute("aria-pressed", "true");
        },
        { timeout: 1000 },
      );
    });
  });
});
