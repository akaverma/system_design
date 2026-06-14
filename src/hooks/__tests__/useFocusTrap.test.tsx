import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFocusTrap } from "../useFocusTrap";

function TrapDemo({ active }: { active: boolean }) {
  const ref = useFocusTrap<HTMLDivElement>(active);
  return (
    <div>
      <button>Outside Before</button>
      <div ref={ref} data-testid="trap">
        <button>First</button>
        <button>Last</button>
      </div>
      <button>Outside After</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("focuses the first focusable element when activated", () => {
    render(<TrapDemo active />);
    expect(screen.getByText("First")).toHaveFocus();
  });

  it("does not move focus when inactive", () => {
    render(<TrapDemo active={false} />);
    expect(document.body).toHaveFocus();
  });

  it("wraps focus from the last element to the first on Tab", async () => {
    render(<TrapDemo active />);

    const first = screen.getByText("First");
    const last = screen.getByText("Last");

    last.focus();
    expect(last).toHaveFocus();

    await userEvent.tab();
    expect(first).toHaveFocus();
  });

  it("wraps focus from the first element to the last on Shift+Tab", async () => {
    render(<TrapDemo active />);

    const first = screen.getByText("First");
    const last = screen.getByText("Last");

    expect(first).toHaveFocus();

    await userEvent.tab({ shift: true });
    expect(last).toHaveFocus();
  });

  it("restores focus to the previously focused element when deactivated", () => {
    const { rerender } = render(
      <div>
        <button data-testid="trigger">Open</button>
        <TrapDemo active={false} />
      </div>,
    );

    const trigger = screen.getByTestId("trigger");
    trigger.focus();
    expect(trigger).toHaveFocus();

    rerender(
      <div>
        <button data-testid="trigger">Open</button>
        <TrapDemo active />
      </div>,
    );
    expect(screen.getByText("First")).toHaveFocus();

    rerender(
      <div>
        <button data-testid="trigger">Open</button>
        <TrapDemo active={false} />
      </div>,
    );
    expect(screen.getByTestId("trigger")).toHaveFocus();
  });
});
