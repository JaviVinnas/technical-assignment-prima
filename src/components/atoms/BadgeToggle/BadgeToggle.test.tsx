import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BadgeToggle } from "./BadgeToggle";

/**
 * Test suite for BadgeToggle component.
 *
 * Focuses on user interactions, toggle state, and accessibility.
 * Tests verify what users see and do with toggleable badges.
 */
describe("BadgeToggle", () => {
  describe("Display", () => {
    it("user sees badge toggle button", () => {
      render(<BadgeToggle variant="accent-1">Admin</BadgeToggle>);

      const badge = screen.getByRole("button", { name: /admin/i });
      expect(badge).toBeInTheDocument();
    });

    it("user sees badge toggle with complex content", () => {
      render(
        <BadgeToggle variant="accent-2">
          <span>Premium User</span>
        </BadgeToggle>,
      );

      expect(screen.getByRole("button")).toHaveTextContent("Premium User");
    });
  });

  describe("Toggle State", () => {
    it("user sees inactive badge toggle without checkmark", () => {
      render(
        <BadgeToggle variant="accent-1" isActive={false}>
          Editor
        </BadgeToggle>,
      );

      const badge = screen.getByRole("button");
      const checkmark = badge.querySelector(".badge-toggle__checkmark");
      expect(checkmark).not.toHaveClass("badge-toggle__checkmark--visible");
    });

    it("user sees active badge toggle with visible checkmark", () => {
      render(
        <BadgeToggle variant="accent-1" isActive={true}>
          Editor
        </BadgeToggle>,
      );

      const badge = screen.getByRole("button");
      const checkmark = badge.querySelector(".badge-toggle__checkmark");
      expect(checkmark).toHaveClass("badge-toggle__checkmark--visible");
    });

    it("user sees checkmark appear when badge becomes active", () => {
      const { rerender } = render(
        <BadgeToggle variant="accent-1" isActive={false}>
          Viewer
        </BadgeToggle>,
      );

      let badge = screen.getByRole("button");
      let checkmark = badge.querySelector(".badge-toggle__checkmark");
      expect(checkmark).not.toHaveClass("badge-toggle__checkmark--visible");

      rerender(
        <BadgeToggle variant="accent-1" isActive={true}>
          Viewer
        </BadgeToggle>,
      );

      badge = screen.getByRole("button");
      checkmark = badge.querySelector(".badge-toggle__checkmark");
      expect(checkmark).toHaveClass("badge-toggle__checkmark--visible");
    });
  });

  describe("User Interactions", () => {
    it("user can click badge toggle to trigger action", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <BadgeToggle variant="accent-1" onClick={handleClick}>
          Admin
        </BadgeToggle>,
      );

      const badge = screen.getByRole("button", { name: /admin/i });
      await user.click(badge);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("user can activate badge toggle with keyboard Enter key", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <BadgeToggle variant="accent-2" onClick={handleClick}>
          Editor
        </BadgeToggle>,
      );

      const badge = screen.getByRole("button", { name: /editor/i });
      badge.focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("user can activate badge toggle with keyboard Space key", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <BadgeToggle variant="accent-3" onClick={handleClick}>
          Viewer
        </BadgeToggle>,
      );

      const badge = screen.getByRole("button", { name: /viewer/i });
      badge.focus();
      await user.keyboard(" ");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("badge toggle has correct button role for screen readers", () => {
      render(<BadgeToggle variant="accent-1">Admin</BadgeToggle>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("user can focus badge toggle with keyboard", () => {
      render(<BadgeToggle variant="accent-2">Editor</BadgeToggle>);

      const badge = screen.getByRole("button");
      badge.focus();
      expect(badge).toHaveFocus();
    });

    it("inactive badge communicates pressed state to screen readers", () => {
      render(
        <BadgeToggle variant="accent-1" isActive={false}>
          Viewer
        </BadgeToggle>,
      );

      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    });

    it("active badge communicates pressed state to screen readers", () => {
      render(
        <BadgeToggle variant="accent-1" isActive={true}>
          Viewer
        </BadgeToggle>,
      );

      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    });

    it("screen readers are notified when badge toggle state changes", () => {
      const { rerender } = render(
        <BadgeToggle variant="accent-1" isActive={false}>
          Guest
        </BadgeToggle>,
      );

      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");

      rerender(
        <BadgeToggle variant="accent-1" isActive={true}>
          Guest
        </BadgeToggle>,
      );

      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    });

    it("checkmark icon is hidden from screen readers", () => {
      render(
        <BadgeToggle variant="accent-1" isActive={true}>
          Admin
        </BadgeToggle>,
      );

      const checkmark = screen.getByRole("button").querySelector(".badge-toggle__checkmark");
      expect(checkmark).toHaveAttribute("aria-hidden", "true");
    });

    it("badge toggle supports aria-label for descriptive screen reader text", () => {
      render(
        <BadgeToggle variant="accent-1" aria-label="Filter by administrator permission">
          Admin
        </BadgeToggle>,
      );

      expect(
        screen.getByRole("button", { name: /filter by administrator permission/i }),
      ).toBeInTheDocument();
    });

    it("badge toggle supports aria-describedby for additional context", () => {
      render(
        <div>
          <BadgeToggle variant="accent-1" aria-describedby="filter-help">
            Editor
          </BadgeToggle>
          <span id="filter-help">Click to filter users by this permission level</span>
        </div>,
      );

      const badge = screen.getByRole("button");
      expect(badge).toHaveAttribute("aria-describedby", "filter-help");
    });
  });
});
