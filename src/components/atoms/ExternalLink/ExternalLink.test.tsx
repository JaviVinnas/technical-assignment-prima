import { render, screen } from "@testing-library/react";

import { ExternalLink } from "./ExternalLink";

describe("ExternalLink", () => {
  describe("default variant", () => {
    it("renders a link with the provided href", () => {
      render(
        <ExternalLink href="https://example.com" variant="default">
          Visit example
        </ExternalLink>,
      );

      const link = screen.getByRole("link", { name: /visit example/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://example.com");
    });

    it("opens in a new tab by default", () => {
      render(
        <ExternalLink href="https://example.com" variant="default">
          Visit example
        </ExternalLink>,
      );

      const link = screen.getByRole("link", { name: /visit example/i });
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("includes security attributes", () => {
      render(
        <ExternalLink href="https://example.com" variant="default">
          Visit example
        </ExternalLink>,
      );

      const link = screen.getByRole("link", { name: /visit example/i });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("applies custom className", () => {
      render(
        <ExternalLink href="https://example.com" variant="default" className="custom-class">
          Visit example
        </ExternalLink>,
      );

      const link = screen.getByRole("link", { name: /visit example/i });
      expect(link).toHaveClass("external-link", "custom-class");
    });
  });

  describe("email variant", () => {
    it("renders a link with mailto: prefix", () => {
      render(
        <ExternalLink href="user@example.com" variant="email">
          user@example.com
        </ExternalLink>,
      );

      const link = screen.getByRole("link", { name: /user@example.com/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "mailto:user@example.com");
    });

    it("does not duplicate mailto: prefix if already included", () => {
      render(
        <ExternalLink href="user@example.com" variant="email">
          Contact us
        </ExternalLink>,
      );

      const link = screen.getByRole("link", { name: /contact us/i });
      expect(link).toHaveAttribute("href", "mailto:user@example.com");
    });

    it("renders children content", () => {
      render(
        <ExternalLink href="user@example.com" variant="email">
          Email us at user@example.com
        </ExternalLink>,
      );

      expect(screen.getByText("Email us at user@example.com")).toBeInTheDocument();
    });
  });

  describe("defaults", () => {
    it("uses default variant when not specified", () => {
      render(<ExternalLink href="https://example.com">Visit example</ExternalLink>);

      const link = screen.getByRole("link", { name: /visit example/i });
      expect(link).toHaveAttribute("href", "https://example.com");
    });
  });

  describe("accessibility", () => {
    it("supports custom target attribute", () => {
      render(
        <ExternalLink href="https://example.com" target="_self">
          Visit example
        </ExternalLink>,
      );

      const link = screen.getByRole("link", { name: /visit example/i });
      expect(link).toHaveAttribute("target", "_self");
    });

    it("supports custom rel attribute", () => {
      render(
        <ExternalLink href="https://example.com" rel="nofollow">
          Visit example
        </ExternalLink>,
      );

      const link = screen.getByRole("link", { name: /visit example/i });
      expect(link).toHaveAttribute("rel", "nofollow");
    });

    it("forwards additional HTML attributes", () => {
      render(
        <ExternalLink href="https://example.com" aria-label="External link to example">
          Visit
        </ExternalLink>,
      );

      const link = screen.getByRole("link", { name: /external link to example/i });
      expect(link).toBeInTheDocument();
    });
  });
});
