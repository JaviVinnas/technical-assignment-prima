import { render, screen } from "@testing-library/react";

import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders with message", () => {
    render(<EmptyState message="No items found" />);
    expect(screen.getByText(/no items found/i)).toBeInTheDocument();
  });

  it("has correct ARIA attributes for accessibility", () => {
    render(<EmptyState message="Empty state" />);
    const section = screen.getByRole("status");
    expect(section).toHaveAttribute("aria-live", "polite");
  });

  it("applies custom className", () => {
    const { container } = render(<EmptyState message="Test" className="custom-empty" />);
    expect(container.querySelector(".empty-state")).toHaveClass("empty-state", "custom-empty");
  });

  it("forwards HTML attributes", () => {
    render(<EmptyState message="Test" data-testid="empty-state-test" />);
    expect(screen.getByTestId("empty-state-test")).toBeInTheDocument();
  });

  it("displays different messages correctly", () => {
    const { rerender } = render(<EmptyState message="No results" />);
    expect(screen.getByText(/no results/i)).toBeInTheDocument();

    rerender(<EmptyState message="Nothing to show" />);
    expect(screen.getByText(/nothing to show/i)).toBeInTheDocument();
  });
});
