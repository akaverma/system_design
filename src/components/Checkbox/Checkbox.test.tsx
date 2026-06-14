import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders a label associated with the checkbox", () => {
    render(<Checkbox label="Accept terms" />);
    const checkbox = screen.getByLabelText("Accept terms");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.tagName).toBe("INPUT");
    expect(checkbox).toHaveAttribute("type", "checkbox");
  });

  it("renders unchecked by default", () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByLabelText("Accept terms")).not.toBeChecked();
  });

  it("renders checked when defaultChecked is true", () => {
    render(<Checkbox label="Subscribe" defaultChecked />);
    expect(screen.getByLabelText("Subscribe")).toBeChecked();
  });

  it("toggles when clicked", async () => {
    render(<Checkbox label="Accept terms" />);
    const checkbox = screen.getByLabelText("Accept terms");

    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("sets the indeterminate DOM property when indeterminate is true", () => {
    render(<Checkbox label="Select all" indeterminate />);
    const checkbox = screen.getByLabelText("Select all") as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it("does not set the indeterminate DOM property by default", () => {
    render(<Checkbox label="Select all" />);
    const checkbox = screen.getByLabelText("Select all") as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(false);
  });

  it("updates the indeterminate DOM property when the prop changes", () => {
    const { rerender } = render(<Checkbox label="Select all" indeterminate />);
    const checkbox = screen.getByLabelText("Select all") as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);

    rerender(<Checkbox label="Select all" indeterminate={false} />);
    expect(checkbox.indeterminate).toBe(false);
  });

  it("renders helper text when there is no error", () => {
    render(<Checkbox label="Enable notifications" helperText="Visible to others" />);
    expect(screen.getByText("Visible to others")).toBeInTheDocument();
  });

  it("renders an error message with role=alert and marks the checkbox invalid", () => {
    render(<Checkbox label="Accept terms" error="You must accept the terms." />);

    const checkbox = screen.getByLabelText("Accept terms");
    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent("You must accept the terms.");
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveAttribute("aria-describedby", alert.id);
  });

  it("prefers the error message over helper text", () => {
    render(<Checkbox label="Accept terms" error="Invalid" helperText="Helper" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Invalid");
    expect(screen.queryByText("Helper")).not.toBeInTheDocument();
  });

  it("can be disabled", () => {
    render(<Checkbox label="Accept terms" disabled />);
    expect(screen.getByLabelText("Accept terms")).toBeDisabled();
  });

  it("can be disabled and checked", () => {
    render(<Checkbox label="Accept terms" disabled defaultChecked />);
    const checkbox = screen.getByLabelText("Accept terms");
    expect(checkbox).toBeDisabled();
    expect(checkbox).toBeChecked();
  });

  it("merges a custom className with default styles", () => {
    render(<Checkbox label="Accept terms" className="my-custom-class" />);
    expect(screen.getByLabelText("Accept terms").className).toContain("my-custom-class");
  });

  it("merges a custom containerClassName with default wrapper styles", () => {
    render(<Checkbox label="Accept terms" containerClassName="my-container-class" />);
    expect(screen.getByLabelText("Accept terms").closest(".my-container-class")).not.toBeNull();
  });

  it("forwards refs to the underlying input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox label="Accept terms" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards a callback ref and sets the indeterminate property", () => {
    let node: HTMLInputElement | null = null;
    render(
      <Checkbox
        label="Select all"
        indeterminate
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLInputElement);
    expect((node as unknown as HTMLInputElement).indeterminate).toBe(true);
  });

  it("uses a provided id instead of generating one", () => {
    render(<Checkbox label="Accept terms" id="custom-id" />);
    const checkbox = screen.getByLabelText("Accept terms");
    expect(checkbox).toHaveAttribute("id", "custom-id");
  });

  it("generates unique ids across multiple instances without a provided id", () => {
    render(
      <>
        <Checkbox label="First" />
        <Checkbox label="Second" />
      </>,
    );

    const first = screen.getByLabelText("First");
    const second = screen.getByLabelText("Second");

    expect(first.id).not.toBe(second.id);
  });

  it("renders without a label", () => {
    render(<Checkbox aria-label="No visible label" />);
    expect(screen.getByLabelText("No visible label")).toBeInTheDocument();
    expect(screen.queryByText("No visible label")).not.toBeInTheDocument();
  });
});
