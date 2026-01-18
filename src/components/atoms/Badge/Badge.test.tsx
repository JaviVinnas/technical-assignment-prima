import { render, screen } from "@testing-library/react";

import { Badge } from "./Badge";

describe("Badge", () => {
  describe("Rendering", () => {
    it("renders badge with accent-1 variant", () => {
      render(<Badge variant="accent-1">Accent 1</Badge>);
      const badge = screen.getByText("Accent 1");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--accent-1");
    });

    it("renders badge with accent-2 variant", () => {
      render(<Badge variant="accent-2">Accent 2</Badge>);
      const badge = screen.getByText("Accent 2");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--accent-2");
    });

    it("renders badge with accent-3 variant", () => {
      render(<Badge variant="accent-3">Accent 3</Badge>);
      const badge = screen.getByText("Accent 3");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--accent-3");
    });

    it("renders badge with accent-4 variant", () => {
      render(<Badge variant="accent-4">Accent 4</Badge>);
      const badge = screen.getByText("Accent 4");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--accent-4");
    });

    it("renders badge with default variant", () => {
      render(<Badge variant="default">Default</Badge>);
      const badge = screen.getByText("Default");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--default");
    });

    it("renders badge with children content", () => {
      render(
        <Badge variant="accent-1">
          <span>Badge Content</span>
        </Badge>,
      );
      expect(screen.getByText("Badge Content")).toBeInTheDocument();
    });

    it("renders badge with different text lengths", () => {
      const { rerender } = render(<Badge variant="accent-1">Short</Badge>);
      expect(screen.getByText("Short")).toBeInTheDocument();

      rerender(
        <Badge variant="accent-1">This is a much longer badge text that should adapt</Badge>,
      );
      expect(
        screen.getByText("This is a much longer badge text that should adapt"),
      ).toBeInTheDocument();
    });

    it("applies additional className when provided", () => {
      render(
        <Badge variant="accent-1" className="custom-class">
          Badge
        </Badge>,
      );
      const badge = screen.getByText("Badge");
      expect(badge).toHaveClass("badge", "badge--accent-1", "custom-class");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through additional HTML span attributes", () => {
      render(
        <Badge variant="accent-1" data-testid="custom-badge" title="Tooltip">
          Badge
        </Badge>,
      );
      const badge = screen.getByText("Badge");
      expect(badge).toHaveAttribute("data-testid", "custom-badge");
      expect(badge).toHaveAttribute("title", "Tooltip");
    });

    it("supports aria-label for screen readers", () => {
      render(
        <Badge variant="accent-1" aria-label="Custom badge label">
          Badge
        </Badge>,
      );
      const badge = screen.getByLabelText("Custom badge label");
      expect(badge).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <div>
          <Badge variant="accent-1" aria-describedby="badge-help">
            Badge
          </Badge>
          <span id="badge-help">This badge indicates a specific status</span>
        </div>,
      );
      const badge = screen.getByText("Badge");
      expect(badge).toHaveAttribute("aria-describedby", "badge-help");
    });
  });

  describe("Design Tokens", () => {
    it("applies accent-1 variant styles with correct CSS classes", () => {
      render(<Badge variant="accent-1">Accent 1</Badge>);
      const badge = screen.getByText("Accent 1");
      expect(badge).toHaveClass("badge--accent-1");
    });

    it("applies accent-2 variant styles with correct CSS classes", () => {
      render(<Badge variant="accent-2">Accent 2</Badge>);
      const badge = screen.getByText("Accent 2");
      expect(badge).toHaveClass("badge--accent-2");
    });

    it("applies accent-3 variant styles with correct CSS classes", () => {
      render(<Badge variant="accent-3">Accent 3</Badge>);
      const badge = screen.getByText("Accent 3");
      expect(badge).toHaveClass("badge--accent-3");
    });

    it("applies accent-4 variant styles with correct CSS classes", () => {
      render(<Badge variant="accent-4">Accent 4</Badge>);
      const badge = screen.getByText("Accent 4");
      expect(badge).toHaveClass("badge--accent-4");
    });

    it("applies default variant styles with correct CSS classes", () => {
      render(<Badge variant="default">Default</Badge>);
      const badge = screen.getByText("Default");
      expect(badge).toHaveClass("badge--default");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string children", () => {
      const { container } = render(<Badge variant="accent-1">{""}</Badge>);
      const badge = container.querySelector(".badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--accent-1");
    });

    it("handles very long text content", () => {
      const longText = "A".repeat(200);
      render(<Badge variant="accent-1">{longText}</Badge>);
      const badge = screen.getByText(longText);
      expect(badge).toBeInTheDocument();
      // Visual overflow is handled by CSS, no JS errors expected
    });

    it("handles special characters and unicode", () => {
      render(<Badge variant="accent-1">Test™ • 日本語 • ❤️</Badge>);
      const badge = screen.getByText(/Test™ • 日本語 • ❤️/);
      expect(badge).toBeInTheDocument();
    });

    it("handles numbers as children", () => {
      render(<Badge variant="accent-1">{42}</Badge>);
      const badge = screen.getByText("42");
      expect(badge).toBeInTheDocument();
    });
  });
});
