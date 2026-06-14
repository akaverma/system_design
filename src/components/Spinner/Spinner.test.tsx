import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders with role=status", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the default label for screen readers", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("renders a custom label for screen readers", () => {
    render(<Spinner label="Fetching results" />);
    expect(screen.getByText("Fetching results")).toBeInTheDocument();
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  });

  it("renders an aria-hidden icon", () => {
    render(<Spinner />);
    const svg = screen.getByRole("status").querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("applies the default size classes", () => {
    render(<Spinner />);
    const svg = screen.getByRole("status").querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("h-6");
    expect(svg?.getAttribute("class")).toContain("w-6");
  });

  it.each([
    ["sm", "h-4", "w-4"],
    ["md", "h-6", "w-6"],
    ["lg", "h-8", "w-8"],
    ["xl", "h-12", "w-12"],
  ] as const)("applies styles for the %s size", (size, heightClass, widthClass) => {
    render(<Spinner size={size} />);
    const svg = screen.getByRole("status").querySelector("svg");
    expect(svg?.getAttribute("class")).toContain(heightClass);
    expect(svg?.getAttribute("class")).toContain(widthClass);
  });

  it("applies the animate-spin class to the icon", () => {
    render(<Spinner />);
    const svg = screen.getByRole("status").querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("animate-spin");
  });

  it("merges a custom className with default styles", () => {
    render(<Spinner className="my-custom-class" />);
    expect(screen.getByRole("status").className).toContain("my-custom-class");
    expect(screen.getByRole("status").className).toContain("inline-flex");
  });

  it("forwards refs to the underlying div element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props onto the root element", () => {
    render(<Spinner data-testid="my-spinner" />);
    expect(screen.getByTestId("my-spinner")).toBeInTheDocument();
  });
});
