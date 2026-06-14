import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";

const fruitOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", disabled: true },
];

describe("Select", () => {
  it("renders a label associated with the select", () => {
    render(<Select label="Fruit" options={fruitOptions} />);
    const select = screen.getByLabelText("Fruit");
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe("SELECT");
  });

  it("renders options from the options prop", () => {
    render(<Select label="Fruit" options={fruitOptions} />);
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Cherry" })).toBeInTheDocument();
  });

  it("disables individual options as specified", () => {
    render(<Select label="Fruit" options={fruitOptions} />);
    expect(screen.getByRole("option", { name: "Cherry" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "Apple" })).not.toBeDisabled();
  });

  it("renders children when options is not provided", () => {
    render(
      <Select label="Fruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
      </Select>,
    );

    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument();
  });

  it("renders a disabled, hidden placeholder option when provided", () => {
    const { container } = render(
      <Select label="Fruit" placeholder="Choose a fruit" options={fruitOptions} />,
    );

    const placeholderOption = container.querySelector('option[value=""]') as HTMLOptionElement;
    expect(placeholderOption).not.toBeNull();
    expect(placeholderOption).toBeDisabled();
    expect(placeholderOption).toHaveAttribute("hidden");
    expect(placeholderOption).toHaveTextContent("Choose a fruit");
  });

  it("does not render a placeholder option when not provided", () => {
    const { container } = render(<Select label="Fruit" options={fruitOptions} />);
    expect(container.querySelector('option[value=""]')).not.toBeInTheDocument();
  });

  it("allows selecting an option", async () => {
    render(<Select label="Fruit" options={fruitOptions} />);
    const select = screen.getByLabelText("Fruit") as HTMLSelectElement;

    await userEvent.selectOptions(select, "banana");

    expect(select.value).toBe("banana");
  });

  it("renders helper text when there is no error", () => {
    render(<Select label="Fruit" options={fruitOptions} helperText="Pick your favorite" />);
    expect(screen.getByText("Pick your favorite")).toBeInTheDocument();
  });

  it("renders an error message with role=alert and marks the select invalid", () => {
    render(<Select label="Fruit" options={fruitOptions} error="A fruit is required." />);

    const select = screen.getByLabelText("Fruit");
    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent("A fruit is required.");
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAttribute("aria-describedby", alert.id);
  });

  it("prefers the error message over helper text", () => {
    render(<Select label="Fruit" options={fruitOptions} error="Invalid" helperText="Helper" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Invalid");
    expect(screen.queryByText("Helper")).not.toBeInTheDocument();
  });

  it("renders neither error nor helper text when not provided", () => {
    render(<Select label="Fruit" options={fruitOptions} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("appends a custom aria-describedby id to the generated one", () => {
    render(
      <Select
        label="Fruit"
        options={fruitOptions}
        error="Invalid"
        aria-describedby="extra-description"
      />,
    );

    const select = screen.getByLabelText("Fruit");
    const describedBy = select.getAttribute("aria-describedby");

    expect(describedBy).toContain("extra-description");
    expect(describedBy).toContain(screen.getByRole("alert").id);
  });

  it("can be disabled", () => {
    render(<Select label="Fruit" options={fruitOptions} disabled />);
    expect(screen.getByLabelText("Fruit")).toBeDisabled();
  });

  it("merges a custom className with default styles", () => {
    render(<Select label="Fruit" options={fruitOptions} className="my-custom-class" />);
    expect(screen.getByLabelText("Fruit").className).toContain("my-custom-class");
  });

  it("applies error styling classes when an error is present", () => {
    render(<Select label="Fruit" options={fruitOptions} error="Invalid" />);
    expect(screen.getByLabelText("Fruit").className).toContain("border-destructive");
  });

  it("forwards refs to the underlying select element", () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(<Select label="Fruit" options={fruitOptions} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it("uses a provided id instead of generating one", () => {
    render(<Select label="Fruit" options={fruitOptions} id="custom-id" />);
    const select = screen.getByLabelText("Fruit");
    expect(select).toHaveAttribute("id", "custom-id");
  });

  it("generates unique ids across multiple instances without a provided id", () => {
    render(
      <>
        <Select label="First" options={fruitOptions} />
        <Select label="Second" options={fruitOptions} />
      </>,
    );

    const first = screen.getByLabelText("First");
    const second = screen.getByLabelText("Second");

    expect(first.id).not.toBe(second.id);
  });

  it("renders without a label", () => {
    render(<Select options={fruitOptions} data-testid="no-label-select" />);
    expect(screen.getByTestId("no-label-select")).toBeInTheDocument();
    expect(screen.queryByRole("label")).not.toBeInTheDocument();
  });

  it("renders a decorative chevron icon", () => {
    const { container } = render(<Select label="Fruit" options={fruitOptions} />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});
