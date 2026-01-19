import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UserSearchBox } from "./UserSearchBox";

/**
 * Test suite for UserSearchBox component.
 *
 * Focuses on user interactions with the search box and draft state management.
 * Tests verify what users see and experience when searching, including the
 * controlled component pattern and draft value synchronisation.
 */
describe("UserSearchBox", () => {
  describe("Display", () => {
    it("user sees search label", () => {
      render(<UserSearchBox id="test-search" value="" onChange={vi.fn()} />);

      expect(screen.getByText(/what are you looking for/i)).toBeInTheDocument();
    });

    it("user sees search input with default placeholder", () => {
      render(<UserSearchBox id="test-search" value="" onChange={vi.fn()} />);

      const input = screen.getByPlaceholderText(/search by name/i);
      expect(input).toBeInTheDocument();
    });

    it("user sees search input with custom placeholder", () => {
      render(
        <UserSearchBox
          id="test-search"
          value=""
          onChange={vi.fn()}
          placeholder="Find employees..."
        />,
      );

      const input = screen.getByPlaceholderText(/find employees/i);
      expect(input).toBeInTheDocument();
    });

    it("label is associated with input for accessibility", () => {
      render(<UserSearchBox id="test-search" value="" onChange={vi.fn()} />);

      const label = screen.getByText(/what are you looking for/i);
      const input = screen.getByRole("textbox", { name: /what are you looking for/i });

      expect(label).toHaveAttribute("for", "test-search");
      expect(input).toHaveAttribute("id", "test-search");
    });
  });

  describe("Controlled Value", () => {
    it("displays initial controlled value", () => {
      render(<UserSearchBox id="test-search" value="Initial query" onChange={vi.fn()} />);

      const input = screen.getByDisplayValue("Initial query");
      expect(input).toBeInTheDocument();
    });

    it("displays empty string when value is empty", () => {
      render(<UserSearchBox id="test-search" value="" onChange={vi.fn()} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("");
    });

    it("updates display when controlled value changes externally", () => {
      const { rerender } = render(
        <UserSearchBox id="test-search" value="First" onChange={vi.fn()} />,
      );

      expect(screen.getByDisplayValue("First")).toBeInTheDocument();

      rerender(<UserSearchBox id="test-search" value="Second" onChange={vi.fn()} />);

      expect(screen.getByDisplayValue("Second")).toBeInTheDocument();
    });
  });

  describe("Draft State Management", () => {
    it("user typing updates draft value immediately", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<UserSearchBox id="test-search" value="" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Test");

      expect(input).toHaveValue("Test");
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("user can type multiple characters in draft without triggering onChange", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<UserSearchBox id="test-search" value="" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "George Harris");

      expect(input).toHaveValue("George Harris");
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("draft state persists while user types", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<UserSearchBox id="test-search" value="" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Sar");
      expect(input).toHaveValue("Sar");

      await user.type(input, "ah");
      expect(input).toHaveValue("Sarah");
    });
  });

  describe("Search Submission", () => {
    it("user pressing Enter triggers onChange with final value", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<UserSearchBox id="test-search" value="" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Emma{Enter}");

      expect(handleChange).toHaveBeenCalledWith("Emma");
    });

    it("user clicking Search button triggers onChange with final value", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<UserSearchBox id="test-search" value="" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Marco");

      const searchButton = screen.getByRole("button", { name: /search/i });
      await user.click(searchButton);

      expect(handleChange).toHaveBeenCalledWith("Marco");
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("user submitting empty search triggers onChange with empty string", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<UserSearchBox id="test-search" value="" onChange={handleChange} />);

      const searchButton = screen.getByRole("button", { name: /search/i });
      await user.click(searchButton);

      expect(handleChange).toHaveBeenCalledWith("");
    });

    it("user can submit search multiple times", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<UserSearchBox id="test-search" value="" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      const searchButton = screen.getByRole("button", { name: /search/i });

      await user.type(input, "First");
      await user.click(searchButton);
      expect(handleChange).toHaveBeenCalledWith("First");

      handleChange.mockClear();
      await user.clear(input);
      await user.type(input, "Second{Enter}");
      expect(handleChange).toHaveBeenCalledWith("Second");
    });
  });

  describe("Draft Synchronisation with External Value Changes", () => {
    it("draft syncs when controlled value changes from outside", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { rerender } = render(
        <UserSearchBox id="test-search" value="" onChange={handleChange} />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "Local draft");
      expect(input).toHaveValue("Local draft");

      rerender(<UserSearchBox id="test-search" value="External update" onChange={handleChange} />);

      await waitFor(() => {
        expect(input).toHaveValue("External update");
      });
    });

    it("draft syncs when value changes after user submission", async () => {
      const user = userEvent.setup();
      let currentValue = "";
      const handleChange = vi.fn((newValue: string) => {
        currentValue = newValue;
      });

      const { rerender } = render(
        <UserSearchBox id="test-search" value={currentValue} onChange={handleChange} />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "Query");
      await user.keyboard("{Enter}");

      expect(handleChange).toHaveBeenCalledWith("Query");

      rerender(<UserSearchBox id="test-search" value="Query" onChange={handleChange} />);

      await waitFor(() => {
        expect(input).toHaveValue("Query");
      });
    });

    it("draft handles rapid external value changes", async () => {
      const { rerender } = render(
        <UserSearchBox id="test-search" value="First" onChange={vi.fn()} />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("First");

      rerender(<UserSearchBox id="test-search" value="Second" onChange={vi.fn()} />);
      await waitFor(() => expect(input).toHaveValue("Second"));

      rerender(<UserSearchBox id="test-search" value="Third" onChange={vi.fn()} />);
      await waitFor(() => expect(input).toHaveValue("Third"));
    });

    it("draft clears when external value becomes empty", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <UserSearchBox id="test-search" value="Initial" onChange={vi.fn()} />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("Initial");

      await user.type(input, " Extended");
      expect(input).toHaveValue("Initial Extended");

      rerender(<UserSearchBox id="test-search" value="" onChange={vi.fn()} />);

      await waitFor(() => {
        expect(input).toHaveValue("");
      });
    });
  });

  describe("Auto-Search on Clear", () => {
    it("user clearing input triggers onChange with empty string", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<UserSearchBox id="test-search" value="" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Test");

      handleChange.mockClear();

      await user.clear(input);

      expect(handleChange).toHaveBeenCalledWith("");
      expect(input).toHaveValue("");
    });

    it("user deleting all characters triggers onChange", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<UserSearchBox id="test-search" value="" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "A");

      handleChange.mockClear();

      await user.type(input, "{Backspace}");

      expect(handleChange).toHaveBeenCalledWith("");
      expect(input).toHaveValue("");
    });
  });

  describe("Accessibility", () => {
    it("keyboard users can navigate from label to input", async () => {
      const user = userEvent.setup();
      render(<UserSearchBox id="test-search" value="" onChange={vi.fn()} />);

      await user.tab();

      const input = screen.getByRole("textbox");
      expect(input).toHaveFocus();
    });

    it("keyboard users can navigate to search button", async () => {
      const user = userEvent.setup();
      render(<UserSearchBox id="test-search" value="" onChange={vi.fn()} />);

      await user.tab();
      await user.tab();

      const button = screen.getByRole("button", { name: /search/i });
      expect(button).toHaveFocus();
    });

    it("label has correct styling class", () => {
      render(<UserSearchBox id="test-search" value="" onChange={vi.fn()} />);

      const label = screen.getByText(/what are you looking for/i);
      expect(label).toHaveClass("label", "label--secondary", "user-search-box__label");
    });

    it("component renders as semantic section", () => {
      const { container } = render(<UserSearchBox id="test-search" value="" onChange={vi.fn()} />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass("user-search-box");
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className to container", () => {
      const { container } = render(
        <UserSearchBox
          id="test-search"
          value=""
          onChange={vi.fn()}
          className="custom-search-class"
        />,
      );

      const section = container.querySelector("section");
      expect(section).toHaveClass("user-search-box", "custom-search-class");
    });

    it("applies empty className gracefully", () => {
      const { container } = render(
        <UserSearchBox id="test-search" value="" onChange={vi.fn()} className="" />,
      );

      const section = container.querySelector("section");
      expect(section).toHaveClass("user-search-box");
    });
  });

  describe("Additional Props", () => {
    it("forwards additional input props to underlying SearchBox", () => {
      render(
        <UserSearchBox
          id="test-search"
          value=""
          onChange={vi.fn()}
          disabled
          data-testid="custom-search"
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute("data-testid", "custom-search");
    });

    it("supports maxLength attribute", () => {
      render(<UserSearchBox id="test-search" value="" onChange={vi.fn()} maxLength={50} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("maxLength", "50");
    });
  });
});
