import * as React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("does not show the tooltip initially", () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows the tooltip on hover after the default delay", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip text");
  });

  it("hides the tooltip on mouse leave", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.unhover(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("cancels the pending show timeout if the mouse leaves before the delay elapses", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));
    await user.unhover(screen.getByRole("button"));

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows the tooltip on focus", () => {
    jest.useFakeTimers();

    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );

    act(() => {
      screen.getByRole("button").focus();
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip text");
  });

  it("hides the tooltip on blur", () => {
    jest.useFakeTimers();

    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );

    act(() => {
      screen.getByRole("button").focus();
    });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    act(() => {
      screen.getByRole("button").blur();
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it.each([
    ["top", "bottom-full"],
    ["bottom", "top-full"],
    ["left", "right-full"],
    ["right", "left-full"],
  ] as const)("applies positioning classes for the %s position", (position, expectedClass) => {
    jest.useFakeTimers();

    render(
      <Tooltip content="Tooltip text" position={position}>
        <button>Trigger</button>
      </Tooltip>,
    );

    act(() => {
      screen.getByRole("button").focus();
    });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByRole("tooltip").className).toContain(expectedClass);
  });

  it("defaults to the top position", () => {
    jest.useFakeTimers();

    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );

    act(() => {
      screen.getByRole("button").focus();
    });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByRole("tooltip").className).toContain("bottom-full");
  });

  it("respects a custom delay", () => {
    jest.useFakeTimers();

    render(
      <Tooltip content="Tooltip text" delay={600}>
        <button>Trigger</button>
      </Tooltip>,
    );

    act(() => {
      screen.getByRole("button").focus();
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("does not attach listeners or show the tooltip when disabled", () => {
    jest.useFakeTimers();

    render(
      <Tooltip content="Tooltip text" disabled>
        <button>Trigger</button>
      </Tooltip>,
    );

    const button = screen.getByRole("button");
    expect(button).not.toHaveAttribute("aria-describedby");

    act(() => {
      button.focus();
    });
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("sets aria-describedby on the trigger when the tooltip is visible", () => {
    jest.useFakeTimers();

    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );

    const button = screen.getByRole("button");
    expect(button).not.toHaveAttribute("aria-describedby");

    act(() => {
      button.focus();
    });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    const tooltip = screen.getByRole("tooltip");
    expect(button).toHaveAttribute("aria-describedby", tooltip.id);
  });

  it("composes with existing handlers on the trigger element", () => {
    jest.useFakeTimers();

    const onMouseEnter = jest.fn();
    const onFocus = jest.fn();
    const onMouseLeave = jest.fn();
    const onBlur = jest.fn();

    render(
      <Tooltip content="Tooltip text">
        <button
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          Trigger
        </button>
      </Tooltip>,
    );

    const button = screen.getByRole("button");

    act(() => {
      button.focus();
    });
    expect(onFocus).toHaveBeenCalledTimes(1);

    act(() => {
      button.blur();
    });
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("merges a custom className with the tooltip bubble's default styles", () => {
    jest.useFakeTimers();

    render(
      <Tooltip content="Tooltip text" className="my-custom-class">
        <button>Trigger</button>
      </Tooltip>,
    );

    act(() => {
      screen.getByRole("button").focus();
    });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByRole("tooltip").className).toContain("my-custom-class");
  });

  it("forwards a ref to the trigger element", () => {
    const ref = React.createRef<HTMLButtonElement>();

    render(
      <Tooltip content="Tooltip text">
        <button ref={ref}>Trigger</button>
      </Tooltip>,
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("renders the trigger element when disabled without wrapping side effects", () => {
    render(
      <Tooltip content="Tooltip text" disabled>
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole("button", { name: "Trigger" })).toBeInTheDocument();
  });
});
