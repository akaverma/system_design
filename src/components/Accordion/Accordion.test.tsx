import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./Accordion";

function BasicAccordion(props: Omit<React.ComponentProps<typeof Accordion>, "children">) {
  return (
    <Accordion {...props}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Trigger 1</AccordionTrigger>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Trigger 2</AccordionTrigger>
        <AccordionContent>Content 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" disabled>
        <AccordionTrigger>Trigger 3</AccordionTrigger>
        <AccordionContent>Content 3</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("renders all item triggers", () => {
    render(<BasicAccordion />);

    expect(screen.getByRole("button", { name: /trigger 1/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /trigger 2/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /trigger 3/i })).toBeInTheDocument();
  });

  it("does not render content for closed items", () => {
    render(<BasicAccordion />);

    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
  });

  it("renders content for items open via defaultValue", () => {
    render(<BasicAccordion defaultValue="item-1" />);

    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
  });

  it("expands an item when its trigger is clicked", async () => {
    render(<BasicAccordion />);

    await userEvent.click(screen.getByRole("button", { name: /trigger 1/i }));

    expect(screen.getByText("Content 1")).toBeInTheDocument();
  });

  it("collapses an open item when its trigger is clicked again (collapsible default)", async () => {
    render(<BasicAccordion defaultValue="item-1" />);

    expect(screen.getByText("Content 1")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /trigger 1/i }));

    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
  });

  describe("single type", () => {
    it("only allows one item to be open at a time", async () => {
      render(<BasicAccordion type="single" defaultValue="item-1" />);

      expect(screen.getByText("Content 1")).toBeInTheDocument();

      await userEvent.click(screen.getByRole("button", { name: /trigger 2/i }));

      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("does not collapse the open item when collapsible is false", async () => {
      render(<BasicAccordion type="single" collapsible={false} defaultValue="item-1" />);

      expect(screen.getByText("Content 1")).toBeInTheDocument();

      await userEvent.click(screen.getByRole("button", { name: /trigger 1/i }));

      expect(screen.getByText("Content 1")).toBeInTheDocument();
    });

    it("can switch the open item when collapsible is false", async () => {
      render(<BasicAccordion type="single" collapsible={false} defaultValue="item-1" />);

      await userEvent.click(screen.getByRole("button", { name: /trigger 2/i }));

      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });
  });

  describe("multiple type", () => {
    it("allows multiple items to be open at once", async () => {
      render(<BasicAccordion type="multiple" defaultValue={["item-1"]} />);

      expect(screen.getByText("Content 1")).toBeInTheDocument();

      await userEvent.click(screen.getByRole("button", { name: /trigger 2/i }));

      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("closes an open item without affecting others", async () => {
      render(<BasicAccordion type="multiple" defaultValue={["item-1", "item-2"]} />);

      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();

      await userEvent.click(screen.getByRole("button", { name: /trigger 1/i }));

      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });
  });

  describe("controlled mode", () => {
    it("uses the value prop to determine open items and does not change internally", async () => {
      const handleChange = jest.fn();
      render(<BasicAccordion type="single" value="item-1" onValueChange={handleChange} />);

      expect(screen.getByText("Content 1")).toBeInTheDocument();

      await userEvent.click(screen.getByRole("button", { name: /trigger 2/i }));

      // value prop unchanged, so item-1 remains open
      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
    });

    it("calls onValueChange with a string for single type", async () => {
      const handleChange = jest.fn();
      render(<BasicAccordion type="single" value="item-1" onValueChange={handleChange} />);

      await userEvent.click(screen.getByRole("button", { name: /trigger 2/i }));

      expect(handleChange).toHaveBeenCalledWith("item-2");
    });

    it("calls onValueChange with an empty string when collapsing a single item", async () => {
      const handleChange = jest.fn();
      render(<BasicAccordion type="single" value="item-1" onValueChange={handleChange} />);

      await userEvent.click(screen.getByRole("button", { name: /trigger 1/i }));

      expect(handleChange).toHaveBeenCalledWith("");
    });

    it("calls onValueChange with an array for multiple type", async () => {
      const handleChange = jest.fn();
      render(
        <BasicAccordion type="multiple" value={["item-1"]} onValueChange={handleChange} />,
      );

      await userEvent.click(screen.getByRole("button", { name: /trigger 2/i }));

      expect(handleChange).toHaveBeenCalledWith(["item-1", "item-2"]);
    });

    it("works as a fully controlled component driven by parent state", async () => {
      function Controlled() {
        const [value, setValue] = React.useState<string | string[]>("item-1");
        return <BasicAccordion type="single" value={value} onValueChange={setValue} />;
      }

      render(<Controlled />);

      expect(screen.getByText("Content 1")).toBeInTheDocument();

      await userEvent.click(screen.getByRole("button", { name: /trigger 2/i }));

      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });
  });

  describe("uncontrolled mode", () => {
    it("manages its own open state without a value prop", async () => {
      render(<BasicAccordion type="multiple" />);

      await userEvent.click(screen.getByRole("button", { name: /trigger 1/i }));
      await userEvent.click(screen.getByRole("button", { name: /trigger 2/i }));

      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });
  });

  describe("ARIA attributes", () => {
    it("sets aria-expanded based on open state", async () => {
      render(<BasicAccordion defaultValue="item-1" />);

      expect(screen.getByRole("button", { name: /trigger 1/i })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      expect(screen.getByRole("button", { name: /trigger 2/i })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("links the trigger and content via aria-controls / aria-labelledby and ids", () => {
      render(<BasicAccordion defaultValue="item-1" />);

      const trigger = screen.getByRole("button", { name: /trigger 1/i });
      const content = screen.getByRole("region");

      expect(trigger).toHaveAttribute("id", "accordion-trigger-item-1");
      expect(trigger).toHaveAttribute("aria-controls", "accordion-content-item-1");
      expect(content).toHaveAttribute("id", "accordion-content-item-1");
      expect(content).toHaveAttribute("aria-labelledby", "accordion-trigger-item-1");
    });
  });

  describe("disabled items", () => {
    it("disables the trigger for a disabled item", () => {
      render(<BasicAccordion />);

      expect(screen.getByRole("button", { name: /trigger 3/i })).toBeDisabled();
    });

    it("does not toggle a disabled item when clicked", async () => {
      render(<BasicAccordion />);

      await userEvent.click(screen.getByRole("button", { name: /trigger 3/i }));

      expect(screen.queryByText("Content 3")).not.toBeInTheDocument();
    });
  });

  describe("ref forwarding", () => {
    it("forwards refs to the trigger button element", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger ref={ref}>Trigger 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("forwards refs to the content div element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Accordion type="single" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger 1</AccordionTrigger>
            <AccordionContent ref={ref}>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("className merging", () => {
    it("merges a custom className on Accordion with default styles", () => {
      render(
        <Accordion type="single" className="my-custom-class">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByRole("button", { name: /trigger 1/i }).parentElement?.parentElement?.className).toContain(
        "my-custom-class",
      );
    });

    it("merges a custom className on AccordionItem with default styles", () => {
      render(
        <Accordion type="single">
          <AccordionItem value="item-1" className="item-custom-class">
            <AccordionTrigger>Trigger 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByRole("button", { name: /trigger 1/i }).parentElement?.className).toContain(
        "item-custom-class",
      );
    });

    it("merges a custom className on AccordionTrigger with default styles", () => {
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger className="trigger-custom-class">Trigger 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByRole("button", { name: /trigger 1/i }).className).toContain(
        "trigger-custom-class",
      );
    });

    it("merges a custom className on AccordionContent with default styles", () => {
      render(
        <Accordion type="single" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger 1</AccordionTrigger>
            <AccordionContent className="content-custom-class">Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByRole("region").className).toContain("content-custom-class");
    });
  });

  describe("chevron indicator", () => {
    it("rotates the chevron when the item is open", () => {
      render(<BasicAccordion defaultValue="item-1" />);

      const trigger = screen.getByRole("button", { name: /trigger 1/i });
      const chevron = trigger.querySelector("svg");

      expect(chevron?.getAttribute("class")).toContain("rotate-180");
    });

    it("does not rotate the chevron when the item is closed", () => {
      render(<BasicAccordion />);

      const trigger = screen.getByRole("button", { name: /trigger 1/i });
      const chevron = trigger.querySelector("svg");

      expect(chevron?.getAttribute("class")).not.toContain("rotate-180");
    });
  });

  describe("context usage outside provider", () => {
    it("throws when AccordionItem is used outside an Accordion", () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

      expect(() =>
        render(
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger 1</AccordionTrigger>
          </AccordionItem>,
        ),
      ).toThrow("AccordionItem must be used within an Accordion");

      consoleError.mockRestore();
    });

    it("throws when AccordionTrigger is used outside an AccordionItem", () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

      expect(() =>
        render(
          <Accordion type="single">
            <AccordionTrigger>Trigger 1</AccordionTrigger>
          </Accordion>,
        ),
      ).toThrow("AccordionTrigger must be used within an AccordionItem");

      consoleError.mockRestore();
    });

    it("throws when AccordionContent is used outside an AccordionItem", () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

      expect(() =>
        render(
          <Accordion type="single">
            <AccordionContent>Content</AccordionContent>
          </Accordion>,
        ),
      ).toThrow("AccordionContent must be used within an AccordionItem");

      consoleError.mockRestore();
    });
  });
});
