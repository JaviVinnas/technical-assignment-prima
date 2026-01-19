import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FiltersRow } from "./FiltersRow";

/**
 * Test suite for FiltersRow component.
 *
 * Focuses on user interactions with filter options and selection management.
 * Tests verify what users see and do with filters: viewing options, toggling
 * selections, and understanding selection state.
 */
describe("FiltersRow", () => {
  const mockOptions = ["admin", "editor", "viewer", "guest"] as const;
  const mockRenderOption = (value: string, isSelected: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      data-testid={`filter-${value}`}
    >
      {value.toUpperCase()}
      {isSelected && " ✓"}
    </button>
  );

  describe("Display", () => {
    it("user sees filter label", () => {
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      expect(screen.getByText(/filter by:/i)).toBeInTheDocument();
    });

    it("user sees all filter options rendered", () => {
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      expect(screen.getByTestId("filter-admin")).toBeInTheDocument();
      expect(screen.getByTestId("filter-editor")).toBeInTheDocument();
      expect(screen.getByTestId("filter-viewer")).toBeInTheDocument();
      expect(screen.getByTestId("filter-guest")).toBeInTheDocument();
    });

    it("user sees correct number of filter options", () => {
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      const filters = screen.getAllByRole("button");
      expect(filters).toHaveLength(4);
    });

    it("user sees different options when options prop changes", () => {
      const differentOptions = ["option1", "option2"];
      render(
        <FiltersRow
          label="FILTER BY:"
          options={differentOptions}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      expect(screen.getByTestId("filter-option1")).toBeInTheDocument();
      expect(screen.getByTestId("filter-option2")).toBeInTheDocument();
      expect(screen.queryByTestId("filter-admin")).not.toBeInTheDocument();
    });

    it("user sees custom label text", () => {
      render(
        <FiltersRow
          label="CHOOSE PERMISSIONS:"
          options={mockOptions}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      expect(screen.getByText(/choose permissions:/i)).toBeInTheDocument();
    });
  });

  describe("Selection State Display", () => {
    it("user sees unselected state for all options initially", () => {
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      const adminFilter = screen.getByTestId("filter-admin");
      const editorFilter = screen.getByTestId("filter-editor");

      expect(adminFilter).toHaveAttribute("aria-pressed", "false");
      expect(editorFilter).toHaveAttribute("aria-pressed", "false");
      expect(adminFilter).not.toHaveTextContent("✓");
    });

    it("user sees selected state for pre-selected options", () => {
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={["admin", "viewer"]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      const adminFilter = screen.getByTestId("filter-admin");
      const editorFilter = screen.getByTestId("filter-editor");
      const viewerFilter = screen.getByTestId("filter-viewer");

      expect(adminFilter).toHaveAttribute("aria-pressed", "true");
      expect(viewerFilter).toHaveAttribute("aria-pressed", "true");
      expect(editorFilter).toHaveAttribute("aria-pressed", "false");

      expect(adminFilter).toHaveTextContent("✓");
      expect(viewerFilter).toHaveTextContent("✓");
    });

    it("user sees all options selected when all are in selected array", () => {
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={["admin", "editor", "viewer", "guest"]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      const filters = screen.getAllByRole("button");
      filters.forEach((filter) => {
        expect(filter).toHaveAttribute("aria-pressed", "true");
        expect(filter).toHaveTextContent("✓");
      });
    });

    it("user sees selection state update when selected prop changes", () => {
      const { rerender } = render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      const adminFilter = screen.getByTestId("filter-admin");
      expect(adminFilter).toHaveAttribute("aria-pressed", "false");

      rerender(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={["admin"]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      expect(adminFilter).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("User Interactions - Toggle", () => {
    it("user clicking unselected option triggers onToggle with that value", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={handleToggle}
          renderOption={mockRenderOption}
        />,
      );

      const adminFilter = screen.getByTestId("filter-admin");
      await user.click(adminFilter);

      expect(handleToggle).toHaveBeenCalledWith("admin");
      expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it("user clicking selected option triggers onToggle for deselection", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={["editor"]}
          onToggle={handleToggle}
          renderOption={mockRenderOption}
        />,
      );

      const editorFilter = screen.getByTestId("filter-editor");
      await user.click(editorFilter);

      expect(handleToggle).toHaveBeenCalledWith("editor");
    });

    it("user can toggle multiple different options independently", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={handleToggle}
          renderOption={mockRenderOption}
        />,
      );

      const adminFilter = screen.getByTestId("filter-admin");
      const viewerFilter = screen.getByTestId("filter-viewer");
      const guestFilter = screen.getByTestId("filter-guest");

      await user.click(adminFilter);
      expect(handleToggle).toHaveBeenCalledWith("admin");

      await user.click(viewerFilter);
      expect(handleToggle).toHaveBeenCalledWith("viewer");

      await user.click(guestFilter);
      expect(handleToggle).toHaveBeenCalledWith("guest");

      expect(handleToggle).toHaveBeenCalledTimes(3);
    });

    it("user clicking same option multiple times triggers onToggle each time", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={handleToggle}
          renderOption={mockRenderOption}
        />,
      );

      const adminFilter = screen.getByTestId("filter-admin");
      await user.click(adminFilter);
      await user.click(adminFilter);
      await user.click(adminFilter);

      expect(handleToggle).toHaveBeenCalledWith("admin");
      expect(handleToggle).toHaveBeenCalledTimes(3);
    });
  });

  describe("Custom Render Option", () => {
    it("calls renderOption function for each option", () => {
      const mockRender = vi.fn((value, isSelected, onClick) => (
        <button type="button" onClick={onClick} key={value}>
          {value}
        </button>
      ));

      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRender}
        />,
      );

      expect(mockRender).toHaveBeenCalledTimes(4);
      expect(mockRender).toHaveBeenCalledWith("admin", false, expect.any(Function));
      expect(mockRender).toHaveBeenCalledWith("editor", false, expect.any(Function));
      expect(mockRender).toHaveBeenCalledWith("viewer", false, expect.any(Function));
      expect(mockRender).toHaveBeenCalledWith("guest", false, expect.any(Function));
    });

    it("calls renderOption with correct isSelected state", () => {
      const mockRender = vi.fn((value, isSelected, onClick) => (
        <button type="button" onClick={onClick} key={value}>
          {value}
        </button>
      ));

      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={["admin", "viewer"]}
          onToggle={vi.fn()}
          renderOption={mockRender}
        />,
      );

      expect(mockRender).toHaveBeenCalledWith("admin", true, expect.any(Function));
      expect(mockRender).toHaveBeenCalledWith("editor", false, expect.any(Function));
      expect(mockRender).toHaveBeenCalledWith("viewer", true, expect.any(Function));
      expect(mockRender).toHaveBeenCalledWith("guest", false, expect.any(Function));
    });

    it("user can interact with custom rendered components", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      const customRender = (value: string, isSelected: boolean, onClick: () => void) => (
        <div onClick={onClick} data-testid={`custom-${value}`} role="button" tabIndex={0}>
          <span>{value}</span>
          {isSelected && <span>ACTIVE</span>}
        </div>
      );

      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={handleToggle}
          renderOption={customRender}
        />,
      );

      const customFilter = screen.getByTestId("custom-admin");
      await user.click(customFilter);

      expect(handleToggle).toHaveBeenCalledWith("admin");
    });
  });

  describe("Custom Equality Function", () => {
    it("uses default equality (===) when isEqual not provided", () => {
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={["admin"]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      const adminFilter = screen.getByTestId("filter-admin");
      expect(adminFilter).toHaveAttribute("aria-pressed", "true");
    });

    it("uses custom equality function when provided", () => {
      const customOptions = [1, 2, 3, 4];
      const customRender = (value: number, isSelected: boolean, onClick: () => void) => (
        <button
          type="button"
          onClick={onClick}
          aria-pressed={isSelected}
          data-testid={`filter-${value}`}
        >
          {value}
        </button>
      );

      const customIsEqual = (a: number, b: number) => a % 2 === b % 2;

      render(
        <FiltersRow
          label="FILTER BY:"
          options={customOptions}
          selected={[1]}
          onToggle={vi.fn()}
          renderOption={customRender}
          isEqual={customIsEqual}
        />,
      );

      expect(screen.getByTestId("filter-1")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByTestId("filter-3")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByTestId("filter-2")).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByTestId("filter-4")).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("Accessibility", () => {
    it("renders as semantic nav element", () => {
      const { container } = render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      const nav = container.querySelector("nav");
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass("filters-row");
    });

    it("keyboard users can navigate to filter options", async () => {
      const user = userEvent.setup();
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      await user.tab();

      const adminFilter = screen.getByTestId("filter-admin");
      expect(adminFilter).toHaveFocus();
    });

    it("keyboard users can activate filters with Enter", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={handleToggle}
          renderOption={mockRenderOption}
        />,
      );

      const adminFilter = screen.getByTestId("filter-admin");
      adminFilter.focus();
      await user.keyboard("{Enter}");

      expect(handleToggle).toHaveBeenCalledWith("admin");
    });

    it("keyboard users can navigate between multiple filters", async () => {
      const user = userEvent.setup();
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      await user.tab();
      expect(screen.getByTestId("filter-admin")).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId("filter-editor")).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId("filter-viewer")).toHaveFocus();
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className to container", () => {
      const { container } = render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
          className="custom-filters-class"
        />,
      );

      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("filters-row", "custom-filters-class");
    });

    it("applies empty className gracefully", () => {
      const { container } = render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
          className=""
        />,
      );

      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("filters-row");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty options array", () => {
      render(
        <FiltersRow
          label="FILTER BY:"
          options={[]}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      expect(screen.getByText(/filter by:/i)).toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("handles single option", () => {
      render(
        <FiltersRow
          label="FILTER BY:"
          options={["single"]}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      expect(screen.getByTestId("filter-single")).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(1);
    });

    it("handles selected items not in options array", () => {
      render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={["nonexistent"]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
        />,
      );

      const filters = screen.getAllByRole("button");
      filters.forEach((filter) => {
        expect(filter).toHaveAttribute("aria-pressed", "false");
      });
    });

    it("handles numeric options", () => {
      const numericOptions = [1, 2, 3];
      const numericRender = (value: number, isSelected: boolean, onClick: () => void) => (
        <button
          type="button"
          onClick={onClick}
          aria-pressed={isSelected}
          data-testid={`filter-${value}`}
        >
          Option {value}
        </button>
      );

      render(
        <FiltersRow
          label="FILTER BY:"
          options={numericOptions}
          selected={[2]}
          onToggle={vi.fn()}
          renderOption={numericRender}
        />,
      );

      expect(screen.getByTestId("filter-2")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByTestId("filter-1")).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("Additional HTML Attributes", () => {
    it("forwards additional HTML attributes to nav element", () => {
      const { container } = render(
        <FiltersRow
          label="FILTER BY:"
          options={mockOptions}
          selected={[]}
          onToggle={vi.fn()}
          renderOption={mockRenderOption}
          data-testid="custom-filters-row"
          aria-label="User permission filters"
        />,
      );

      const nav = container.querySelector("nav");
      expect(nav).toHaveAttribute("data-testid", "custom-filters-row");
      expect(nav).toHaveAttribute("aria-label", "User permission filters");
    });
  });
});
