import { render, screen } from "@testing-library/react";

import { BadgeSkeleton } from "./Badge.skeleton";

describe("BadgeSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<BadgeSkeleton />);
    expect(container.querySelector(".badge-skeleton")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<BadgeSkeleton className="custom-class" />);
    const skeleton = container.querySelector(".badge-skeleton");
    expect(skeleton).toHaveClass("badge-skeleton", "custom-class");
  });

  it("forwards HTML attributes", () => {
    render(<BadgeSkeleton data-testid="badge-skeleton-test" />);
    expect(screen.getByTestId("badge-skeleton-test")).toBeInTheDocument();
  });

  it("renders as span element", () => {
    const { container } = render(<BadgeSkeleton />);
    const skeleton = container.querySelector(".badge-skeleton");
    expect(skeleton?.tagName).toBe("SPAN");
  });
});
