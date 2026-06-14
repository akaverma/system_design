import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders title and children", () => {
    render(<Alert title="Heads up">This is a message.</Alert>);
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("This is a message.")).toBeInTheDocument();
  });

  it("renders without a title", () => {
    render(<Alert>Just a description.</Alert>);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("Just a description.")).toBeInTheDocument();
  });

  it("renders without children", () => {
    render(<Alert title="Only a title" />);
    expect(screen.getByText("Only a title")).toBeInTheDocument();
  });

  it("uses role='status' for the default variant", () => {
    render(<Alert>Default</Alert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it.each([
    ["success", "border-success/50"],
    ["warning", "border-warning/50"],
    ["danger", "border-destructive/50"],
    ["info", "border-info/50"],
    ["default", "border-border"],
  ] as const)("applies styles for the %s variant", (variant, expectedClass) => {
    render(<Alert variant={variant}>Message</Alert>);
    const alert = variant === "danger" ? screen.getByRole("alert") : screen.getByRole("status");
    expect(alert.className).toContain(expectedClass);
  });

  it("uses role='alert' for the danger variant", () => {
    render(<Alert variant="danger">Danger</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("does not render an icon for the default variant even when showIcon is true", () => {
    render(<Alert variant="default">Default</Alert>);
    expect(screen.getByRole("status").querySelector("svg")).not.toBeInTheDocument();
  });

  it.each(["success", "warning", "danger", "info"] as const)(
    "renders a status icon for the %s variant by default",
    (variant) => {
      render(<Alert variant={variant}>Message</Alert>);
      const alert = variant === "danger" ? screen.getByRole("alert") : screen.getByRole("status");
      expect(alert.querySelector("svg")).toBeInTheDocument();
    },
  );

  it("hides the icon when showIcon is false", () => {
    render(
      <Alert variant="success" showIcon={false}>
        Message
      </Alert>,
    );
    expect(screen.getByRole("status").querySelector("svg")).not.toBeInTheDocument();
  });

  it("does not render a dismiss button when onDismiss is not provided", () => {
    render(<Alert>Message</Alert>);
    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
  });

  it("renders a dismiss button and calls onDismiss when clicked", async () => {
    const handleDismiss = jest.fn();
    render(<Alert onDismiss={handleDismiss}>Message</Alert>);

    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it("merges a custom className with default styles", () => {
    render(<Alert className="my-custom-class">Message</Alert>);
    expect(screen.getByRole("status").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying div element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Message</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props onto the root element", () => {
    render(<Alert data-testid="alert-root">Message</Alert>);
    expect(screen.getByTestId("alert-root")).toBeInTheDocument();
  });
});
