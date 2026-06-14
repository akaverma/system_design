import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a label associated with the textarea", () => {
    render(<Textarea label="Bio" />);
    const textarea = screen.getByLabelText("Bio");
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("renders a placeholder", () => {
    render(<Textarea placeholder="Tell us about yourself" />);
    expect(screen.getByPlaceholderText("Tell us about yourself")).toBeInTheDocument();
  });

  it("accepts user input", async () => {
    render(<Textarea label="Bio" />);
    const textarea = screen.getByLabelText("Bio");

    await userEvent.type(textarea, "Hello world");

    expect(textarea).toHaveValue("Hello world");
  });

  it("renders helper text when there is no error", () => {
    render(<Textarea label="Bio" helperText="Max 200 characters" />);
    expect(screen.getByText("Max 200 characters")).toBeInTheDocument();
  });

  it("renders an error message with role=alert and marks the textarea invalid", () => {
    render(<Textarea label="Bio" error="Bio is required." />);

    const textarea = screen.getByLabelText("Bio");
    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent("Bio is required.");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("aria-describedby", alert.id);
  });

  it("prefers the error message over helper text", () => {
    render(<Textarea label="Bio" error="Invalid" helperText="Helper" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Invalid");
    expect(screen.queryByText("Helper")).not.toBeInTheDocument();
  });

  it("renders neither error nor helper text when not provided", () => {
    render(<Textarea label="Bio" />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not set aria-invalid or aria-describedby when there is no error or helper text", () => {
    render(<Textarea label="Bio" />);
    const textarea = screen.getByLabelText("Bio");

    expect(textarea).not.toHaveAttribute("aria-invalid");
    expect(textarea).not.toHaveAttribute("aria-describedby");
  });

  it("appends a provided aria-describedby to the generated describedby id", () => {
    render(<Textarea label="Bio" helperText="Helper" aria-describedby="external-id" />);
    const textarea = screen.getByLabelText("Bio");

    const describedBy = textarea.getAttribute("aria-describedby");
    expect(describedBy).toContain("external-id");
    expect(describedBy).toContain("helper");
  });

  it("can be disabled", () => {
    render(<Textarea label="Bio" disabled />);
    expect(screen.getByLabelText("Bio")).toBeDisabled();
  });

  it("merges a custom className with default styles", () => {
    render(<Textarea label="Bio" className="my-custom-class" />);
    expect(screen.getByLabelText("Bio").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying textarea element", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea label="Bio" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("uses a provided id instead of generating one", () => {
    render(<Textarea label="Bio" id="custom-id" />);
    const textarea = screen.getByLabelText("Bio");
    expect(textarea).toHaveAttribute("id", "custom-id");
  });

  it("generates unique ids across multiple instances without a provided id", () => {
    render(
      <>
        <Textarea label="First" />
        <Textarea label="Second" />
      </>,
    );

    const first = screen.getByLabelText("First");
    const second = screen.getByLabelText("Second");

    expect(first.id).not.toBe(second.id);
  });

  it("renders without a label", () => {
    render(<Textarea placeholder="No label" />);
    expect(screen.queryByText("No label")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("No label")).toBeInTheDocument();
  });

  describe("resize", () => {
    it("defaults to vertical resize", () => {
      render(<Textarea label="Bio" />);
      expect(screen.getByLabelText("Bio").className).toContain("resize-y");
    });

    it.each([
      ["none", "resize-none"],
      ["vertical", "resize-y"],
      ["horizontal", "resize-x"],
      ["both", "resize"],
    ] as const)("applies the %s resize class", (resize, expectedClass) => {
      render(<Textarea label="Bio" resize={resize} />);
      expect(screen.getByLabelText("Bio").className).toContain(expectedClass);
    });
  });
});
