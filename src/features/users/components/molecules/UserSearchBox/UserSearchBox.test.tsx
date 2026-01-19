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
  describe("Controlled Value", () => {
    it("displays initial controlled value", () => {
      render(<UserSearchBox id="test-search" value="Initial query" onChange={vi.fn()} />);

      const input = screen.getByDisplayValue("Initial query");
      expect(input).toBeInTheDocument();
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

  describe("Search Submission Integration", () => {
    it("user pressing Enter triggers onChange with final value", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<UserSearchBox id="test-search" value="" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Emma{Enter}");

      expect(handleChange).toHaveBeenCalledWith("Emma");
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


  describe("Accessibility", () => {

    it("label has correct styling class", () => {
      render(<UserSearchBox id="test-search" value="" onChange={vi.fn()} />);

      const label = screen.getByText(/what are you looking for/i);
      expect(label).toHaveClass("label", "label--secondary", "user-search-box__label");
    });

    it("component renders as semantic section", () => {
      render(<UserSearchBox id="test-search" value="" onChange={vi.fn()} />);

      const section = screen.getByRole("region", { name: /user search/i });
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass("user-search-box");
    });
  });

});
