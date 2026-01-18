import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BadgeToggle } from "./BadgeToggle";

describe("BadgeToggle", () => {
  describe("Rendering", () => {
    it("renders badge toggle with admin variant", () => {
      render(<BadgeToggle variant="admin">Admin</BadgeToggle>);
      const badge = screen.getByRole("button", { name: /admin/i });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--admin", "badge-toggle");
    });

    it("renders badge toggle with editor variant", () => {
      render(<BadgeToggle variant="editor">Editor</BadgeToggle>);
      const badge = screen.getByRole("button", { name: /editor/i });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--editor", "badge-toggle");
    });

    it("renders badge toggle with viewer variant", () => {
      render(<BadgeToggle variant="viewer">Viewer</BadgeToggle>);
      const badge = screen.getByRole("button", { name: /viewer/i });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--viewer", "badge-toggle");
    });

    it("renders badge toggle with guest variant", () => {
      render(<BadgeToggle variant="guest">Guest</BadgeToggle>);
      const badge = screen.getByRole("button", { name: /guest/i });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--guest", "badge-toggle");
    });

    it("renders badge toggle with deactivated variant", () => {
      render(<BadgeToggle variant="deactivated">Deactivated</BadgeToggle>);
      const badge = screen.getByRole("button", { name: /deactivated/i });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--deactivated", "badge-toggle");
    });

    it("renders badge toggle with children content", () => {
      render(
        <BadgeToggle variant="admin">
          <span>Admin User</span>
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveTextContent("Admin User");
    });

    it("applies additional className when provided", () => {
      render(
        <BadgeToggle variant="admin" className="custom-class">
          Badge
        </BadgeToggle>,
      );
      const badge = screen.getByRole("button");
      expect(badge).toHaveClass("badge", "badge--admin", "badge-toggle", "custom-class");
    });
  });

  describe("Active State", () => {
    it("checkmark is always rendered but hidden when isActive is false", () => {
      render(
        <BadgeToggle variant="admin" isActive={false}>
          Admin
        </BadgeToggle>,
      );
      const badge = screen.getByRole("button");
      const checkmark = badge.querySelector(".badge-toggle__checkmark");
      expect(checkmark).toBeInTheDocument();
      expect(checkmark).not.toHaveClass("badge-toggle__checkmark--visible");
    });

    it("checkmark is always rendered but hidden when isActive is not provided", () => {
      render(<BadgeToggle variant="admin">Admin</BadgeToggle>);
      const badge = screen.getByRole("button");
      const checkmark = badge.querySelector(".badge-toggle__checkmark");
      expect(checkmark).toBeInTheDocument();
      expect(checkmark).not.toHaveClass("badge-toggle__checkmark--visible");
    });

    it("checkmark is visible when isActive is true", () => {
      render(
        <BadgeToggle variant="admin" isActive={true}>
          Admin
        </BadgeToggle>,
      );
      const badge = screen.getByRole("button");
      const checkmark = badge.querySelector(".badge-toggle__checkmark");
      expect(checkmark).toBeInTheDocument();
      expect(checkmark).toHaveClass("badge-toggle__checkmark--visible");
    });

    it("updates checkmark visibility when isActive changes", () => {
      const { rerender } = render(
        <BadgeToggle variant="admin" isActive={false}>
          Admin
        </BadgeToggle>,
      );
      let badge = screen.getByRole("button");
      let checkmark = badge.querySelector(".badge-toggle__checkmark");
      expect(checkmark).toBeInTheDocument();
      expect(checkmark).not.toHaveClass("badge-toggle__checkmark--visible");

      rerender(
        <BadgeToggle variant="admin" isActive={true}>
          Admin
        </BadgeToggle>,
      );
      badge = screen.getByRole("button");
      checkmark = badge.querySelector(".badge-toggle__checkmark");
      expect(checkmark).toBeInTheDocument();
      expect(checkmark).toHaveClass("badge-toggle__checkmark--visible");
    });
  });

  describe("User Interactions", () => {
    it("calls onClick when user clicks badge toggle", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <BadgeToggle variant="admin" onClick={handleClick}>
          Click me
        </BadgeToggle>,
      );

      const badge = screen.getByRole("button", { name: /click me/i });
      await user.click(badge);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("can be activated with keyboard Enter key", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <BadgeToggle variant="admin" onClick={handleClick}>
          Click me
        </BadgeToggle>,
      );

      const badge = screen.getByRole("button", { name: /click me/i });
      badge.focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("can be activated with keyboard Space key", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <BadgeToggle variant="admin" onClick={handleClick}>
          Click me
        </BadgeToggle>,
      );

      const badge = screen.getByRole("button", { name: /click me/i });
      badge.focus();
      await user.keyboard(" ");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("has correct button role", () => {
      render(<BadgeToggle variant="admin">Badge</BadgeToggle>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("can be focused with keyboard", () => {
      render(<BadgeToggle variant="admin">Badge</BadgeToggle>);
      const badge = screen.getByRole("button");
      badge.focus();
      expect(badge).toHaveFocus();
    });

    it("has aria-pressed=false when isActive is false", () => {
      render(
        <BadgeToggle variant="admin" isActive={false}>
          Badge
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    });

    it("has aria-pressed=true when isActive is true", () => {
      render(
        <BadgeToggle variant="admin" isActive={true}>
          Badge
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    });

    it("updates aria-pressed when isActive changes", () => {
      const { rerender } = render(
        <BadgeToggle variant="admin" isActive={false}>
          Badge
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");

      rerender(
        <BadgeToggle variant="admin" isActive={true}>
          Badge
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    });

    it("checkmark icon has aria-hidden attribute", () => {
      render(
        <BadgeToggle variant="admin" isActive={true}>
          Admin
        </BadgeToggle>,
      );
      const checkmark = screen.getByRole("button").querySelector(".badge-toggle__checkmark");
      expect(checkmark).toHaveAttribute("aria-hidden", "true");
    });

    it("supports aria-label for screen readers", () => {
      render(
        <BadgeToggle variant="admin" aria-label="Admin user badge">
          Admin
        </BadgeToggle>,
      );
      expect(screen.getByRole("button", { name: /admin user badge/i })).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <div>
          <BadgeToggle variant="admin" aria-describedby="badge-help">
            Admin
          </BadgeToggle>
          <span id="badge-help">This badge indicates admin privileges</span>
        </div>,
      );
      const badge = screen.getByRole("button");
      expect(badge).toHaveAttribute("aria-describedby", "badge-help");
    });
  });

  describe("BadgeToggle States", () => {
    it("has correct type attribute", () => {
      const { rerender } = render(
        <BadgeToggle variant="admin" type="button">
          Badge
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");

      rerender(
        <BadgeToggle variant="admin" type="submit">
          Submit
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");

      rerender(
        <BadgeToggle variant="admin" type="reset">
          Reset
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
    });

    it("defaults to type='button' when type is not specified", () => {
      render(<BadgeToggle variant="admin">Badge</BadgeToggle>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });
  });

  describe("Design Tokens", () => {
    it("applies admin variant styles with correct CSS classes", () => {
      render(<BadgeToggle variant="admin">Admin</BadgeToggle>);
      const badge = screen.getByRole("button");
      expect(badge).toHaveClass("badge--admin");
    });

    it("applies editor variant styles with correct CSS classes", () => {
      render(<BadgeToggle variant="editor">Editor</BadgeToggle>);
      const badge = screen.getByRole("button");
      expect(badge).toHaveClass("badge--editor");
    });

    it("applies viewer variant styles with correct CSS classes", () => {
      render(<BadgeToggle variant="viewer">Viewer</BadgeToggle>);
      const badge = screen.getByRole("button");
      expect(badge).toHaveClass("badge--viewer");
    });

    it("applies guest variant styles with correct CSS classes", () => {
      render(<BadgeToggle variant="guest">Guest</BadgeToggle>);
      const badge = screen.getByRole("button");
      expect(badge).toHaveClass("badge--guest");
    });

    it("applies deactivated variant styles with correct CSS classes", () => {
      render(<BadgeToggle variant="deactivated">Deactivated</BadgeToggle>);
      const badge = screen.getByRole("button");
      expect(badge).toHaveClass("badge--deactivated");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through additional HTML button attributes", () => {
      render(
        <BadgeToggle variant="admin" data-testid="custom-badge" title="Tooltip">
          Badge
        </BadgeToggle>,
      );
      const badge = screen.getByRole("button");
      expect(badge).toHaveAttribute("data-testid", "custom-badge");
      expect(badge).toHaveAttribute("title", "Tooltip");
    });

    it("supports form attributes", () => {
      render(
        <BadgeToggle variant="admin" form="my-form" formAction="/submit">
          Submit
        </BadgeToggle>,
      );
      const badge = screen.getByRole("button");
      expect(badge).toHaveAttribute("form", "my-form");
      expect(badge).toHaveAttribute("formAction", "/submit");
    });
  });
});
