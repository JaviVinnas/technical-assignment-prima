import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./Badge";

describe("Badge", () => {
  describe("Rendering", () => {
    it("renders badge with admin variant", () => {
      render(<Badge variant="admin">Admin</Badge>);
      const badge = screen.getByText("Admin");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--admin");
    });

    it("renders badge with editor variant", () => {
      render(<Badge variant="editor">Editor</Badge>);
      const badge = screen.getByText("Editor");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--editor");
    });

    it("renders badge with viewer variant", () => {
      render(<Badge variant="viewer">Viewer</Badge>);
      const badge = screen.getByText("Viewer");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--viewer");
    });

    it("renders badge with guest variant", () => {
      render(<Badge variant="guest">Guest</Badge>);
      const badge = screen.getByText("Guest");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--guest");
    });

    it("renders badge with deactivated variant", () => {
      render(<Badge variant="deactivated">Deactivated</Badge>);
      const badge = screen.getByText("Deactivated");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("badge", "badge--deactivated");
    });

    it("renders badge with children content", () => {
      render(
        <Badge variant="admin">
          <span>Admin User</span>
        </Badge>,
      );
      expect(screen.getByText("Admin User")).toBeInTheDocument();
    });

    it("renders badge with different text lengths", () => {
      const { rerender } = render(<Badge variant="admin">Short</Badge>);
      expect(screen.getByText("Short")).toBeInTheDocument();

      rerender(<Badge variant="admin">This is a much longer badge text that should adapt</Badge>);
      expect(
        screen.getByText("This is a much longer badge text that should adapt"),
      ).toBeInTheDocument();
    });

    it("applies additional className when provided", () => {
      render(
        <Badge variant="admin" className="custom-class">
          Badge
        </Badge>,
      );
      const badge = screen.getByText("Badge");
      expect(badge).toHaveClass("badge", "badge--admin", "custom-class");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through additional HTML span attributes", () => {
      render(
        <Badge variant="admin" data-testid="custom-badge" title="Tooltip">
          Badge
        </Badge>,
      );
      const badge = screen.getByText("Badge");
      expect(badge).toHaveAttribute("data-testid", "custom-badge");
      expect(badge).toHaveAttribute("title", "Tooltip");
    });

    it("supports aria-label for screen readers", () => {
      render(
        <Badge variant="admin" aria-label="Admin user badge">
          Admin
        </Badge>,
      );
      const badge = screen.getByLabelText("Admin user badge");
      expect(badge).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <div>
          <Badge variant="admin" aria-describedby="badge-help">
            Admin
          </Badge>
          <span id="badge-help">This badge indicates admin privileges</span>
        </div>,
      );
      const badge = screen.getByText("Admin");
      expect(badge).toHaveAttribute("aria-describedby", "badge-help");
    });
  });

  describe("Design Tokens", () => {
    it("applies admin variant styles with correct CSS classes", () => {
      render(<Badge variant="admin">Admin</Badge>);
      const badge = screen.getByText("Admin");
      expect(badge).toHaveClass("badge--admin");
    });

    it("applies editor variant styles with correct CSS classes", () => {
      render(<Badge variant="editor">Editor</Badge>);
      const badge = screen.getByText("Editor");
      expect(badge).toHaveClass("badge--editor");
    });

    it("applies viewer variant styles with correct CSS classes", () => {
      render(<Badge variant="viewer">Viewer</Badge>);
      const badge = screen.getByText("Viewer");
      expect(badge).toHaveClass("badge--viewer");
    });

    it("applies guest variant styles with correct CSS classes", () => {
      render(<Badge variant="guest">Guest</Badge>);
      const badge = screen.getByText("Guest");
      expect(badge).toHaveClass("badge--guest");
    });

    it("applies deactivated variant styles with correct CSS classes", () => {
      render(<Badge variant="deactivated">Deactivated</Badge>);
      const badge = screen.getByText("Deactivated");
      expect(badge).toHaveClass("badge--deactivated");
    });
  });
});
