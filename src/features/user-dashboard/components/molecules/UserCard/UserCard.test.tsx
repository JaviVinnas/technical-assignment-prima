import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { User } from "../../../types";
import { UserCard } from "./UserCard";

/**
 * Test suite for UserCard component.
 *
 * Focuses on user-facing behaviours and interactions from the user's perspective.
 * Tests verify what users see and do with user cards, not implementation details.
 */
describe("UserCard", () => {
  const mockUser: User = {
    name: "Sarah Johnson",
    role: "Senior Software Engineer",
    permission: "admin",
    team: "Engineering",
    contactInfo: "sarah.johnson@company.com",
  };

  describe("User Information Display", () => {
    it("user sees employee name displayed as heading", () => {
      render(<UserCard user={mockUser} />);

      const nameHeading = screen.getByRole("heading", { name: /sarah johnson/i });
      expect(nameHeading).toBeInTheDocument();
    });

    it("user sees employee role displayed", () => {
      render(<UserCard user={mockUser} />);

      expect(screen.getByText(/senior software engineer/i)).toBeInTheDocument();
    });

    it("user sees employee team information", () => {
      render(<UserCard user={mockUser} />);

      expect(screen.getByText(/team:/i)).toBeInTheDocument();
      expect(screen.getByText(/engineering/i)).toBeInTheDocument();
    });

    it("user sees employee contact information label", () => {
      render(<UserCard user={mockUser} />);

      expect(screen.getByText(/contact information:/i)).toBeInTheDocument();
    });

    it("user sees complete employee information in one card", () => {
      render(<UserCard user={mockUser} />);

      expect(screen.getByRole("heading", { name: /sarah johnson/i })).toBeInTheDocument();
      expect(screen.getByText(/senior software engineer/i)).toBeInTheDocument();
      expect(screen.getByText(/engineering/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /sarah.johnson@company.com/i })).toBeInTheDocument();
    });
  });

  describe("Permission Badge", () => {
    it("user identifies admin permission by seeing ADMIN badge", () => {
      const adminUser: User = { ...mockUser, permission: "admin" };
      render(<UserCard user={adminUser} />);

      expect(screen.getByText(/admin/i)).toBeInTheDocument();
    });

    it("user identifies editor permission by seeing EDITOR badge", () => {
      const editorUser: User = { ...mockUser, permission: "editor" };
      render(<UserCard user={editorUser} />);

      expect(screen.getByText(/editor/i)).toBeInTheDocument();
    });

    it("user identifies viewer permission by seeing VIEWER badge", () => {
      const viewerUser: User = { ...mockUser, permission: "viewer" };
      render(<UserCard user={viewerUser} />);

      expect(screen.getByText(/viewer/i)).toBeInTheDocument();
    });

    it("user identifies guest permission by seeing GUEST badge", () => {
      const guestUser: User = { ...mockUser, permission: "guest" };
      render(<UserCard user={guestUser} />);

      expect(screen.getByText(/guest/i)).toBeInTheDocument();
    });
  });

  describe("Email Contact Link", () => {
    it("user can click email address to open mail client", () => {
      render(<UserCard user={mockUser} />);

      const emailLink = screen.getByRole("link", { name: /sarah.johnson@company.com/i });
      expect(emailLink).toHaveAttribute("href", "mailto:sarah.johnson@company.com");
    });

    it("email link opens in new tab for user", () => {
      render(<UserCard user={mockUser} />);

      const emailLink = screen.getByRole("link", { name: /sarah.johnson@company.com/i });
      expect(emailLink).toHaveAttribute("target", "_blank");
    });

    it("email link has security attributes for user protection", () => {
      render(<UserCard user={mockUser} />);

      const emailLink = screen.getByRole("link", { name: /sarah.johnson@company.com/i });
      expect(emailLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("View Details Button", () => {
    it("user can click View details button", async () => {
      const user = userEvent.setup();
      const handleViewDetails = vi.fn();
      render(<UserCard user={mockUser} onViewDetails={handleViewDetails} />);

      const viewDetailsButton = screen.getByRole("button", { name: /view details/i });
      await user.click(viewDetailsButton);

      expect(handleViewDetails).toHaveBeenCalledTimes(1);
    });

    it("user sees View details button on every card", () => {
      render(<UserCard user={mockUser} />);

      const viewDetailsButton = screen.getByRole("button", { name: /view details/i });
      expect(viewDetailsButton).toBeInTheDocument();
      expect(viewDetailsButton).toBeEnabled();
    });

    it("user can activate View details button with keyboard", async () => {
      const user = userEvent.setup();
      const handleViewDetails = vi.fn();
      render(<UserCard user={mockUser} onViewDetails={handleViewDetails} />);

      const viewDetailsButton = screen.getByRole("button", { name: /view details/i });
      viewDetailsButton.focus();
      await user.keyboard("{Enter}");

      expect(handleViewDetails).toHaveBeenCalledTimes(1);
    });

    it("View details button works without onViewDetails handler", () => {
      render(<UserCard user={mockUser} />);

      const viewDetailsButton = screen.getByRole("button", { name: /view details/i });
      expect(viewDetailsButton).toBeInTheDocument();
      expect(viewDetailsButton).toBeEnabled();
    });
  });

  describe("Different User Profiles", () => {
    it("user sees different employee information for different users", () => {
      const user1: User = {
        name: "John Doe",
        role: "Backend Developer",
        permission: "editor",
        team: "Engineering",
        contactInfo: "john.doe@company.com",
      };

      const { rerender } = render(<UserCard user={user1} />);
      expect(screen.getByRole("heading", { name: /john doe/i })).toBeInTheDocument();
      expect(screen.getByText(/backend developer/i)).toBeInTheDocument();
      expect(screen.getByText(/engineering/i)).toBeInTheDocument();

      const user2: User = {
        name: "Jane Smith",
        role: "UX Designer",
        permission: "viewer",
        team: "Marketing",
        contactInfo: "jane.smith@company.com",
      };

      rerender(<UserCard user={user2} />);
      expect(screen.getByRole("heading", { name: /jane smith/i })).toBeInTheDocument();
      expect(screen.getByText(/ux designer/i)).toBeInTheDocument();
      expect(screen.getByText(/marketing/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("card is rendered as article for screen reader users", () => {
      const { container } = render(<UserCard user={mockUser} />);

      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();
    });

    it("employee name is marked as heading for screen reader navigation", () => {
      render(<UserCard user={mockUser} />);

      const heading = screen.getByRole("heading", { name: /sarah johnson/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H3");
    });

    it("View details button is keyboard accessible", () => {
      render(<UserCard user={mockUser} />);

      const button = screen.getByRole("button", { name: /view details/i });
      button.focus();
      expect(button).toHaveFocus();
    });

    it("email link is keyboard accessible", () => {
      render(<UserCard user={mockUser} />);

      const emailLink = screen.getByRole("link", { name: /sarah.johnson@company.com/i });
      emailLink.focus();
      expect(emailLink).toHaveFocus();
    });
  });
});
