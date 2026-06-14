import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio, RadioGroup } from "./Radio";

describe("Radio", () => {
  it("renders a label associated with the radio input", () => {
    render(<Radio label="Free" />);
    const radio = screen.getByLabelText("Free");
    expect(radio).toBeInTheDocument();
    expect(radio.tagName).toBe("INPUT");
    expect(radio).toHaveAttribute("type", "radio");
  });

  it("renders without a label", () => {
    render(<Radio aria-label="Free plan" />);
    expect(screen.getByRole("radio", { name: "Free plan" })).toBeInTheDocument();
  });

  it("can be disabled", () => {
    render(<Radio label="Free" disabled />);
    expect(screen.getByLabelText("Free")).toBeDisabled();
  });

  it("merges a custom className with default styles", () => {
    render(<Radio label="Free" className="my-custom-class" />);
    expect(screen.getByLabelText("Free").className).toContain("my-custom-class");
  });

  it("applies containerClassName to the outer wrapper", () => {
    render(<Radio label="Free" containerClassName="my-wrapper-class" />);
    expect(screen.getByLabelText("Free").closest("div")?.className).toContain(
      "my-wrapper-class",
    );
  });

  it("forwards refs to the underlying input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Radio label="Free" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("uses a provided id instead of generating one", () => {
    render(<Radio label="Free" id="custom-id" />);
    expect(screen.getByLabelText("Free")).toHaveAttribute("id", "custom-id");
  });

  it("generates unique ids across multiple instances without a provided id", () => {
    render(
      <>
        <Radio label="First" />
        <Radio label="Second" />
      </>,
    );

    const first = screen.getByLabelText("First");
    const second = screen.getByLabelText("Second");

    expect(first.id).not.toBe(second.id);
  });

  describe("standalone usage (outside a RadioGroup)", () => {
    it("works as a controlled radio via checked/onChange", async () => {
      function Wrapper() {
        const [checked, setChecked] = React.useState(false);
        return (
          <Radio
            label="Subscribe"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          />
        );
      }

      render(<Wrapper />);
      const radio = screen.getByLabelText("Subscribe");

      expect(radio).not.toBeChecked();

      await userEvent.click(radio);

      expect(radio).toBeChecked();
    });

    it("respects its own name prop", () => {
      render(<Radio label="Free" name="standalone-name" />);
      expect(screen.getByLabelText("Free")).toHaveAttribute("name", "standalone-name");
    });

    it("does not call onChange when disabled and clicked", async () => {
      const handleChange = jest.fn();
      render(<Radio label="Free" disabled onChange={handleChange} checked={false} />);

      await userEvent.click(screen.getByLabelText("Free"));

      expect(handleChange).not.toHaveBeenCalled();
    });
  });
});

describe("RadioGroup", () => {
  it("renders a radiogroup with an accessible label from the label prop", () => {
    render(
      <RadioGroup name="plan" label="Choose a plan" defaultValue="free">
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>,
    );

    expect(screen.getByRole("radiogroup", { name: "Choose a plan" })).toBeInTheDocument();
    expect(screen.getByText("Choose a plan")).toBeInTheDocument();
  });

  it("uses aria-label over the visible label for the accessible name when both are given", () => {
    render(
      <RadioGroup name="plan" label="Choose a plan" aria-label="Plan selector" defaultValue="free">
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>,
    );

    expect(screen.getByRole("radiogroup", { name: "Plan selector" })).toBeInTheDocument();
  });

  it("renders without a visible label", () => {
    render(
      <RadioGroup name="plan" aria-label="Plan selector" defaultValue="free">
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>,
    );

    expect(screen.getByRole("radiogroup", { name: "Plan selector" })).toBeInTheDocument();
    expect(screen.queryByText("Plan selector")).not.toBeInTheDocument();
  });

  it("applies the shared name to every radio in the group", () => {
    render(
      <RadioGroup name="plan" label="Choose a plan" defaultValue="free">
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>,
    );

    expect(screen.getByLabelText("Free")).toHaveAttribute("name", "plan");
    expect(screen.getByLabelText("Pro")).toHaveAttribute("name", "plan");
  });

  it("selects the radio matching defaultValue (uncontrolled)", () => {
    render(
      <RadioGroup name="plan" label="Choose a plan" defaultValue="pro">
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
        <Radio value="enterprise" label="Enterprise" />
      </RadioGroup>,
    );

    expect(screen.getByLabelText("Free")).not.toBeChecked();
    expect(screen.getByLabelText("Pro")).toBeChecked();
    expect(screen.getByLabelText("Enterprise")).not.toBeChecked();
  });

  it("updates the selection on click (uncontrolled)", async () => {
    render(
      <RadioGroup name="plan" label="Choose a plan" defaultValue="free">
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
        <Radio value="enterprise" label="Enterprise" />
      </RadioGroup>,
    );

    expect(screen.getByLabelText("Free")).toBeChecked();

    await userEvent.click(screen.getByLabelText("Pro"));

    expect(screen.getByLabelText("Free")).not.toBeChecked();
    expect(screen.getByLabelText("Pro")).toBeChecked();
  });

  it("calls onChange with the new value when selection changes", async () => {
    const handleChange = jest.fn();
    render(
      <RadioGroup name="plan" label="Choose a plan" defaultValue="free" onChange={handleChange}>
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>,
    );

    await userEvent.click(screen.getByLabelText("Pro"));

    expect(handleChange).toHaveBeenCalledWith("pro");
  });

  it("supports controlled usage via value and onChange", async () => {
    function Wrapper() {
      const [value, setValue] = React.useState("free");
      return (
        <RadioGroup name="plan" label="Choose a plan" value={value} onChange={setValue}>
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
        </RadioGroup>
      );
    }

    render(<Wrapper />);

    expect(screen.getByLabelText("Free")).toBeChecked();

    await userEvent.click(screen.getByLabelText("Pro"));

    expect(screen.getByLabelText("Pro")).toBeChecked();
    expect(screen.getByLabelText("Free")).not.toBeChecked();
  });

  it("does not change selection when a disabled radio is clicked", async () => {
    render(
      <RadioGroup name="plan" label="Choose a plan" defaultValue="free">
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" disabled />
      </RadioGroup>,
    );

    await userEvent.click(screen.getByLabelText("Pro"));

    expect(screen.getByLabelText("Pro")).not.toBeChecked();
    expect(screen.getByLabelText("Free")).toBeChecked();
  });

  it("supports keyboard navigation between radios in the group", async () => {
    render(
      <RadioGroup name="plan" label="Choose a plan" defaultValue="free">
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
        <Radio value="enterprise" label="Enterprise" />
      </RadioGroup>,
    );

    const free = screen.getByLabelText("Free");
    free.focus();
    expect(free).toHaveFocus();

    await userEvent.keyboard("{ArrowDown}");

    expect(screen.getByLabelText("Pro")).toBeChecked();
  });

  it("merges a custom className with the radiogroup's default styles", () => {
    render(
      <RadioGroup name="plan" label="Choose a plan" defaultValue="free" className="my-group-class">
        <Radio value="free" label="Free" />
      </RadioGroup>,
    );

    expect(screen.getByRole("radiogroup").className).toContain("my-group-class");
  });
});
