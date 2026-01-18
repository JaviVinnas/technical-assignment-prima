import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input } from "./Input";

describe("Input", () => {
  describe("Rendering", () => {
    it("renders input without label", () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass("input");
    });

    it("renders input with label", () => {
      render(<Input label="Email Address" placeholder="Enter email" />);
      const label = screen.getByText("Email Address");
      const input = screen.getByLabelText(/email address/i);
      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(label).toHaveClass("label");
      expect(label).toHaveAttribute("for", input.id);
    });

    it("renders input with custom id", () => {
      render(<Input id="custom-input" label="Name" />);
      const label = screen.getByText("Name");
      const input = screen.getByLabelText("Name");
      expect(label).toHaveAttribute("for", "custom-input");
      expect(input).toHaveAttribute("id", "custom-input");
    });

    it("renders input with placeholder", () => {
      render(<Input placeholder="Search by name..." />);
      const input = screen.getByPlaceholderText("Search by name...");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("placeholder", "Search by name...");
    });

    it("applies additional className when provided", () => {
      render(<Input className="custom-class" placeholder="Test" />);
      const input = screen.getByPlaceholderText("Test");
      expect(input).toHaveClass("input", "custom-class");
    });

    it("renders input with different types", () => {
      const { rerender } = render(<Input type="text" placeholder="Text" />);
      expect(screen.getByPlaceholderText("Text")).toHaveAttribute("type", "text");

      rerender(<Input type="email" placeholder="Email" />);
      expect(screen.getByPlaceholderText("Email")).toHaveAttribute("type", "email");

      rerender(<Input type="password" placeholder="Password" />);
      expect(screen.getByPlaceholderText("Password")).toHaveAttribute("type", "password");
    });
  });

  describe("User Interactions", () => {
    it("allows user to type in input", async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText("Enter text") as HTMLInputElement;

      await user.type(input, "Hello World");

      expect(input.value).toBe("Hello World");
    });

    it("calls onChange when user types", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input placeholder="Enter text" onChange={handleChange} />);
      const input = screen.getByPlaceholderText("Enter text");

      await user.type(input, "test");

      expect(handleChange).toHaveBeenCalled();
    });

    it("handles focus and blur events", async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      render(<Input placeholder="Enter text" onFocus={handleFocus} onBlur={handleBlur} />);
      const input = screen.getByPlaceholderText("Enter text");

      await user.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("can be focused with keyboard", async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText("Enter text");

      await user.tab();
      expect(input).toHaveFocus();
    });

    it("handles controlled input value", () => {
      const { rerender } = render(<Input value="Initial" onChange={vi.fn()} />);
      const input = screen.getByDisplayValue("Initial") as HTMLInputElement;
      expect(input.value).toBe("Initial");

      rerender(<Input value="Updated" onChange={vi.fn()} />);
      expect(input.value).toBe("Updated");
    });

    it("handles uncontrolled input with defaultValue", () => {
      render(<Input defaultValue="Default" />);
      const input = screen.getByDisplayValue("Default") as HTMLInputElement;
      expect(input.value).toBe("Default");
    });
  });

  describe("Accessibility", () => {
    it("associates label with input using htmlFor", () => {
      render(<Input label="Email" placeholder="Enter email" />);
      const label = screen.getByText("Email");
      const input = screen.getByLabelText("Email");

      expect(label).toHaveAttribute("for", input.id);
      expect(input).toHaveAttribute("id");
      expect(input.id).toBeTruthy();
    });

    it("can be focused with keyboard", () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText("Enter text");
      input.focus();
      expect(input).toHaveFocus();
    });

    it("supports aria-label for screen readers", () => {
      render(<Input aria-label="Search input" placeholder="Search" />);
      const input = screen.getByRole("textbox", { name: /search input/i });
      expect(input).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <div>
          <Input aria-describedby="input-help" placeholder="Enter text" />
          <span id="input-help">This input is required</span>
        </div>,
      );
      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toHaveAttribute("aria-describedby", "input-help");
    });

    it("supports aria-required", () => {
      render(<Input aria-required="true" placeholder="Required field" />);
      const input = screen.getByPlaceholderText("Required field");
      expect(input).toHaveAttribute("aria-required", "true");
    });

    it("supports aria-invalid for error states", () => {
      render(<Input aria-invalid="true" placeholder="Invalid input" />);
      const input = screen.getByPlaceholderText("Invalid input");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("Input States", () => {
    it("renders enabled input by default", () => {
      render(<Input placeholder="Test" />);
      const input = screen.getByPlaceholderText("Test");
      expect(input).not.toBeDisabled();
    });

    it("renders disabled input when disabled prop is true", () => {
      render(<Input disabled placeholder="Disabled" />);
      const input = screen.getByPlaceholderText("Disabled");
      expect(input).toBeDisabled();
    });

    it("does not allow typing when disabled", async () => {
      const user = userEvent.setup();
      render(<Input disabled placeholder="Disabled" />);
      const input = screen.getByPlaceholderText("Disabled") as HTMLInputElement;

      await user.type(input, "test");

      expect(input.value).toBe("");
    });

    it("supports required attribute", () => {
      render(<Input required placeholder="Required" />);
      const input = screen.getByPlaceholderText("Required");
      expect(input).toBeRequired();
    });

    it("supports readOnly attribute", () => {
      render(<Input readOnly value="Read only" />);
      const input = screen.getByDisplayValue("Read only");
      expect(input).toHaveAttribute("readOnly");
    });
  });

  describe("Design Tokens", () => {
    it("applies input styles with correct CSS classes", () => {
      render(<Input placeholder="Test" />);
      const input = screen.getByPlaceholderText("Test");
      expect(input).toHaveClass("input");
    });

    it("renders label with correct CSS class when provided", () => {
      render(<Input label="Test Label" />);
      const label = screen.getByText("Test Label");
      expect(label).toHaveClass("label");
    });

    it("wraps input in wrapper div", () => {
      const { container } = render(<Input placeholder="Test" />);
      const wrapper = container.querySelector(".input-wrapper");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("HTML Attributes", () => {
    it("passes through additional HTML input attributes", () => {
      render(<Input data-testid="custom-input" title="Tooltip" placeholder="Test" />);
      const input = screen.getByPlaceholderText("Test");
      expect(input).toHaveAttribute("data-testid", "custom-input");
      expect(input).toHaveAttribute("title", "Tooltip");
    });

    it("supports name attribute for forms", () => {
      render(<Input name="username" placeholder="Username" />);
      const input = screen.getByPlaceholderText("Username");
      expect(input).toHaveAttribute("name", "username");
    });

    it("supports maxLength attribute", () => {
      render(<Input maxLength={10} placeholder="Limited" />);
      const input = screen.getByPlaceholderText("Limited");
      expect(input).toHaveAttribute("maxLength", "10");
    });

    it("supports minLength attribute", () => {
      render(<Input minLength={3} placeholder="Minimum" />);
      const input = screen.getByPlaceholderText("Minimum");
      expect(input).toHaveAttribute("minLength", "3");
    });

    it("supports pattern attribute", () => {
      render(<Input pattern="[0-9]*" placeholder="Numbers only" />);
      const input = screen.getByPlaceholderText("Numbers only");
      expect(input).toHaveAttribute("pattern", "[0-9]*");
    });

    it("supports autoComplete attribute", () => {
      render(<Input autoComplete="email" placeholder="Email" />);
      const input = screen.getByPlaceholderText("Email");
      expect(input).toHaveAttribute("autoComplete", "email");
    });

    it("supports autoFocus attribute", () => {
      render(<Input autoFocus placeholder="Auto focused" />);
      const input = screen.getByPlaceholderText("Auto focused");
      expect(input).toHaveFocus();
    });
  });

  describe("Form Integration", () => {
    it("works within a form element", () => {
      render(
        <form>
          <Input name="email" placeholder="Email" />
        </form>,
      );
      const input = screen.getByPlaceholderText("Email");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("name", "email");
    });

    it("supports form attribute", () => {
      render(
        <>
          <form id="my-form" />
          <Input form="my-form" name="field" placeholder="Field" />
        </>,
      );
      const input = screen.getByPlaceholderText("Field");
      expect(input).toHaveAttribute("form", "my-form");
    });
  });
});
