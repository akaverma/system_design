import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useClickOutside } from "../useClickOutside";

function ClickOutsideDemo({ active = true }: { active?: boolean }) {
  const [open, setOpen] = React.useState(true);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), active);

  return (
    <div>
      <div ref={ref} data-testid="inside">
        {open ? "open" : "closed"}
      </div>
      <button data-testid="outside">Outside</button>
    </div>
  );
}

describe("useClickOutside", () => {
  it("invokes the handler when clicking outside the referenced element", async () => {
    render(<ClickOutsideDemo />);

    expect(screen.getByTestId("inside")).toHaveTextContent("open");

    await userEvent.click(screen.getByTestId("outside"));

    expect(screen.getByTestId("inside")).toHaveTextContent("closed");
  });

  it("does not invoke the handler when clicking inside the referenced element", async () => {
    render(<ClickOutsideDemo />);

    await userEvent.click(screen.getByTestId("inside"));

    expect(screen.getByTestId("inside")).toHaveTextContent("open");
  });

  it("does nothing when inactive", async () => {
    render(<ClickOutsideDemo active={false} />);

    await userEvent.click(screen.getByTestId("outside"));

    expect(screen.getByTestId("inside")).toHaveTextContent("open");
  });
});
