import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { User } from "../../../types";
import { UserCardGrid } from "./UserCardGrid";

/**
 * Test suite for UserCardGrid component.
 *
 * Focuses on user-facing behaviours across different states (loading, error, empty, success).
 * Tests verify what users see and experience when viewing the user grid, not implementation details.
 */
describe("UserCardGrid", () => {
  const mockUsers: User[] = [
    {
      name: "Alice Johnson",
      role: "Senior Engineer",
      permission: "admin",
      team: "Engineering",
      contactInfo: "alice@company.com",
    },
    {
      name: "Bob Smith",
      role: "Product Manager",
      permission: "editor",
      team: "Product",
      contactInfo: "bob@company.com",
    },
    {
      name: "Carol Davis",
      role: "Designer",
      permission: "viewer",
      team: "Design",
      contactInfo: "carol@company.com",
    },
  ];

  const mockOnRetry = vi.fn();
  const mockOnViewDetails = vi.fn();

  beforeEach(() => {
    mockOnRetry.mockClear();
    mockOnViewDetails.mockClear();
  });

  describe("Loading State", () => {
    it("user sees loading indication while data fetches", () => {
      render(
        <UserCardGrid
          users={[]}
          isLoading={true}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      // Skeleton cards are shown during loading - query by aria-label
      const skeletonCards = screen.getAllByLabelText("Loading");
      expect(skeletonCards.length).toBeGreaterThan(0);
    });

    it("user sees multiple skeleton cards indicating content is loading", () => {
      render(
        <UserCardGrid
          users={[]}
          isLoading={true}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const skeletonCards = screen.getAllByLabelText("Loading");
      expect(skeletonCards.length).toBe(6);
    });

    it("user does not see error message during loading", () => {
      render(
        <UserCardGrid
          users={[]}
          isLoading={true}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      expect(screen.queryByText(/failed to load/i)).not.toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("user sees error message when data fetch fails", () => {
      render(
        <UserCardGrid
          users={[]}
          isLoading={false}
          isError={true}
          error={new Error("Network error")}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      expect(screen.getByText(/failed to load users/i)).toBeInTheDocument();
    });

    it("user sees retry button when error occurs", () => {
      render(
        <UserCardGrid
          users={[]}
          isLoading={false}
          isError={true}
          error={new Error("Network error")}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const retryButton = screen.getByRole("button", { name: /try again/i });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).toBeEnabled();
    });

    it("user can retry after error by clicking button", async () => {
      const user = userEvent.setup();
      render(
        <UserCardGrid
          users={[]}
          isLoading={false}
          isError={true}
          error={new Error("Network error")}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const retryButton = screen.getByRole("button", { name: /try again/i });
      await user.click(retryButton);

      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it("user does not see user cards when error occurs", () => {
      render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={true}
          error={new Error("Network error")}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      expect(screen.queryByRole("heading", { name: /alice johnson/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: /bob smith/i })).not.toBeInTheDocument();
    });

    it("error state has assertive ARIA for screen reader users", () => {
      render(
        <UserCardGrid
          users={[]}
          isLoading={false}
          isError={true}
          error={new Error("Network error")}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const errorAlert = screen.getByRole("alert");
      expect(errorAlert).toHaveAttribute("aria-live", "assertive");
    });
  });

  describe("Empty State", () => {
    it("user sees empty state message when no results match criteria", () => {
      render(
        <UserCardGrid
          users={[]}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      expect(screen.getByText(/no users found matching your criteria/i)).toBeInTheDocument();
    });

    it("user does not see retry button in empty state", () => {
      render(
        <UserCardGrid
          users={[]}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      expect(screen.queryByRole("button", { name: /try again/i })).not.toBeInTheDocument();
    });

    it("user does not see user cards when results are empty", () => {
      render(
        <UserCardGrid
          users={[]}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      expect(screen.queryByRole("heading", { name: /alice johnson/i })).not.toBeInTheDocument();
    });

    it("empty state has polite ARIA for screen reader users", () => {
      render(
        <UserCardGrid
          users={[]}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const emptyStatus = screen.getByRole("status");
      expect(emptyStatus).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Success State - User Cards Display", () => {
    it("user sees grid of user cards when data loads successfully", () => {
      render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      expect(screen.getByRole("heading", { name: /alice johnson/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /bob smith/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /carol davis/i })).toBeInTheDocument();
    });

    it("user sees correct number of cards matching number of users", () => {
      render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const viewDetailsButtons = screen.getAllByRole("button", { name: /view details/i });
      expect(viewDetailsButtons).toHaveLength(3);
    });

    it("user can see one user when only one result exists", () => {
      const singleUser = [mockUsers[0]];
      render(
        <UserCardGrid
          users={singleUser}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      expect(screen.getByRole("heading", { name: /alice johnson/i })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: /bob smith/i })).not.toBeInTheDocument();
    });

    it("user can view details of any user in the grid", async () => {
      const user = userEvent.setup();
      render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const viewDetailsButtons = screen.getAllByRole("button", { name: /view details/i });
      await user.click(viewDetailsButtons[0]);
      expect(mockOnViewDetails).toHaveBeenCalledTimes(1);

      await user.click(viewDetailsButtons[1]);
      expect(mockOnViewDetails).toHaveBeenCalledTimes(2);
    });

    it("user does not see error or empty state messages when cards are displayed", () => {
      render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      expect(screen.queryByText(/failed to load/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/no users found/i)).not.toBeInTheDocument();
    });
  });

  describe("State Transitions", () => {
    it("user transitions from loading to success state", () => {
      const { rerender } = render(
        <UserCardGrid
          users={[]}
          isLoading={true}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      // Initially loading - query by aria-label
      expect(screen.getAllByLabelText("Loading").length).toBeGreaterThan(0);

      // Then data loads
      rerender(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      expect(screen.getByRole("heading", { name: /alice johnson/i })).toBeInTheDocument();
    });

    it("user transitions from loading to error state", () => {
      const { rerender } = render(
        <UserCardGrid
          users={[]}
          isLoading={true}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      // Initially loading - query by aria-label
      expect(screen.getAllByLabelText("Loading").length).toBeGreaterThan(0);

      // Then error occurs
      rerender(
        <UserCardGrid
          users={[]}
          isLoading={false}
          isError={true}
          error={new Error("Failed")}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      expect(screen.getByText(/failed to load users/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    });

    it("user transitions from error back to success after retry", () => {
      const { rerender } = render(
        <UserCardGrid
          users={[]}
          isLoading={false}
          isError={true}
          error={new Error("Failed")}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      // Initially error
      expect(screen.getByText(/failed to load users/i)).toBeInTheDocument();

      // After successful retry
      rerender(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      expect(screen.queryByText(/failed to load/i)).not.toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /alice johnson/i })).toBeInTheDocument();
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className to container", () => {
      const { container } = render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
          className="custom-grid-class"
        />,
      );

      const section = container.querySelector("section");
      expect(section).toHaveClass("user-card-grid", "custom-grid-class");
    });
  });

  describe("Responsive Grid Layout", () => {
    it("user sees cards displayed in grid layout structure", () => {
      const { container } = render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const grid = container.querySelector(".card-grid");
      expect(grid).toBeInTheDocument();
    });

    it("grid container has correct CSS class for styling", () => {
      const { container } = render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const grid = container.querySelector(".card-grid");
      expect(grid).toHaveClass("card-grid");
    });

    it("user sees multiple cards rendered in grid container", () => {
      const { container } = render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const grid = container.querySelector(".card-grid");
      const cards = grid?.querySelectorAll("article");
      expect(cards?.length).toBe(3);
    });

    it("grid maintains structure with single card", () => {
      const { container } = render(
        <UserCardGrid
          users={[mockUsers[0]]}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const grid = container.querySelector(".card-grid");
      const cards = grid?.querySelectorAll("article");
      expect(grid).toBeInTheDocument();
      expect(cards?.length).toBe(1);
    });

    it("grid maintains structure with many cards", () => {
      const manyUsers = Array.from({ length: 12 }, (_, i) => ({
        name: `User ${i + 1}`,
        role: `Role ${i + 1}`,
        permission: "viewer" as const,
        team: `Team ${i + 1}`,
        contactInfo: `user${i + 1}@company.com`,
      }));

      const { container } = render(
        <UserCardGrid
          users={manyUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const grid = container.querySelector(".card-grid");
      const cards = grid?.querySelectorAll("article");
      expect(grid).toBeInTheDocument();
      expect(cards?.length).toBe(12);
    });

    it("cards are rendered in expected order within grid", () => {
      render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const headings = screen.getAllByRole("heading", { level: 3 });
      expect(headings[0]).toHaveTextContent("Alice Johnson");
      expect(headings[1]).toHaveTextContent("Bob Smith");
      expect(headings[2]).toHaveTextContent("Carol Davis");
    });

    it("grid uses CardGrid component for layout", () => {
      const { container } = render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const cardGrid = container.querySelector(".card-grid");
      expect(cardGrid).toBeInTheDocument();
    });

    it("grid wrapper maintains full width for responsiveness", () => {
      const { container } = render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const wrapper = container.querySelector(".user-card-grid");
      expect(wrapper).toBeInTheDocument();
    });

    it("loading skeletons also render in grid layout", () => {
      render(
        <UserCardGrid
          users={[]}
          isLoading={true}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      // Skeletons should be present and can be queried by aria-label
      const skeletons = screen.getAllByLabelText("Loading");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("Grid Accessibility for Screen Readers", () => {
    it("grid uses semantic section element", () => {
      const { container } = render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const section = container.querySelector("section.user-card-grid");
      expect(section).toBeInTheDocument();
    });

    it("each card uses semantic article element", () => {
      const { container } = render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);
    });

    it("cards maintain logical reading order for screen readers", () => {
      render(
        <UserCardGrid
          users={mockUsers}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
          onViewDetails={mockOnViewDetails}
        />,
      );

      const headings = screen.getAllByRole("heading", { level: 3 });
      expect(headings[0]).toHaveTextContent("Alice Johnson");
      expect(headings[1]).toHaveTextContent("Bob Smith");
      expect(headings[2]).toHaveTextContent("Carol Davis");
    });
  });
});
