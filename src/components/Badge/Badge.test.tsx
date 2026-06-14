import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders as a span element", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New").tagName).toBe("SPAN");
  });

  it("applies the default variant and size classes", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge.className).toContain("bg-muted");
    expect(badge.className).toContain("text-muted-foreground");
    expect(badge.className).toContain("h-6");
  });

  it.each([
    ["default", "bg-muted"],
    ["primary", "bg-primary"],
    ["secondary", "bg-secondary"],
    ["success", "bg-success"],
    ["warning", "bg-warning"],
    ["danger", "bg-destructive"],
    ["info", "bg-info"],
    ["outline", "border-border"],
  ] as const)("applies styles for the %s variant", (variant, expectedClass) => {
    render(<Badge variant={variant}>Badge</Badge>);
    expect(screen.getByText("Badge").className).toContain(expectedClass);
  });

  it.each([
    ["sm", "h-5"],
    ["md", "h-6"],
    ["lg", "h-7"],
  ] as const)("applies styles for the %s size", (size, expectedClass) => {
    render(<Badge size={size}>Badge</Badge>);
    expect(screen.getByText("Badge").className).toContain(expectedClass);
  });

  it("merges a custom className with default styles", () => {
    render(<Badge className="my-custom-class">Badge</Badge>);
    expect(screen.getByText("Badge").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying span element", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>Badge</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("supports additional aria attributes", () => {
    render(<Badge aria-label="Status: active">Active</Badge>);
    expect(screen.getByLabelText("Status: active")).toBeInTheDocument();
  });

  it("passes through arbitrary HTML attributes", () => {
    render(<Badge data-testid="my-badge">Badge</Badge>);
    expect(screen.getByTestId("my-badge")).toBeInTheDocument();
  });
});
