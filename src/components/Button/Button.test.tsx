import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies the default variant and size classes", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-primary");
    expect(button.className).toContain("h-10");
  });

  it.each([
    ["primary", "bg-primary"],
    ["secondary", "bg-secondary"],
    ["ghost", "hover:bg-accent"],
    ["danger", "bg-destructive"],
    ["link", "underline-offset-4"],
  ] as const)("applies styles for the %s variant", (variant, expectedClass) => {
    render(<Button variant={variant}>Button</Button>);
    expect(screen.getByRole("button").className).toContain(expectedClass);
  });

  it.each([
    ["sm", "h-8"],
    ["md", "h-10"],
    ["lg", "h-12"],
  ] as const)("applies styles for the %s size", (size, expectedClass) => {
    render(<Button size={size}>Button</Button>);
    expect(screen.getByRole("button").className).toContain(expectedClass);
  });

  it("calls onClick when clicked", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>,
    );

    await userEvent.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows a spinner and disables the button when isLoading is true", () => {
    render(<Button isLoading>Saving</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("does not render icons while loading", () => {
    render(
      <Button isLoading iconLeft={<span data-testid="icon-left">L</span>}>
        Saving
      </Button>,
    );

    expect(screen.queryByTestId("icon-left")).not.toBeInTheDocument();
  });

  it("renders iconLeft and iconRight", () => {
    render(
      <Button
        iconLeft={<span data-testid="icon-left">L</span>}
        iconRight={<span data-testid="icon-right">R</span>}
      >
        Button
      </Button>,
    );

    expect(screen.getByTestId("icon-left")).toBeInTheDocument();
    expect(screen.getByTestId("icon-right")).toBeInTheDocument();
  });

  it("merges a custom className with default styles", () => {
    render(<Button className="my-custom-class">Button</Button>);
    expect(screen.getByRole("button").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("defaults to type='button' so it does not submit forms", () => {
    render(<Button>Button</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("supports overriding the type attribute", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("is focusable via keyboard and activatable with Enter", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button");
    button.focus();
    expect(button).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
