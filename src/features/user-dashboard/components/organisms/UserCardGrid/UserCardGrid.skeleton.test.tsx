import { render } from "@testing-library/react";

import { UserCardGridSkeleton } from "./UserCardGrid.skeleton";

describe("UserCardGridSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<UserCardGridSkeleton />);
    expect(container.querySelector(".user-card-grid")).toBeInTheDocument();
  });

  it("renders default count of 6 skeleton cards", () => {
    const { container } = render(<UserCardGridSkeleton />);
    const skeletonCards = container.querySelectorAll(".card-skeleton");
    expect(skeletonCards).toHaveLength(6);
  });

  it("renders custom count of skeleton cards", () => {
    const { container } = render(<UserCardGridSkeleton count={3} />);
    const skeletonCards = container.querySelectorAll(".card-skeleton");
    expect(skeletonCards).toHaveLength(3);
  });

  it("renders 10 skeleton cards when specified", () => {
    const { container } = render(<UserCardGridSkeleton count={10} />);
    const skeletonCards = container.querySelectorAll(".card-skeleton");
    expect(skeletonCards).toHaveLength(10);
  });

  it("applies custom className", () => {
    const { container } = render(<UserCardGridSkeleton className="custom-grid" />);
    expect(container.querySelector(".user-card-grid")).toHaveClass("user-card-grid", "custom-grid");
  });

  it("renders within section element", () => {
    const { container } = render(<UserCardGridSkeleton />);
    const section = container.querySelector("section.user-card-grid");
    expect(section).toBeInTheDocument();
  });

  it("uses CardGridSkeleton internally", () => {
    const { container } = render(<UserCardGridSkeleton />);
    expect(container.querySelector(".card-grid")).toBeInTheDocument();
  });

  it("renders UserCardSkeleton for each count", () => {
    const { container } = render(<UserCardGridSkeleton count={4} />);

    // Each UserCardSkeleton should have these elements
    const badges = container.querySelectorAll(".badge-skeleton");
    const titles = container.querySelectorAll(".card-skeleton__title");
    const subtitles = container.querySelectorAll(".card-skeleton__subtitle");

    expect(badges).toHaveLength(4);
    expect(titles).toHaveLength(4);
    expect(subtitles).toHaveLength(4);
  });

  it("handles zero count gracefully", () => {
    const { container } = render(<UserCardGridSkeleton count={0} />);
    const skeletonCards = container.querySelectorAll(".card-skeleton");
    expect(skeletonCards).toHaveLength(0);
  });
});
