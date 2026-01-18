import { render, screen } from "@testing-library/react";

import { CardSkeleton } from "./Card.skeleton";

describe("CardSkeleton", () => {
  describe("Root", () => {
    it("renders root component", () => {
      const { container } = render(
        <CardSkeleton.Root>
          <div>Test content</div>
        </CardSkeleton.Root>,
      );
      expect(container.querySelector(".card-skeleton")).toBeInTheDocument();
    });

    it("renders children", () => {
      render(
        <CardSkeleton.Root>
          <div data-testid="child">Child content</div>
        </CardSkeleton.Root>,
      );
      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <CardSkeleton.Root className="custom-class">
          <div>Content</div>
        </CardSkeleton.Root>,
      );
      expect(container.querySelector(".card-skeleton")).toHaveClass(
        "card-skeleton",
        "custom-class",
      );
    });
  });

  describe("BadgeSlot", () => {
    it("renders badge slot with badge skeleton", () => {
      const { container } = render(<CardSkeleton.BadgeSlot />);
      expect(container.querySelector(".card-skeleton__badge-slot")).toBeInTheDocument();
      expect(container.querySelector(".badge-skeleton")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<CardSkeleton.BadgeSlot className="custom-badge" />);
      expect(container.querySelector(".card-skeleton__badge-slot")).toHaveClass(
        "card-skeleton__badge-slot",
        "custom-badge",
      );
    });
  });

  describe("Title", () => {
    it("renders title skeleton", () => {
      const { container } = render(<CardSkeleton.Title />);
      expect(container.querySelector(".card-skeleton__title")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<CardSkeleton.Title className="custom-title" />);
      expect(container.querySelector(".card-skeleton__title")).toHaveClass(
        "card-skeleton__title",
        "custom-title",
      );
    });
  });

  describe("Subtitle", () => {
    it("renders subtitle skeleton", () => {
      const { container } = render(<CardSkeleton.Subtitle />);
      expect(container.querySelector(".card-skeleton__subtitle")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<CardSkeleton.Subtitle className="custom-subtitle" />);
      expect(container.querySelector(".card-skeleton__subtitle")).toHaveClass(
        "card-skeleton__subtitle",
        "custom-subtitle",
      );
    });
  });

  describe("KeyValuePair", () => {
    it("renders key-value pair container", () => {
      const { container } = render(
        <CardSkeleton.KeyValuePair.Root>
          <div>Content</div>
        </CardSkeleton.KeyValuePair.Root>,
      );
      expect(container.querySelector(".card-skeleton__key-value-pair")).toBeInTheDocument();
    });

    it("renders key skeleton", () => {
      const { container } = render(<CardSkeleton.KeyValuePair.Key />);
      expect(container.querySelector(".card-skeleton__key")).toBeInTheDocument();
    });

    it("renders value skeleton", () => {
      const { container } = render(<CardSkeleton.KeyValuePair.Value />);
      expect(container.querySelector(".card-skeleton__value")).toBeInTheDocument();
    });

    it("renders complete key-value pair structure", () => {
      const { container } = render(
        <CardSkeleton.KeyValuePair.Root>
          <CardSkeleton.KeyValuePair.Key />
          <CardSkeleton.KeyValuePair.Value />
        </CardSkeleton.KeyValuePair.Root>,
      );
      expect(container.querySelector(".card-skeleton__key-value-pair")).toBeInTheDocument();
      expect(container.querySelector(".card-skeleton__key")).toBeInTheDocument();
      expect(container.querySelector(".card-skeleton__value")).toBeInTheDocument();
    });
  });

  describe("Action", () => {
    it("renders action skeleton with button", () => {
      const { container } = render(<CardSkeleton.Action />);
      expect(container.querySelector(".card-skeleton__action")).toBeInTheDocument();
      expect(container.querySelector(".button-skeleton")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<CardSkeleton.Action className="custom-action" />);
      expect(container.querySelector(".card-skeleton__action")).toHaveClass(
        "card-skeleton__action",
        "custom-action",
      );
    });
  });

  describe("Complete Card Skeleton", () => {
    it("renders full card skeleton structure", () => {
      const { container } = render(
        <CardSkeleton.Root>
          <CardSkeleton.BadgeSlot />
          <CardSkeleton.Title />
          <CardSkeleton.Subtitle />
          <CardSkeleton.KeyValuePair.Root>
            <CardSkeleton.KeyValuePair.Key />
            <CardSkeleton.KeyValuePair.Value />
          </CardSkeleton.KeyValuePair.Root>
          <CardSkeleton.Action />
        </CardSkeleton.Root>,
      );

      expect(container.querySelector(".card-skeleton")).toBeInTheDocument();
      expect(container.querySelector(".card-skeleton__badge-slot")).toBeInTheDocument();
      expect(container.querySelector(".card-skeleton__title")).toBeInTheDocument();
      expect(container.querySelector(".card-skeleton__subtitle")).toBeInTheDocument();
      expect(container.querySelector(".card-skeleton__key-value-pair")).toBeInTheDocument();
      expect(container.querySelector(".card-skeleton__action")).toBeInTheDocument();
    });
  });
});
