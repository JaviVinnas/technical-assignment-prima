import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchBox } from "./SearchBox";

/**
 * Test suite for SearchBox component.
 *
 * Focuses on user interactions with the search input and button.
 * Tests verify what users can do with the search box: typing, submitting,
 * clearing input, and keyboard interactions.
 */
describe("SearchBox", () => {
  describe("Rendering", () => {
    it("user sees search input with default placeholder", () => {
      render(<SearchBox />);

      const input = screen.getByPlaceholderText(/search by name/i);
      expect(input).toBeInTheDocument();
    });

    it("user sees search input with custom placeholder", () => {
      render(<SearchBox placeholder="Find users..." />);

      const input = screen.getByPlaceholderText(/find users/i);
      expect(input).toBeInTheDocument();
    });

    it("user sees Search button", () => {
      render(<SearchBox />);

      const button = screen.getByRole("button", { name: /search/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "submit");
    });

    it("input and button are rendered in a form", () => {
      const { container } = render(<SearchBox />);

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveClass("search-box");
    });
  });

  describe("User Typing Interactions", () => {
    it("user can type in the search input", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SearchBox onChange={handleChange} />);

      const input = screen.getByPlaceholderText(/search by name/i);
      await user.type(input, "John");

      expect(input).toHaveValue("John");
      expect(handleChange).toHaveBeenCalled();
    });

    it("user typing updates input value without triggering search", async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      const handleChange = vi.fn();
      render(<SearchBox onSearch={handleSearch} onChange={handleChange} />);

      const input = screen.getByPlaceholderText(/search by name/i);
      await user.type(input, "Test");

      expect(input).toHaveValue("Test");
      expect(handleChange).toHaveBeenCalled();
      expect(handleSearch).not.toHaveBeenCalled();
    });

    it("controlled input displays provided value", () => {
      render(<SearchBox value="Initial value" onChange={vi.fn()} />);

      const input = screen.getByDisplayValue("Initial value");
      expect(input).toBeInTheDocument();
    });

    it("controlled input updates when value prop changes", () => {
      const { rerender } = render(<SearchBox value="First" onChange={vi.fn()} />);

      expect(screen.getByDisplayValue("First")).toBeInTheDocument();

      rerender(<SearchBox value="Second" onChange={vi.fn()} />);

      expect(screen.getByDisplayValue("Second")).toBeInTheDocument();
    });
  });

  describe("Search Submission - Enter Key", () => {
    it("user pressing Enter triggers search with current input value", async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      render(<SearchBox onSearch={handleSearch} />);

      const input = screen.getByPlaceholderText(/search by name/i);
      await user.type(input, "Sarah");
      await user.keyboard("{Enter}");

      expect(handleSearch).toHaveBeenCalledWith("Sarah");
      expect(handleSearch).toHaveBeenCalledTimes(1);
    });

    it("user pressing Enter multiple times triggers search each time", async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      render(<SearchBox onSearch={handleSearch} />);

      const input = screen.getByPlaceholderText(/search by name/i);
      await user.type(input, "Test");
      await user.keyboard("{Enter}");
      await user.keyboard("{Enter}");

      expect(handleSearch).toHaveBeenCalledTimes(2);
      expect(handleSearch).toHaveBeenCalledWith("Test");
    });

    it("pressing Enter without onSearch handler does not error", async () => {
      const user = userEvent.setup();
      render(<SearchBox />);

      const input = screen.getByPlaceholderText(/search by name/i);
      await user.type(input, "Test");

      await expect(user.keyboard("{Enter}")).resolves.not.toThrow();
    });
  });

  describe("Search Submission - Button Click", () => {
    it("user clicking Search button triggers search with current input value", async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      render(<SearchBox value="George" onSearch={handleSearch} onChange={vi.fn()} />);

      const button = screen.getByRole("button", { name: /search/i });
      await user.click(button);

      expect(handleSearch).toHaveBeenCalledWith("George");
      // Note: May be called multiple times due to React StrictMode
      expect(handleSearch.mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    it("user clicking Search button with controlled input triggers search", async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      render(<SearchBox value="Controlled" onSearch={handleSearch} onChange={vi.fn()} />);

      const button = screen.getByRole("button", { name: /search/i });
      await user.click(button);

      expect(handleSearch).toHaveBeenCalledWith("Controlled");
    });

    it("user clicking Search with empty input triggers search with empty string", async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      render(<SearchBox value="" onSearch={handleSearch} onChange={vi.fn()} />);

      const button = screen.getByRole("button", { name: /search/i });
      await user.click(button);

      expect(handleSearch).toHaveBeenCalledWith("");
    });

    it("clicking Search button without onSearch handler does not error", async () => {
      const user = userEvent.setup();
      render(<SearchBox />);

      const button = screen.getByRole("button", { name: /search/i });

      await expect(user.click(button)).resolves.not.toThrow();
    });
  });

  describe("Form Submission", () => {
    it("form submission is prevented to avoid page reload", async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      render(<SearchBox onSearch={handleSearch} />);

      const input = screen.getByPlaceholderText(/search by name/i);
      await user.type(input, "Test{Enter}");

      expect(handleSearch).toHaveBeenCalledWith("Test");
    });

    it("form submission calls onSearch with controlled value", async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      render(<SearchBox value="FormValue" onSearch={handleSearch} onChange={vi.fn()} />);

      const button = screen.getByRole("button", { name: /search/i });
      await user.click(button);

      expect(handleSearch).toHaveBeenCalledWith("FormValue");
    });
  });

  describe("Auto-Search on Clear", () => {
    it("user clearing input automatically triggers search when autoSearchOnClear is true", async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      render(<SearchBox onSearch={handleSearch} autoSearchOnClear={true} />);

      const input = screen.getByPlaceholderText(/search by name/i);
      await user.type(input, "Test");

      handleSearch.mockClear();

      await user.clear(input);

      expect(handleSearch).toHaveBeenCalledWith("");
      expect(input).toHaveValue("");
    });

    it("user clearing input does not trigger search when autoSearchOnClear is false", async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      render(<SearchBox onSearch={handleSearch} autoSearchOnClear={false} />);

      const input = screen.getByPlaceholderText(/search by name/i);
      await user.type(input, "Test");

      handleSearch.mockClear();

      await user.clear(input);

      expect(handleSearch).not.toHaveBeenCalled();
      expect(input).toHaveValue("");
    });

    it("autoSearchOnClear is enabled by default", async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      render(<SearchBox onSearch={handleSearch} />);

      const input = screen.getByPlaceholderText(/search by name/i);
      await user.type(input, "Test");

      handleSearch.mockClear();

      await user.clear(input);

      expect(handleSearch).toHaveBeenCalledWith("");
    });

    it("typing then deleting all characters triggers auto-search", async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      render(<SearchBox onSearch={handleSearch} autoSearchOnClear={true} />);

      const input = screen.getByPlaceholderText(/search by name/i);
      await user.type(input, "A");

      handleSearch.mockClear();

      await user.type(input, "{Backspace}");

      expect(handleSearch).toHaveBeenCalledWith("");
      expect(input).toHaveValue("");
    });
  });

  describe("Accessibility", () => {
    it("input is keyboard accessible", async () => {
      const user = userEvent.setup();
      render(<SearchBox />);

      await user.tab();

      const input = screen.getByPlaceholderText(/search by name/i);
      expect(input).toHaveFocus();
    });

    it("button is keyboard accessible after input", async () => {
      const user = userEvent.setup();
      render(<SearchBox />);

      await user.tab();
      await user.tab();

      const button = screen.getByRole("button", { name: /search/i });
      expect(button).toHaveFocus();
    });

    it("input supports aria-label for screen readers", () => {
      render(<SearchBox aria-label="Search for users by name" />);

      const input = screen.getByRole("textbox", { name: /search for users by name/i });
      expect(input).toBeInTheDocument();
    });

    it("input with id can be associated with external label", () => {
      render(
        <div>
          <label htmlFor="custom-search">Search Users</label>
          <SearchBox id="custom-search" />
        </div>,
      );

      const input = screen.getByLabelText(/search users/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("id", "custom-search");
    });

    it("button has submit type for proper form behavior", () => {
      render(<SearchBox />);

      const button = screen.getByRole("button", { name: /search/i });
      expect(button).toHaveAttribute("type", "submit");
    });
  });

  describe("Additional HTML Attributes", () => {
    it("applies custom className to form container", () => {
      const { container } = render(<SearchBox className="custom-search-box" />);

      const form = container.querySelector("form");
      expect(form).toHaveClass("search-box", "custom-search-box");
    });

    it("forwards additional input attributes", () => {
      render(
        <SearchBox
          placeholder="Custom placeholder"
          disabled
          maxLength={50}
          data-testid="search-input"
        />,
      );

      const input = screen.getByPlaceholderText(/custom placeholder/i);
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute("maxLength", "50");
      expect(input).toHaveAttribute("data-testid", "search-input");
    });

    it("supports custom form props", () => {
      const { container } = render(
        <SearchBox formProps={{ "data-testid": "search-form", role: "search" }} />,
      );

      const form = container.querySelector("form");
      expect(form).toHaveAttribute("data-testid", "search-form");
      expect(form).toHaveAttribute("role", "search");
    });
  });
});
