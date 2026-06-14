import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("renders as a switch", () => {
    render(<Toggle aria-label="Toggle" />);
    expect(screen.getByRole("switch", { name: "Toggle" })).toBeInTheDocument();
  });

  it("renders a button with type='button'", () => {
    render(<Toggle aria-label="Toggle" />);
    expect(screen.getByRole("switch")).toHaveAttribute("type", "button");
  });

  it("is unchecked by default", () => {
    render(<Toggle aria-label="Toggle" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("supports defaultChecked for uncontrolled usage", () => {
    render(<Toggle aria-label="Toggle" defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("applies bg-input when unchecked and bg-primary when checked", () => {
    render(<Toggle aria-label="Toggle" />);
    expect(screen.getByRole("switch").className).toContain("bg-input");

    render(<Toggle aria-label="Toggle 2" defaultChecked />);
    expect(screen.getByRole("switch", { name: "Toggle 2" }).className).toContain("bg-primary");
  });

  it.each([
    ["sm", "h-4 w-7"],
    ["md", "h-5 w-9"],
    ["lg", "h-6 w-11"],
  ] as const)("applies track styles for the %s size", (size, expectedClasses) => {
    render(<Toggle aria-label="Toggle" size={size} />);
    const classes = screen.getByRole("switch").className;
    expectedClasses.split(" ").forEach((cls) => expect(classes).toContain(cls));
  });

  it("defaults to the md size", () => {
    render(<Toggle aria-label="Toggle" />);
    const classes = screen.getByRole("switch").className;
    expect(classes).toContain("h-5");
    expect(classes).toContain("w-9");
  });

  it.each([
    ["sm", "translate-x-3"],
    ["md", "translate-x-4"],
    ["lg", "translate-x-5"],
  ] as const)("applies thumb translate classes for the %s size when checked", (size, translate) => {
    render(<Toggle aria-label="Toggle" size={size} defaultChecked />);
    const thumb = screen.getByRole("switch").querySelector("span");
    expect(thumb?.className).toContain(translate);
  });

  it("applies translate-x-0 to the thumb when unchecked", () => {
    render(<Toggle aria-label="Toggle" />);
    const thumb = screen.getByRole("switch").querySelector("span");
    expect(thumb?.className).toContain("translate-x-0");
  });

  it("toggles state on click in uncontrolled mode", async () => {
    render(<Toggle aria-label="Toggle" />);
    const toggle = screen.getByRole("switch");

    expect(toggle).toHaveAttribute("aria-checked", "false");

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("calls onCheckedChange with the new value on click", async () => {
    const handleChange = jest.fn();
    render(<Toggle aria-label="Toggle" onCheckedChange={handleChange} />);

    await userEvent.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalledWith(true);

    await userEvent.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it("respects the checked prop in controlled mode and does not change internally", async () => {
    const handleChange = jest.fn();
    render(<Toggle aria-label="Toggle" checked={false} onCheckedChange={handleChange} />);
    const toggle = screen.getByRole("switch");

    await userEvent.click(toggle);

    expect(handleChange).toHaveBeenCalledWith(true);
    // Still false because the controlled `checked` prop hasn't changed.
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("updates in controlled mode when checked prop changes", () => {
    const { rerender } = render(<Toggle aria-label="Toggle" checked={false} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");

    rerender(<Toggle aria-label="Toggle" checked={true} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("does not toggle or call onCheckedChange when disabled", async () => {
    const handleChange = jest.fn();
    render(<Toggle aria-label="Toggle" disabled onCheckedChange={handleChange} />);
    const toggle = screen.getByRole("switch");

    await userEvent.click(toggle);

    expect(handleChange).not.toHaveBeenCalled();
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(toggle).toBeDisabled();
  });

  it("calls a custom onClick handler in addition to internal toggle logic", async () => {
    const handleClick = jest.fn();
    render(<Toggle aria-label="Toggle" onClick={handleClick} />);

    await userEvent.click(screen.getByRole("switch"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("merges a custom className with default styles", () => {
    render(<Toggle aria-label="Toggle" className="my-custom-class" />);
    expect(screen.getByRole("switch").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Toggle aria-label="Toggle" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("is focusable via keyboard and toggles with Enter", async () => {
    render(<Toggle aria-label="Toggle" />);
    const toggle = screen.getByRole("switch");

    toggle.focus();
    expect(toggle).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });
});
