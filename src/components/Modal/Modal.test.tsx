import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders nothing when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()} title="Title">
        Content
      </Modal>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the dialog with title and body content when open", () => {
    render(
      <Modal isOpen onClose={jest.fn()} title="My Title">
        My Content
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.getByText("My Content")).toBeInTheDocument();
  });

  it("associates the title via aria-labelledby", () => {
    render(
      <Modal isOpen onClose={jest.fn()} title="My Title">
        Content
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");
    const titleId = dialog.getAttribute("aria-labelledby");
    expect(titleId).toBeTruthy();
    expect(document.getElementById(titleId as string)).toHaveTextContent("My Title");
  });

  it("does not set aria-labelledby when no title is provided", () => {
    render(
      <Modal isOpen onClose={jest.fn()} showCloseButton={false}>
        Content
      </Modal>,
    );

    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-labelledby");
  });

  it("renders and associates the description via aria-describedby", () => {
    render(
      <Modal isOpen onClose={jest.fn()} title="Title" description="My description">
        Content
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");
    const descId = dialog.getAttribute("aria-describedby");
    expect(descId).toBeTruthy();
    expect(document.getElementById(descId as string)).toHaveTextContent("My description");
  });

  it("does not set aria-describedby when no description is provided", () => {
    render(
      <Modal isOpen onClose={jest.fn()} title="Title">
        Content
      </Modal>,
    );

    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-describedby");
  });

  it("renders footer content when provided", () => {
    render(
      <Modal isOpen onClose={jest.fn()} title="Title" footer={<button>Confirm</button>}>
        Content
      </Modal>,
    );

    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("does not render a footer container when footer is not provided", () => {
    const { container } = render(
      <Modal isOpen onClose={jest.fn()} title="Title">
        Content
      </Modal>,
    );

    expect(container.querySelector(".mt-6")).not.toBeInTheDocument();
  });

  it("does not render a header when there is no title, description, or close button", () => {
    render(
      <Modal isOpen onClose={jest.fn()} showCloseButton={false}>
        Plain content
      </Modal>,
    );

    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    expect(screen.getByText("Plain content")).toBeInTheDocument();
  });

  it("shows the close button by default and calls onClose when clicked", async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen onClose={handleClose} title="Title">
        Content
      </Modal>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("hides the close button when showCloseButton is false", () => {
    render(
      <Modal isOpen onClose={jest.fn()} title="Title" showCloseButton={false}>
        Content
      </Modal>,
    );

    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("calls onClose when Escape is pressed by default", async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen onClose={handleClose} title="Title">
        Content
      </Modal>,
    );

    await userEvent.keyboard("{Escape}");
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose on Escape when closeOnEsc is false", async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen onClose={handleClose} title="Title" closeOnEsc={false}>
        Content
      </Modal>,
    );

    await userEvent.keyboard("{Escape}");
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("calls onClose when the overlay is clicked by default", async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen onClose={handleClose} title="Title">
        Content
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");
    const overlay = dialog.parentElement as HTMLElement;
    await userEvent.click(overlay);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking inside the dialog panel", async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen onClose={handleClose} title="Title">
        Content
      </Modal>,
    );

    await userEvent.click(screen.getByRole("dialog"));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("does not call onClose on overlay click when closeOnOverlayClick is false", async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen onClose={handleClose} title="Title" closeOnOverlayClick={false}>
        Content
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");
    const overlay = dialog.parentElement as HTMLElement;
    await userEvent.click(overlay);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it("traps focus within the dialog and restores it on close", async () => {
    function Wrapper() {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open</button>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Title">
            <button>First</button>
            <button>Second</button>
          </Modal>
        </>
      );
    }

    render(<Wrapper />);

    const openButton = screen.getByRole("button", { name: "Open" });
    openButton.focus();
    await userEvent.click(openButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.activeElement).not.toBe(openButton);

    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(openButton).toHaveFocus();
  });

  it("applies the size styles", () => {
    render(
      <Modal isOpen onClose={jest.fn()} title="Title" size="lg">
        Content
      </Modal>,
    );

    expect(screen.getByRole("dialog").className).toContain("max-w-lg");
  });

  it("defaults to the md size", () => {
    render(
      <Modal isOpen onClose={jest.fn()} title="Title">
        Content
      </Modal>,
    );

    expect(screen.getByRole("dialog").className).toContain("max-w-md");
  });

  it("merges a custom className with the dialog panel's default styles", () => {
    render(
      <Modal isOpen onClose={jest.fn()} title="Title" className="my-custom-class">
        Content
      </Modal>,
    );

    expect(screen.getByRole("dialog").className).toContain("my-custom-class");
  });

  it("renders into document.body via a portal", () => {
    const { container } = render(
      <Modal isOpen onClose={jest.fn()} title="Title">
        Content
      </Modal>,
    );

    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });
});
