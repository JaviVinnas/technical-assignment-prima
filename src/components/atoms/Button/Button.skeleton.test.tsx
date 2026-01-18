import { render, screen } from "@testing-library/react";

import { ButtonSkeleton } from "./Button.skeleton";

describe("ButtonSkeleton", () => {
  it("renders without crashing with big variant", () => {
    const { container } = render(<ButtonSkeleton variant="big" />);
    expect(container.querySelector(".button-skeleton")).toBeInTheDocument();
  });

  it("renders without crashing with small variant", () => {
    const { container } = render(<ButtonSkeleton variant="small" />);
    expect(container.querySelector(".button-skeleton")).toBeInTheDocument();
  });

  it("applies correct variant class for big", () => {
    const { container } = render(<ButtonSkeleton variant="big" />);
    const skeleton = container.querySelector(".button-skeleton");
    expect(skeleton).toHaveClass("button-skeleton", "button-skeleton--big");
  });

  it("applies correct variant class for small", () => {
    const { container } = render(<ButtonSkeleton variant="small" />);
    const skeleton = container.querySelector(".button-skeleton");
    expect(skeleton).toHaveClass("button-skeleton", "button-skeleton--small");
  });

  it("applies custom className", () => {
    const { container } = render(<ButtonSkeleton variant="big" className="custom-class" />);
    const skeleton = container.querySelector(".button-skeleton");
    expect(skeleton).toHaveClass("button-skeleton", "button-skeleton--big", "custom-class");
  });

  it("forwards HTML attributes", () => {
    render(<ButtonSkeleton variant="small" data-testid="button-skeleton-test" />);
    expect(screen.getByTestId("button-skeleton-test")).toBeInTheDocument();
  });

  it("renders as span element", () => {
    const { container } = render(<ButtonSkeleton variant="big" />);
    const skeleton = container.querySelector(".button-skeleton");
    expect(skeleton?.tagName).toBe("SPAN");
  });
});
