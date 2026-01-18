import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./Button";

describe("Button", () => {
  describe("Rendering", () => {
    it("renders button with big variant", () => {
      render(<Button variant="big">Click me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("button", "button--big");
    });

    it("renders button with small variant", () => {
      render(<Button variant="small">Click me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("button", "button--small");
    });

    it("renders button with children content", () => {
      render(
        <Button variant="big">
          <span>Search</span>
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveTextContent("Search");
    });

    it("renders button with different text lengths", () => {
      const { rerender } = render(<Button variant="big">Short</Button>);
      expect(screen.getByRole("button")).toHaveTextContent("Short");

      rerender(<Button variant="big">This is a much longer button text that should adapt</Button>);
      expect(screen.getByRole("button")).toHaveTextContent(
        "This is a much longer button text that should adapt",
      );
    });

    it("applies additional className when provided", () => {
      render(
        <Button variant="big" className="custom-class">
          Button
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("button", "button--big", "custom-class");
    });
  });

  describe("User Interactions", () => {
    it("calls onClick when user clicks button", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button variant="big" onClick={handleClick}>
          Click me
        </Button>,
      );

      const button = screen.getByRole("button", { name: /click me/i });
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when button is disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button variant="big" onClick={handleClick} disabled>
          Click me
        </Button>,
      );

      const button = screen.getByRole("button", { name: /click me/i });
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("can be activated with keyboard", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button variant="big" onClick={handleClick}>
          Click me
        </Button>,
      );

      const button = screen.getByRole("button", { name: /click me/i });
      button.focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("has correct button role", () => {
      render(<Button variant="big">Button</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("can be focused with keyboard", () => {
      render(<Button variant="big">Button</Button>);
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });

    it("has disabled attribute when disabled", () => {
      render(
        <Button variant="big" disabled>
          Button
        </Button>,
      );
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("supports aria-label for screen readers", () => {
      render(
        <Button variant="big" aria-label="Search for products">
          Search
        </Button>,
      );
      expect(screen.getByRole("button", { name: /search for products/i })).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <div>
          <Button variant="big" aria-describedby="button-help">
            Submit
          </Button>
          <span id="button-help">This button submits the form</span>
        </div>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-describedby", "button-help");
    });
  });

  describe("Button States", () => {
    it("renders enabled button by default", () => {
      render(<Button variant="big">Button</Button>);
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("renders disabled button when disabled prop is true", () => {
      render(
        <Button variant="big" disabled>
          Button
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("has correct type attribute", () => {
      const { rerender } = render(
        <Button variant="big" type="button">
          Button
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");

      rerender(
        <Button variant="big" type="submit">
          Submit
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");

      rerender(
        <Button variant="big" type="reset">
          Reset
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
    });

    it("defaults to type='button' when type is not specified", () => {
      render(<Button variant="big">Button</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });
  });

  describe("Design Tokens", () => {
    it("applies big variant styles with correct CSS classes", () => {
      render(<Button variant="big">Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("button--big");
    });

    it("applies small variant styles with correct CSS classes", () => {
      render(<Button variant="small">Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("button--small");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through additional HTML button attributes", () => {
      render(
        <Button variant="big" data-testid="custom-button" title="Tooltip">
          Button
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-testid", "custom-button");
      expect(button).toHaveAttribute("title", "Tooltip");
    });

    it("supports form attributes", () => {
      render(
        <Button variant="big" form="my-form" formAction="/submit">
          Submit
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("form", "my-form");
      expect(button).toHaveAttribute("formAction", "/submit");
    });
  });
});
