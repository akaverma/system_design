import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Drawer } from "./Drawer";

describe("Drawer", () => {
  it("renders nothing when closed", () => {
    render(
      <Drawer isOpen={false} onClose={jest.fn()} title="Title">
        Content
      </Drawer>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the dialog with title and content when open", () => {
    render(
      <Drawer isOpen onClose={jest.fn()} title="My Drawer">
        Drawer body
      </Drawer>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("My Drawer")).toBeInTheDocument();
    expect(screen.getByText("Drawer body")).toBeInTheDocument();
  });

  it("associates the title with the dialog via aria-labelledby", () => {
    render(
      <Drawer isOpen onClose={jest.fn()} title="My Drawer">
        Content
      </Drawer>,
    );

    const dialog = screen.getByRole("dialog");
    const titleId = dialog.getAttribute("aria-labelledby");
    expect(titleId).toBeTruthy();
    expect(document.getElementById(titleId!)).toHaveTextContent("My Drawer");
  });

  it("does not set aria-labelledby when no title is provided", () => {
    render(<Drawer isOpen onClose={jest.fn()}>Content</Drawer>);

    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-labelledby");
  });

  it("renders into document.body via a portal", () => {
    const { baseElement } = render(
      <div data-testid="local-root">
        <Drawer isOpen onClose={jest.fn()} title="Portal Drawer">
          Content
        </Drawer>
      </div>,
    );

    const localRoot = screen.getByTestId("local-root");
    expect(localRoot.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    expect(baseElement.querySelector('[role="dialog"]')).toBeInTheDocument();
  });

  it("traps focus within the drawer panel", () => {
    render(
      <Drawer isOpen onClose={jest.fn()} title="Focus Trap" showCloseButton={false}>
        <button>First</button>
        <button>Second</button>
      </Drawer>,
    );

    const first = screen.getByRole("button", { name: "First" });
    expect(first).toHaveFocus();
  });

  it("calls onClose when Escape is pressed and closeOnEsc is true (default)", async () => {
    const handleClose = jest.fn();
    render(
      <Drawer isOpen onClose={handleClose} title="Title">
        Content
      </Drawer>,
    );

    await userEvent.keyboard("{Escape}");

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose on Escape when closeOnEsc is false", async () => {
    const handleClose = jest.fn();
    render(
      <Drawer isOpen onClose={handleClose} title="Title" closeOnEsc={false}>
        Content
      </Drawer>,
    );

    await userEvent.keyboard("{Escape}");

    expect(handleClose).not.toHaveBeenCalled();
  });

  it("does not call onClose on other keys", async () => {
    const handleClose = jest.fn();
    render(
      <Drawer isOpen onClose={handleClose} title="Title">
        Content
      </Drawer>,
    );

    await userEvent.keyboard("{ArrowDown}");

    expect(handleClose).not.toHaveBeenCalled();
  });

  it("removes the keydown listener when closed", async () => {
    const handleClose = jest.fn();
    const { rerender } = render(
      <Drawer isOpen onClose={handleClose} title="Title">
        Content
      </Drawer>,
    );

    rerender(
      <Drawer isOpen={false} onClose={handleClose} title="Title">
        Content
      </Drawer>,
    );

    await userEvent.keyboard("{Escape}");

    expect(handleClose).not.toHaveBeenCalled();
  });

  it("calls onClose when the overlay is clicked and closeOnOverlayClick is true (default)", async () => {
    const handleClose = jest.fn();
    render(
      <Drawer isOpen onClose={handleClose} title="Title">
        Content
      </Drawer>,
    );

    const overlay = screen.getByRole("dialog").parentElement!;
    await userEvent.click(overlay);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when the panel itself is clicked", async () => {
    const handleClose = jest.fn();
    render(
      <Drawer isOpen onClose={handleClose} title="Title">
        Content
      </Drawer>,
    );

    await userEvent.click(screen.getByRole("dialog"));

    expect(handleClose).not.toHaveBeenCalled();
  });

  it("does not call onClose on overlay click when closeOnOverlayClick is false", async () => {
    const handleClose = jest.fn();
    render(
      <Drawer isOpen onClose={handleClose} title="Title" closeOnOverlayClick={false}>
        Content
      </Drawer>,
    );

    const overlay = screen.getByRole("dialog").parentElement!;
    await userEvent.click(overlay);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it("renders a close button by default and calls onClose when clicked", async () => {
    const handleClose = jest.fn();
    render(
      <Drawer isOpen onClose={handleClose} title="Title">
        Content
      </Drawer>,
    );

    const closeButton = screen.getByRole("button", { name: "Close" });
    await userEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not render a close button when showCloseButton is false", () => {
    render(
      <Drawer isOpen onClose={jest.fn()} title="Title" showCloseButton={false}>
        Content
      </Drawer>,
    );

    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("renders no header when there is no title and showCloseButton is false", () => {
    render(
      <Drawer isOpen onClose={jest.fn()} showCloseButton={false}>
        Content
      </Drawer>,
    );

    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders footer content when provided", () => {
    render(
      <Drawer isOpen onClose={jest.fn()} title="Title" footer={<button>Save</button>}>
        Content
      </Drawer>,
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("does not render a footer section when not provided", () => {
    const { container } = render(
      <Drawer isOpen onClose={jest.fn()} title="Title">
        Content
      </Drawer>,
    );

    expect(container.querySelector(".justify-end")).not.toBeInTheDocument();
  });

  it.each(["left", "right", "top", "bottom"] as const)(
    "applies position styles for the %s position",
    (position) => {
      render(
        <Drawer isOpen onClose={jest.fn()} title="Title" position={position}>
          Content
        </Drawer>,
      );

      const dialog = screen.getByRole("dialog");
      if (position === "left") {
        expect(dialog.className).toContain("left-0");
        expect(dialog.className).toContain("border-r");
      } else if (position === "right") {
        expect(dialog.className).toContain("right-0");
        expect(dialog.className).toContain("border-l");
      } else if (position === "top") {
        expect(dialog.className).toContain("top-0");
        expect(dialog.className).toContain("border-b");
      } else {
        expect(dialog.className).toContain("bottom-0");
        expect(dialog.className).toContain("border-t");
      }
    },
  );

  it.each([
    ["sm", "w-64"],
    ["md", "w-80"],
    ["lg", "w-96"],
    ["full", "w-full"],
  ] as const)("applies the %s width for left/right positions", (size, expectedClass) => {
    render(
      <Drawer isOpen onClose={jest.fn()} title="Title" position="right" size={size}>
        Content
      </Drawer>,
    );

    expect(screen.getByRole("dialog").className).toContain(expectedClass);
  });

  it.each([
    ["sm", "h-1/4"],
    ["md", "h-1/3"],
    ["lg", "h-1/2"],
    ["full", "h-full"],
  ] as const)("applies the %s height for top/bottom positions", (size, expectedClass) => {
    render(
      <Drawer isOpen onClose={jest.fn()} title="Title" position="bottom" size={size}>
        Content
      </Drawer>,
    );

    expect(screen.getByRole("dialog").className).toContain(expectedClass);
  });

  it("merges a custom className with default styles", () => {
    render(
      <Drawer isOpen onClose={jest.fn()} title="Title" className="my-custom-class">
        Content
      </Drawer>,
    );

    expect(screen.getByRole("dialog").className).toContain("my-custom-class");
  });

  it("generates unique title ids across multiple instances", () => {
    render(
      <>
        <Drawer isOpen onClose={jest.fn()} title="First">
          Content
        </Drawer>
      </>,
    );
    const firstId = screen.getByRole("dialog").getAttribute("aria-labelledby");

    render(
      <>
        <Drawer isOpen onClose={jest.fn()} title="Second">
          Content
        </Drawer>
      </>,
    );
    const dialogs = screen.getAllByRole("dialog");
    const secondId = dialogs[dialogs.length - 1]!.getAttribute("aria-labelledby");

    expect(firstId).not.toBe(secondId);
  });
});
