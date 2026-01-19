import { render, screen } from "@testing-library/react";
import { CardGrid } from "./CardGrid";

describe("CardGrid", () => {
  it("renders as semantic section element", () => {
    render(<CardGrid aria-label="My Grid">Children</CardGrid>);
    const section = screen.getByRole("region", { name: "My Grid" });
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("card-grid");
  });

  it("applies responsive layout CSS variables", () => {
    const { container } = render(
      <CardGrid minColumnWidth="200px" gap="20px">
        Children
      </CardGrid>,
    );

    const section = container.querySelector("section");
    expect(section).toHaveStyle({
      "--card-grid-min-column-width": "200px",
      "--card-grid-gap": "20px",
    });
  });

  it("renders children in the grid", () => {
    render(
      <CardGrid>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </CardGrid>,
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });

  it("forwards additional HTML attributes", () => {
    render(
      <CardGrid id="test-grid" aria-label="Grid container">
        Children
      </CardGrid>,
    );
    const section = screen.getByLabelText("Grid container");
    expect(section).toHaveAttribute("id", "test-grid");
  });
});
