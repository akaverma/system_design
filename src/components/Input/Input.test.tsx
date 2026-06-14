import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("renders a label associated with the input", () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  it("renders a placeholder", () => {
    render(<Input placeholder="you@example.com" />);
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
  });

  it("accepts user input", async () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText("Email");

    await userEvent.type(input, "hello@example.com");

    expect(input).toHaveValue("hello@example.com");
  });

  it("renders helper text when there is no error", () => {
    render(<Input label="Username" helperText="Visible to others" />);
    expect(screen.getByText("Visible to others")).toBeInTheDocument();
  });

  it("renders an error message with role=alert and marks the input invalid", () => {
    render(<Input label="Email" error="Please enter a valid email address." />);

    const input = screen.getByLabelText("Email");
    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent("Please enter a valid email address.");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", alert.id);
  });

  it("prefers the error message over helper text", () => {
    render(<Input label="Email" error="Invalid" helperText="Helper" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Invalid");
    expect(screen.queryByText("Helper")).not.toBeInTheDocument();
  });

  it("renders prefix and suffix adornments", () => {
    render(
      <Input
        label="Search"
        prefix={<span data-testid="prefix">P</span>}
        suffix={<span data-testid="suffix">S</span>}
      />,
    );

    expect(screen.getByTestId("prefix")).toBeInTheDocument();
    expect(screen.getByTestId("suffix")).toBeInTheDocument();
  });

  it("can be disabled", () => {
    render(<Input label="Email" disabled />);
    expect(screen.getByLabelText("Email")).toBeDisabled();
  });

  it("merges a custom className with default styles", () => {
    render(<Input label="Email" className="my-custom-class" />);
    expect(screen.getByLabelText("Email").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input label="Email" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("uses a provided id instead of generating one", () => {
    render(<Input label="Email" id="custom-id" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("id", "custom-id");
  });

  it("generates unique ids across multiple instances without a provided id", () => {
    render(
      <>
        <Input label="First" />
        <Input label="Second" />
      </>,
    );

    const first = screen.getByLabelText("First");
    const second = screen.getByLabelText("Second");

    expect(first.id).not.toBe(second.id);
  });
});
