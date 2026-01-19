import { render, screen } from "@testing-library/react";

import { Badge } from "./Badge";

/**
 * Test suite for Badge component.
 *
 * Badges are passive display components with no user interactions.
 * Tests focus on rendering and accessibility, not implementation details.
 */
describe("Badge", () => {
  describe("Display", () => {
    it("user sees badge with content displayed", () => {
      render(<Badge variant="accent-1">Admin</Badge>);

      expect(screen.getByText("Admin")).toBeInTheDocument();
    });

    it("user sees badge with complex content", () => {
      render(
        <Badge variant="accent-2">
          <span>Premium User</span>
        </Badge>,
      );

      expect(screen.getByText("Premium User")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("badge supports aria-label for screen readers", () => {
      render(
        <Badge variant="accent-1" aria-label="Administrator permission level">
          Admin
        </Badge>,
      );

      const badge = screen.getByLabelText("Administrator permission level");
      expect(badge).toBeInTheDocument();
    });

    it("badge supports aria-describedby for additional context", () => {
      render(
        <div>
          <Badge variant="accent-1" aria-describedby="badge-description">
            Premium
          </Badge>
          <span id="badge-description">This user has premium access</span>
        </div>,
      );

      const badge = screen.getByText("Premium");
      expect(badge).toHaveAttribute("aria-describedby", "badge-description");
    });
  });
});
