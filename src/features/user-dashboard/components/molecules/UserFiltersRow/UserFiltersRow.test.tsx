import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UserFiltersRow } from "./UserFiltersRow";

/**
 * Test suite for UserFiltersRow component.
 *
 * Focuses on user interactions with permission filter badges.
 * Tests verify what users see and do when filtering by permissions:
 * viewing available permissions, toggling selections, and understanding
 * which permissions are active.
 */
describe("UserFiltersRow", () => {
  describe("Display", () => {
    it("user sees filter label", () => {
      render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      expect(screen.getByText(/filter by:/i)).toBeInTheDocument();
    });

    it("user sees all permission options", () => {
      render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      expect(screen.getByRole("button", { name: /admin/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /editor/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /viewer/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /guest/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /owner/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /inactive/i })).toBeInTheDocument();
    });

    it("user sees six permission badge options", () => {
      render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(6);
    });

    it("user sees permission badges in expected order", () => {
      render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveTextContent(/admin/i);
      expect(buttons[1]).toHaveTextContent(/editor/i);
      expect(buttons[2]).toHaveTextContent(/viewer/i);
      expect(buttons[3]).toHaveTextContent(/guest/i);
      expect(buttons[4]).toHaveTextContent(/owner/i);
      expect(buttons[5]).toHaveTextContent(/inactive/i);
    });
  });

  describe("Permission Badge Visual State", () => {
    it("user sees unselected state for all permissions initially", () => {
      render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      const adminBadge = screen.getByRole("button", { name: /admin/i });
      const editorBadge = screen.getByRole("button", { name: /editor/i });

      expect(adminBadge).toHaveAttribute("aria-pressed", "false");
      expect(editorBadge).toHaveAttribute("aria-pressed", "false");
    });

    it("user sees checkmark on selected permissions", () => {
      render(<UserFiltersRow selectedPermissions={["admin"]} onToggle={vi.fn()} />);

      const adminBadge = screen.getByRole("button", { name: /admin/i, pressed: true });
      const checkmark = adminBadge.querySelector(".badge-toggle__checkmark");

      expect(checkmark).toHaveClass("badge-toggle__checkmark--visible");
    });

    it("user sees no checkmark on unselected permissions", () => {
      render(<UserFiltersRow selectedPermissions={["admin"]} onToggle={vi.fn()} />);

      const editorBadge = screen.getByRole("button", { name: /editor/i, pressed: false });
      const checkmark = editorBadge.querySelector(".badge-toggle__checkmark");

      expect(checkmark).not.toHaveClass("badge-toggle__checkmark--visible");
    });

    it("user sees multiple selected permissions with checkmarks", () => {
      render(
        <UserFiltersRow selectedPermissions={["admin", "editor", "viewer"]} onToggle={vi.fn()} />,
      );

      const adminBadge = screen.getByRole("button", { name: /admin/i, pressed: true });
      const editorBadge = screen.getByRole("button", { name: /editor/i, pressed: true });
      const viewerBadge = screen.getByRole("button", { name: /viewer/i, pressed: true });
      const guestBadge = screen.getByRole("button", { name: /guest/i, pressed: false });

      expect(adminBadge.querySelector(".badge-toggle__checkmark")).toHaveClass(
        "badge-toggle__checkmark--visible",
      );
      expect(editorBadge.querySelector(".badge-toggle__checkmark")).toHaveClass(
        "badge-toggle__checkmark--visible",
      );
      expect(viewerBadge.querySelector(".badge-toggle__checkmark")).toHaveClass(
        "badge-toggle__checkmark--visible",
      );
      expect(guestBadge.querySelector(".badge-toggle__checkmark")).not.toHaveClass(
        "badge-toggle__checkmark--visible",
      );
    });

    it("user sees all permissions selected when all are in array", () => {
      render(
        <UserFiltersRow
          selectedPermissions={["admin", "editor", "viewer", "guest", "owner", "inactive"]}
          onToggle={vi.fn()}
        />,
      );

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("aria-pressed", "true");
        expect(button.querySelector(".badge-toggle__checkmark")).toHaveClass(
          "badge-toggle__checkmark--visible",
        );
      });
    });
  });

  describe("User Interactions - Toggle Permissions", () => {
    it("user clicking Admin badge triggers onToggle with admin", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(<UserFiltersRow selectedPermissions={[]} onToggle={handleToggle} />);

      const adminBadge = screen.getByRole("button", { name: /admin/i });
      await user.click(adminBadge);

      expect(handleToggle).toHaveBeenCalledWith("admin");
      expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it("user clicking Editor badge triggers onToggle with editor", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(<UserFiltersRow selectedPermissions={[]} onToggle={handleToggle} />);

      const editorBadge = screen.getByRole("button", { name: /editor/i });
      await user.click(editorBadge);

      expect(handleToggle).toHaveBeenCalledWith("editor");
    });

    it("user clicking Viewer badge triggers onToggle with viewer", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(<UserFiltersRow selectedPermissions={[]} onToggle={handleToggle} />);

      const viewerBadge = screen.getByRole("button", { name: /viewer/i });
      await user.click(viewerBadge);

      expect(handleToggle).toHaveBeenCalledWith("viewer");
    });

    it("user clicking Guest badge triggers onToggle with guest", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(<UserFiltersRow selectedPermissions={[]} onToggle={handleToggle} />);

      const guestBadge = screen.getByRole("button", { name: /guest/i });
      await user.click(guestBadge);

      expect(handleToggle).toHaveBeenCalledWith("guest");
    });

    it("user clicking Owner badge triggers onToggle with owner", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(<UserFiltersRow selectedPermissions={[]} onToggle={handleToggle} />);

      const ownerBadge = screen.getByRole("button", { name: /owner/i });
      await user.click(ownerBadge);

      expect(handleToggle).toHaveBeenCalledWith("owner");
    });

    it("user clicking Inactive badge triggers onToggle with inactive", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(<UserFiltersRow selectedPermissions={[]} onToggle={handleToggle} />);

      const inactiveBadge = screen.getByRole("button", { name: /inactive/i });
      await user.click(inactiveBadge);

      expect(handleToggle).toHaveBeenCalledWith("inactive");
    });

    it("user clicking selected permission triggers onToggle for deselection", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(<UserFiltersRow selectedPermissions={["admin"]} onToggle={handleToggle} />);

      const adminBadge = screen.getByRole("button", { name: /admin/i, pressed: true });
      await user.click(adminBadge);

      expect(handleToggle).toHaveBeenCalledWith("admin");
    });

    it("user can toggle multiple permissions independently", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(<UserFiltersRow selectedPermissions={[]} onToggle={handleToggle} />);

      await user.click(screen.getByRole("button", { name: /admin/i }));
      expect(handleToggle).toHaveBeenCalledWith("admin");

      await user.click(screen.getByRole("button", { name: /viewer/i }));
      expect(handleToggle).toHaveBeenCalledWith("viewer");

      await user.click(screen.getByRole("button", { name: /guest/i }));
      expect(handleToggle).toHaveBeenCalledWith("guest");

      expect(handleToggle).toHaveBeenCalledTimes(3);
    });

    it("user clicking same permission multiple times triggers onToggle each time", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(<UserFiltersRow selectedPermissions={[]} onToggle={handleToggle} />);

      const adminBadge = screen.getByRole("button", { name: /admin/i });
      await user.click(adminBadge);
      await user.click(adminBadge);
      await user.click(adminBadge);

      expect(handleToggle).toHaveBeenCalledWith("admin");
      expect(handleToggle).toHaveBeenCalledTimes(3);
    });
  });

  describe("Permission Badge Appearance", () => {
    it("Admin badge has correct visual style", () => {
      render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      const adminBadge = screen.getByRole("button", { name: /admin/i });
      expect(adminBadge).toHaveClass("badge-toggle");
    });

    it("each permission has distinct badge", () => {
      render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      const adminBadge = screen.getByRole("button", { name: /admin/i });
      const editorBadge = screen.getByRole("button", { name: /editor/i });
      const viewerBadge = screen.getByRole("button", { name: /viewer/i });

      expect(adminBadge).toBeInTheDocument();
      expect(editorBadge).toBeInTheDocument();
      expect(viewerBadge).toBeInTheDocument();
      expect(adminBadge).not.toBe(editorBadge);
    });
  });

  describe("Accessibility", () => {
    it("renders as semantic nav element", () => {
      const { container } = render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      const nav = container.querySelector("nav");
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass("filters-row");
    });

    it("keyboard users can tab to permission badges", async () => {
      const user = userEvent.setup();
      render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      await user.tab();

      const adminBadge = screen.getByRole("button", { name: /admin/i });
      expect(adminBadge).toHaveFocus();
    });

    it("keyboard users can activate permission with Enter key", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(<UserFiltersRow selectedPermissions={[]} onToggle={handleToggle} />);

      const adminBadge = screen.getByRole("button", { name: /admin/i });
      adminBadge.focus();
      await user.keyboard("{Enter}");

      expect(handleToggle).toHaveBeenCalledWith("admin");
    });

    it("keyboard users can activate permission with Space key", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(<UserFiltersRow selectedPermissions={[]} onToggle={handleToggle} />);

      const editorBadge = screen.getByRole("button", { name: /editor/i });
      editorBadge.focus();
      await user.keyboard(" ");

      expect(handleToggle).toHaveBeenCalledWith("editor");
    });

    it("keyboard users can navigate between permissions with Tab", async () => {
      const user = userEvent.setup();
      render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      await user.tab();
      expect(screen.getByRole("button", { name: /admin/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("button", { name: /editor/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("button", { name: /viewer/i })).toHaveFocus();
    });

    it("permission badges communicate pressed state to screen readers", () => {
      render(<UserFiltersRow selectedPermissions={["admin", "viewer"]} onToggle={vi.fn()} />);

      const adminBadge = screen.getByRole("button", { name: /admin/i });
      const editorBadge = screen.getByRole("button", { name: /editor/i });
      const viewerBadge = screen.getByRole("button", { name: /viewer/i });

      expect(adminBadge).toHaveAttribute("aria-pressed", "true");
      expect(editorBadge).toHaveAttribute("aria-pressed", "false");
      expect(viewerBadge).toHaveAttribute("aria-pressed", "true");
    });

    it("checkmark icons are hidden from screen readers", () => {
      render(<UserFiltersRow selectedPermissions={["admin"]} onToggle={vi.fn()} />);

      const adminBadge = screen.getByRole("button", { name: /admin/i, pressed: true });
      const checkmark = adminBadge.querySelector(".badge-toggle__checkmark");

      expect(checkmark).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className to container", () => {
      const { container } = render(
        <UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} className="custom-filters" />,
      );

      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("filters-row", "custom-filters");
    });

    it("applies empty className gracefully", () => {
      const { container } = render(
        <UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} className="" />,
      );

      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("filters-row");
    });
  });

  describe("State Updates", () => {
    it("updates visual state when selectedPermissions changes", () => {
      const { rerender } = render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      const adminBadge = screen.getByRole("button", { name: /admin/i });
      expect(adminBadge).toHaveAttribute("aria-pressed", "false");

      rerender(<UserFiltersRow selectedPermissions={["admin"]} onToggle={vi.fn()} />);

      expect(adminBadge).toHaveAttribute("aria-pressed", "true");
    });

    it("updates checkmarks when selections change", () => {
      const { rerender } = render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      const adminBadge = screen.getByRole("button", { name: /admin/i });
      expect(adminBadge.querySelector(".badge-toggle__checkmark")).not.toHaveClass(
        "badge-toggle__checkmark--visible",
      );

      rerender(<UserFiltersRow selectedPermissions={["admin"]} onToggle={vi.fn()} />);

      expect(adminBadge.querySelector(".badge-toggle__checkmark")).toHaveClass(
        "badge-toggle__checkmark--visible",
      );
    });

    it("handles adding and removing multiple selections", () => {
      const { rerender } = render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      rerender(<UserFiltersRow selectedPermissions={["admin", "editor"]} onToggle={vi.fn()} />);

      expect(screen.getByRole("button", { name: /admin/i })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(screen.getByRole("button", { name: /editor/i })).toHaveAttribute(
        "aria-pressed",
        "true",
      );

      rerender(<UserFiltersRow selectedPermissions={["editor", "viewer"]} onToggle={vi.fn()} />);

      expect(screen.getByRole("button", { name: /admin/i })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
      expect(screen.getByRole("button", { name: /editor/i })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(screen.getByRole("button", { name: /viewer/i })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });
  });
});
