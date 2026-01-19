import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./Button";

/**
 * Test suite for Button component.
 *
 * Focuses on user interactions and accessibility.
 * Tests verify what users can do with buttons, not implementation details.
 */
describe("Button", () => {
  describe("Display", () => {
    it("user sees button with label", () => {
      render(<Button variant="big">Submit Form</Button>);

      const button = screen.getByRole("button", { name: /submit form/i });
      expect(button).toBeInTheDocument();
    });

    it("user sees button with complex content", () => {
      render(
        <Button variant="small">
          <span>Search</span>
        </Button>,
      );

      expect(screen.getByRole("button")).toHaveTextContent("Search");
    });
  });

  describe("User Interactions", () => {
    it("user can click button to trigger action", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button variant="big" onClick={handleClick}>
          Save Changes
        </Button>,
      );

      const button = screen.getByRole("button", { name: /save changes/i });
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("disabled button prevents user from clicking", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button variant="big" onClick={handleClick} disabled>
          Save Changes
        </Button>,
      );

      const button = screen.getByRole("button", { name: /save changes/i });
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("user can activate button with keyboard Enter key", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button variant="big" onClick={handleClick}>
          Submit
        </Button>,
      );

      const button = screen.getByRole("button", { name: /submit/i });
      button.focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("user can activate button with keyboard Space key", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button variant="small" onClick={handleClick}>
          Delete
        </Button>,
      );

      const button = screen.getByRole("button", { name: /delete/i });
      button.focus();
      await user.keyboard(" ");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Button States", () => {
    it("user sees enabled button by default", () => {
      render(<Button variant="big">Continue</Button>);

      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("user sees disabled button when action is not available", () => {
      render(
        <Button variant="big" disabled>
          Save Changes
        </Button>,
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("button type is set for form submission", () => {
      render(
        <Button variant="big" type="submit">
          Submit Form
        </Button>,
      );

      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("button type is button by default to prevent form submission", () => {
      render(<Button variant="big">Click me</Button>);

      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });
  });

  describe("Accessibility", () => {
    it("button has correct ARIA role for screen readers", () => {
      render(<Button variant="big">Action</Button>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("user can focus button with keyboard", () => {
      render(<Button variant="small">Focus me</Button>);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });

    it("disabled state is communicated to screen readers", () => {
      render(
        <Button variant="big" disabled>
          Disabled Action
        </Button>,
      );

      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("button supports aria-label for descriptive screen reader text", () => {
      render(
        <Button variant="small" aria-label="Search for products in the catalogue">
          Search
        </Button>,
      );

      expect(
        screen.getByRole("button", { name: /search for products in the catalogue/i }),
      ).toBeInTheDocument();
    });

    it("button supports aria-describedby for additional context", () => {
      render(
        <div>
          <Button variant="big" aria-describedby="button-help">
            Submit
          </Button>
          <span id="button-help">This will save your changes permanently</span>
        </div>,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-describedby", "button-help");
    });
  });
});
