import { render } from "@testing-library/react";

import { UserCardSkeleton } from "./UserCard.skeleton";

describe("UserCardSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<UserCardSkeleton />);
    expect(container.querySelector(".card-skeleton")).toBeInTheDocument();
  });

  it("renders badge slot skeleton", () => {
    const { container } = render(<UserCardSkeleton />);
    expect(container.querySelector(".card-skeleton__badge-slot")).toBeInTheDocument();
    expect(container.querySelector(".badge-skeleton")).toBeInTheDocument();
  });

  it("renders title skeleton", () => {
    const { container } = render(<UserCardSkeleton />);
    expect(container.querySelector(".card-skeleton__title")).toBeInTheDocument();
  });

  it("renders subtitle skeleton", () => {
    const { container } = render(<UserCardSkeleton />);
    expect(container.querySelector(".card-skeleton__subtitle")).toBeInTheDocument();
  });

  it("renders two key-value pair skeletons", () => {
    const { container } = render(<UserCardSkeleton />);
    const keyValuePairs = container.querySelectorAll(".card-skeleton__key-value-pair");
    expect(keyValuePairs).toHaveLength(2);
  });

  it("renders action skeleton with button", () => {
    const { container } = render(<UserCardSkeleton />);
    expect(container.querySelector(".card-skeleton__action")).toBeInTheDocument();
    expect(container.querySelector(".button-skeleton")).toBeInTheDocument();
  });

  it("matches UserCard structure", () => {
    const { container } = render(<UserCardSkeleton />);

    // Verify all parts that match UserCard structure
    expect(container.querySelector(".card-skeleton")).toBeInTheDocument();
    expect(container.querySelector(".card-skeleton__badge-slot")).toBeInTheDocument();
    expect(container.querySelector(".card-skeleton__title")).toBeInTheDocument();
    expect(container.querySelector(".card-skeleton__subtitle")).toBeInTheDocument();

    // Two key-value pairs (Team and Contact Info in UserCard)
    const keyValuePairs = container.querySelectorAll(".card-skeleton__key-value-pair");
    expect(keyValuePairs).toHaveLength(2);

    expect(container.querySelector(".card-skeleton__action")).toBeInTheDocument();
  });
});
