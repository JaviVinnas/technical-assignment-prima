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
  describe("Display and Content", () => {
    it("user sees filter label", () => {
      render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      expect(screen.getByText(/filter by:/i)).toBeInTheDocument();
    });

    it("user sees all permission options in expected order", () => {
      render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(6);
      expect(buttons[0]).toHaveTextContent(/admin/i);
      expect(buttons[1]).toHaveTextContent(/editor/i);
      expect(buttons[2]).toHaveTextContent(/viewer/i);
      expect(buttons[3]).toHaveTextContent(/guest/i);
      expect(buttons[4]).toHaveTextContent(/owner/i);
      expect(buttons[5]).toHaveTextContent(/inactive/i);
    });
  });

  describe("Permission Badge Integration", () => {
    it("user sees selected state for permissions", () => {
      render(<UserFiltersRow selectedPermissions={["admin"]} onToggle={vi.fn()} />);

      expect(screen.getByRole("button", { name: /admin/i, pressed: true })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /editor/i, pressed: false })).toBeInTheDocument();
    });
  });

  describe("Interaction Integration", () => {
    it("user clicking Admin badge triggers onToggle with admin", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(<UserFiltersRow selectedPermissions={[]} onToggle={handleToggle} />);

      const adminBadge = screen.getByRole("button", { name: /admin/i });
      await user.click(adminBadge);

      expect(handleToggle).toHaveBeenCalledWith("admin");
    });
  });

  it("renders with correct accessibility attributes", () => {
    render(<UserFiltersRow selectedPermissions={[]} onToggle={vi.fn()} />);

    const nav = screen.getByRole("navigation", { name: /user filters/i });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass("filters-row");
  });
});
