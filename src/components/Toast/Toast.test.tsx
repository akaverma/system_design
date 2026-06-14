import * as React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast, ToastProvider, useToast } from "./Toast";

describe("Toast", () => {
  it("renders title and description", () => {
    render(<Toast title="Saved" description="Your changes were saved." />);

    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Your changes were saved.")).toBeInTheDocument();
  });

  it("has role='status' and aria-live='polite'", () => {
    render(<Toast title="Saved" />);

    const toast = screen.getByRole("status");
    expect(toast).toHaveAttribute("aria-live", "polite");
  });

  it("applies the default variant with no icon and no accent border", () => {
    render(<Toast title="Default toast" />);

    const toast = screen.getByRole("status");
    expect(toast.querySelector("svg")).not.toBeInTheDocument();
    expect(toast.className).not.toContain("border-l-");
  });

  it.each([
    ["success", "border-l-success"],
    ["warning", "border-l-warning"],
    ["danger", "border-l-destructive"],
    ["info", "border-l-info"],
  ] as const)("applies styles and an icon for the %s variant", (variant, expectedClass) => {
    render(<Toast variant={variant} title="Title" />);

    const toast = screen.getByRole("status");
    expect(toast.className).toContain(expectedClass);
    expect(toast.querySelector("svg")).toBeInTheDocument();
  });

  it("does not render a title or description when not provided", () => {
    render(<Toast />);

    const toast = screen.getByRole("status");
    expect(toast.querySelector("p")).not.toBeInTheDocument();
  });

  it("renders a dismiss button with aria-label='Dismiss' when onDismiss is provided", async () => {
    const handleDismiss = jest.fn();
    render(<Toast title="Title" onDismiss={handleDismiss} />);

    const dismissButton = screen.getByRole("button", { name: "Dismiss" });
    await userEvent.click(dismissButton);

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it("does not render a dismiss button when onDismiss is not provided", () => {
    render(<Toast title="Title" />);

    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
  });

  it("merges a custom className with default styles", () => {
    render(<Toast title="Title" className="my-custom-class" />);

    expect(screen.getByRole("status").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying div element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Toast title="Title" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

function ToastDemo({ duration }: { duration?: number }) {
  const { toast } = useToast();

  return (
    <button
      type="button"
      onClick={() =>
        toast({ variant: "success", title: "Saved", description: "Done.", duration })
      }
    >
      Show toast
    </button>
  );
}

describe("ToastProvider / useToast", () => {
  it("throws a descriptive error when useToast is used outside a ToastProvider", () => {
    function Consumer() {
      useToast();
      return null;
    }

    // Suppress the expected React error boundary console output.
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Consumer />)).toThrow(
      "useToast must be used within a <ToastProvider>.",
    );

    spy.mockRestore();
  });

  it("adds a toast to the queue and renders it in the portal viewport", async () => {
    render(
      <ToastProvider>
        <ToastDemo />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Show toast" }));

    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Done.")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("auto-dismisses a toast after the default duration", async () => {
    jest.useFakeTimers();

    render(
      <ToastProvider>
        <ToastDemo />
      </ToastProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Show toast" }), {
        delay: null,
      });
    });

    expect(screen.getByText("Saved")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.queryByText("Saved")).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it("does not auto-dismiss when duration is 0", async () => {
    jest.useFakeTimers();

    render(
      <ToastProvider>
        <ToastDemo duration={0} />
      </ToastProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Show toast" }), {
        delay: null,
      });
    });

    expect(screen.getByText("Saved")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByText("Saved")).toBeInTheDocument();

    jest.useRealTimers();
  });

  it("can be manually dismissed via the close button", async () => {
    render(
      <ToastProvider>
        <ToastDemo duration={0} />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Show toast" }));

    expect(screen.getByText("Saved")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));

    await waitFor(() => {
      expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    });
  });

  it("supports multiple toasts in the queue", async () => {
    render(
      <ToastProvider>
        <ToastDemo duration={0} />
      </ToastProvider>,
    );

    const showButton = screen.getByRole("button", { name: "Show toast" });
    await userEvent.click(showButton);
    await userEvent.click(showButton);

    expect(screen.getAllByText("Saved")).toHaveLength(2);
  });

  it("clears pending timeouts on unmount", async () => {
    jest.useFakeTimers();

    const { unmount } = render(
      <ToastProvider>
        <ToastDemo />
      </ToastProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Show toast" }), {
        delay: null,
      });
    });

    unmount();

    expect(() => {
      act(() => {
        jest.advanceTimersByTime(10000);
      });
    }).not.toThrow();

    jest.useRealTimers();
  });
});
