import { render } from "@testing-library/react";

import { CardGridSkeleton } from "./CardGrid.skeleton";

describe("CardGridSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <CardGridSkeleton>
        <div data-testid="skeleton-child">Skeleton card</div>
      </CardGridSkeleton>,
    );
    expect(container.querySelector(".card-grid")).toBeInTheDocument();
  });

  it("renders children", () => {
    const { getByTestId } = render(
      <CardGridSkeleton>
        <div data-testid="skeleton-1">Skeleton 1</div>
        <div data-testid="skeleton-2">Skeleton 2</div>
      </CardGridSkeleton>,
    );
    expect(getByTestId("skeleton-1")).toBeInTheDocument();
    expect(getByTestId("skeleton-2")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CardGridSkeleton className="custom-grid">
        <div>Child</div>
      </CardGridSkeleton>,
    );
    expect(container.querySelector(".card-grid")).toHaveClass("card-grid", "custom-grid");
  });

  it("accepts minColumnWidth prop", () => {
    const { container } = render(
      <CardGridSkeleton minColumnWidth="300px">
        <div>Child</div>
      </CardGridSkeleton>,
    );
    const grid = container.querySelector(".card-grid");
    expect(grid).toBeInTheDocument();
  });

  it("accepts gap prop", () => {
    const { container } = render(
      <CardGridSkeleton gap="2rem">
        <div>Child</div>
      </CardGridSkeleton>,
    );
    const grid = container.querySelector(".card-grid");
    expect(grid).toBeInTheDocument();
  });

  it("forwards HTML attributes", () => {
    const { container } = render(
      <CardGridSkeleton data-testid="grid-skeleton">
        <div>Child</div>
      </CardGridSkeleton>,
    );
    expect(container.querySelector("[data-testid='grid-skeleton']")).toBeInTheDocument();
  });

  it("uses CardGrid component internally", () => {
    const { container } = render(
      <CardGridSkeleton>
        <div>Child</div>
      </CardGridSkeleton>,
    );
    // Verify it has the card-grid class from CardGrid component
    expect(container.querySelector(".card-grid")).toBeInTheDocument();
  });
});
