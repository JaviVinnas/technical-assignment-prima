import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  describe("Card.Root", () => {
    it("renders as semantic article element", () => {
      render(<Card.Root>Content</Card.Root>);
      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
      expect(article).toHaveClass("card");
    });

    it("applies custom className", () => {
      render(<Card.Root className="custom-card">Content</Card.Root>);
      expect(screen.getByRole("article")).toHaveClass("custom-card");
    });
  });

  describe("Card.Title and Subtitle", () => {
    it("renders Title as H3 heading", () => {
      render(<Card.Title>My Title</Card.Title>);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("My Title");
      expect(heading).toHaveClass("card__title");
    });

    it("renders Subtitle as paragraph", () => {
      render(<Card.Subtitle>My Subtitle</Card.Subtitle>);
      const subtitle = screen.getByText("My Subtitle");
      expect(subtitle.tagName).toBe("P");
      expect(subtitle).toHaveClass("card__subtitle");
    });
  });

  describe("Card.BadgeSlot", () => {
    it("renders badge slot container", () => {
      render(<Card.BadgeSlot>Badge</Card.BadgeSlot>);
      const slot = screen.getByText("Badge");
      expect(slot).toHaveClass("card__badge-slot");
    });
  });

  describe("Card.KeyValuePair", () => {
    it("renders full key-value pair", () => {
      render(
        <Card.KeyValuePair.Root>
          <Card.KeyValuePair.Key>Label:</Card.KeyValuePair.Key>
          <Card.KeyValuePair.Value>Value Content</Card.KeyValuePair.Value>
        </Card.KeyValuePair.Root>
      );

      expect(screen.getByText("Label:")).toHaveClass("card__key");
      expect(screen.getByText("Value Content")).toHaveClass("card__value");
    });

    it("renders email link variant", () => {
      render(
        <Card.KeyValuePair.Value type="email">
          test@example.com
        </Card.KeyValuePair.Value>
      );
      
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "mailto:test@example.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Card.Action", () => {
    it("renders action container", () => {
      render(<Card.Action>Action Button</Card.Action>);
      const action = screen.getByText("Action Button");
      expect(action).toHaveClass("card__action");
    });
  });
});
