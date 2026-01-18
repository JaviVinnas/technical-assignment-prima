import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("renders with default message when no message provided", () => {
    render(<ErrorState />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("renders with custom message", () => {
    render(<ErrorState message="Custom error message" />);
    expect(screen.getByText(/custom error message/i)).toBeInTheDocument();
  });

  it("renders retry button when onRetry provided", () => {
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} />);
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("does not render retry button when onRetry not provided", () => {
    render(<ErrorState />);
    expect(screen.queryByRole("button", { name: /try again/i })).not.toBeInTheDocument();
  });

  it("calls onRetry when retry button clicked", async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} />);

    const retryButton = screen.getByRole("button", { name: /try again/i });
    await user.click(retryButton);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("has correct ARIA attributes for accessibility", () => {
    render(<ErrorState message="Error occurred" />);
    const errorSection = screen.getByRole("alert");
    expect(errorSection).toHaveAttribute("aria-live", "assertive");
  });

  it("applies custom className", () => {
    const { container } = render(<ErrorState className="custom-error" />);
    expect(container.querySelector(".error-state")).toHaveClass("error-state", "custom-error");
  });

  it("forwards HTML attributes", () => {
    render(<ErrorState data-testid="error-state-test" />);
    expect(screen.getByTestId("error-state-test")).toBeInTheDocument();
  });
});
