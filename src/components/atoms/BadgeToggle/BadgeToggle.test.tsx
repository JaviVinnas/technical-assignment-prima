import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BadgeToggle } from "./BadgeToggle";

describe("BadgeToggle", () => {
  describe("Rendering", () => {
    it("renders badge toggle with accent-1 variant", () => {
      render(<BadgeToggle variant="accent-1">Accent 1</BadgeToggle>);
      const badge = screen.getByRole("button", { name: /accent 1/i });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--accent-1", "badge-toggle");
    });

    it("renders badge toggle with accent-2 variant", () => {
      render(<BadgeToggle variant="accent-2">Accent 2</BadgeToggle>);
      const badge = screen.getByRole("button", { name: /accent 2/i });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--accent-2", "badge-toggle");
    });

    it("renders badge toggle with accent-3 variant", () => {
      render(<BadgeToggle variant="accent-3">Accent 3</BadgeToggle>);
      const badge = screen.getByRole("button", { name: /accent 3/i });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--accent-3", "badge-toggle");
    });

    it("renders badge toggle with accent-4 variant", () => {
      render(<BadgeToggle variant="accent-4">Accent 4</BadgeToggle>);
      const badge = screen.getByRole("button", { name: /accent 4/i });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--accent-4", "badge-toggle");
    });

    it("renders badge toggle with default variant", () => {
      render(<BadgeToggle variant="default">Default</BadgeToggle>);
      const badge = screen.getByRole("button", { name: /default/i });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--default", "badge-toggle");
    });

    it("renders badge toggle with children content", () => {
      render(
        <BadgeToggle variant="accent-1">
          <span>Badge Content</span>
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveTextContent("Badge Content");
    });

    it("applies additional className when provided", () => {
      render(
        <BadgeToggle variant="accent-1" className="custom-class">
          Badge
        </BadgeToggle>,
      );
      const badge = screen.getByRole("button");
      expect(badge).toHaveClass("badge", "badge--accent-1", "badge-toggle", "custom-class");
    });
  });

  describe("Active State", () => {
    it("checkmark is always rendered but hidden when isActive is false", () => {
      render(
        <BadgeToggle variant="accent-1" isActive={false}>
          Admin
        </BadgeToggle>,
      );
      const badge = screen.getByRole("button");
      const checkmark = badge.querySelector(".badge-toggle__checkmark");
      expect(checkmark).toBeInTheDocument();
      expect(checkmark).not.toHaveClass("badge-toggle__checkmark--visible");
    });

    it("checkmark is always rendered but hidden when isActive is not provided", () => {
      render(<BadgeToggle variant="accent-1">Admin</BadgeToggle>);
      const badge = screen.getByRole("button");
      const checkmark = badge.querySelector(".badge-toggle__checkmark");
      expect(checkmark).toBeInTheDocument();
      expect(checkmark).not.toHaveClass("badge-toggle__checkmark--visible");
    });

    it("checkmark is visible when isActive is true", () => {
      render(
        <BadgeToggle variant="accent-1" isActive={true}>
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
        <BadgeToggle variant="accent-1" isActive={false}>
          Admin
        </BadgeToggle>,
      );
      let badge = screen.getByRole("button");
      let checkmark = badge.querySelector(".badge-toggle__checkmark");
      expect(checkmark).toBeInTheDocument();
      expect(checkmark).not.toHaveClass("badge-toggle__checkmark--visible");

      rerender(
        <BadgeToggle variant="accent-1" isActive={true}>
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
        <BadgeToggle variant="accent-1" onClick={handleClick}>
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
        <BadgeToggle variant="accent-1" onClick={handleClick}>
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
        <BadgeToggle variant="accent-1" onClick={handleClick}>
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
      render(<BadgeToggle variant="accent-1">Badge</BadgeToggle>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("can be focused with keyboard", () => {
      render(<BadgeToggle variant="accent-1">Badge</BadgeToggle>);
      const badge = screen.getByRole("button");
      badge.focus();
      expect(badge).toHaveFocus();
    });

    it("has aria-pressed=false when isActive is false", () => {
      render(
        <BadgeToggle variant="accent-1" isActive={false}>
          Badge
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    });

    it("has aria-pressed=true when isActive is true", () => {
      render(
        <BadgeToggle variant="accent-1" isActive={true}>
          Badge
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    });

    it("updates aria-pressed when isActive changes", () => {
      const { rerender } = render(
        <BadgeToggle variant="accent-1" isActive={false}>
          Badge
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");

      rerender(
        <BadgeToggle variant="accent-1" isActive={true}>
          Badge
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    });

    it("checkmark icon has aria-hidden attribute", () => {
      render(
        <BadgeToggle variant="accent-1" isActive={true}>
          Badge
        </BadgeToggle>,
      );
      const checkmark = screen.getByRole("button").querySelector(".badge-toggle__checkmark");
      expect(checkmark).toHaveAttribute("aria-hidden", "true");
    });

    it("supports aria-label for screen readers", () => {
      render(
        <BadgeToggle variant="accent-1" aria-label="Custom badge toggle">
          Badge
        </BadgeToggle>,
      );
      expect(screen.getByRole("button", { name: /custom badge toggle/i })).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <div>
          <BadgeToggle variant="accent-1" aria-describedby="badge-help">
            Badge
          </BadgeToggle>
          <span id="badge-help">This badge indicates a specific status</span>
        </div>,
      );
      const badge = screen.getByRole("button");
      expect(badge).toHaveAttribute("aria-describedby", "badge-help");
    });
  });

  describe("BadgeToggle States", () => {
    it("has correct type attribute", () => {
      const { rerender } = render(
        <BadgeToggle variant="accent-1" type="button">
          Badge
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");

      rerender(
        <BadgeToggle variant="accent-1" type="submit">
          Submit
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");

      rerender(
        <BadgeToggle variant="accent-1" type="reset">
          Reset
        </BadgeToggle>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
    });

    it("defaults to type='button' when type is not specified", () => {
      render(<BadgeToggle variant="accent-1">Badge</BadgeToggle>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });
  });

  describe("Design Tokens", () => {
    it("applies accent-1 variant styles with correct CSS classes", () => {
      render(<BadgeToggle variant="accent-1">Accent 1</BadgeToggle>);
      const badge = screen.getByRole("button");
      expect(badge).toHaveClass("badge--accent-1");
    });

    it("applies accent-2 variant styles with correct CSS classes", () => {
      render(<BadgeToggle variant="accent-2">Accent 2</BadgeToggle>);
      const badge = screen.getByRole("button");
      expect(badge).toHaveClass("badge--accent-2");
    });

    it("applies accent-3 variant styles with correct CSS classes", () => {
      render(<BadgeToggle variant="accent-3">Accent 3</BadgeToggle>);
      const badge = screen.getByRole("button");
      expect(badge).toHaveClass("badge--accent-3");
    });

    it("applies accent-4 variant styles with correct CSS classes", () => {
      render(<BadgeToggle variant="accent-4">Accent 4</BadgeToggle>);
      const badge = screen.getByRole("button");
      expect(badge).toHaveClass("badge--accent-4");
    });

    it("applies default variant styles with correct CSS classes", () => {
      render(<BadgeToggle variant="default">Default</BadgeToggle>);
      const badge = screen.getByRole("button");
      expect(badge).toHaveClass("badge--default");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through additional HTML button attributes", () => {
      render(
        <BadgeToggle variant="accent-1" data-testid="custom-badge" title="Tooltip">
          Badge
        </BadgeToggle>,
      );
      const badge = screen.getByRole("button");
      expect(badge).toHaveAttribute("data-testid", "custom-badge");
      expect(badge).toHaveAttribute("title", "Tooltip");
    });

    it("supports form attributes", () => {
      render(
        <BadgeToggle variant="accent-1" form="my-form" formAction="/submit">
          Submit
        </BadgeToggle>,
      );
      const badge = screen.getByRole("button");
      expect(badge).toHaveAttribute("form", "my-form");
      expect(badge).toHaveAttribute("formAction", "/submit");
    });
  });
});
