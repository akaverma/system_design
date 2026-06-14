import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders an image when src is provided", () => {
    render(<Avatar src="/jane.png" alt="Jane Doe" />);
    const img = screen.getByRole("img", { name: "Jane Doe" });
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("src", "/jane.png");
  });

  it("uses name as the alt text when alt is not provided", () => {
    render(<Avatar src="/jane.png" name="Jane Doe" />);
    const img = screen.getByRole("img", { name: "Jane Doe" });
    expect(img.tagName).toBe("IMG");
  });

  it("renders initials derived from a two-word name when there is no src", () => {
    render(<Avatar name="Jane Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders a single initial for a single-word name", () => {
    render(<Avatar name="Cher" />);
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("falls back to initials when the image fails to load", () => {
    render(<Avatar src="/broken.png" name="Jane Doe" />);

    const img = screen.getByRole("img", { hidden: true }) as HTMLImageElement;
    fireEvent.error(img);

    expect(screen.queryByRole("img", { hidden: true })?.tagName).not.toBe("IMG");
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders a generic placeholder icon when neither src nor name is provided", () => {
    const { container } = render(<Avatar />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it.each([
    ["sm", "h-8 w-8 text-xs"],
    ["md", "h-10 w-10 text-sm"],
    ["lg", "h-12 w-12 text-base"],
    ["xl", "h-16 w-16 text-lg"],
  ] as const)("applies styles for the %s size", (size, expectedClasses) => {
    const { container } = render(<Avatar name="Jane Doe" size={size} />);
    const root = container.firstChild as HTMLElement;
    for (const cls of expectedClasses.split(" ")) {
      expect(root.className).toContain(cls);
    }
  });

  it("defaults to the md size", () => {
    const { container } = render(<Avatar name="Jane Doe" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("h-10");
    expect(root.className).toContain("w-10");
  });

  it("applies circle shape classes by default", () => {
    const { container } = render(<Avatar name="Jane Doe" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("rounded-full");
  });

  it("applies square shape classes when shape='square'", () => {
    const { container } = render(<Avatar name="Jane Doe" shape="square" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("rounded-md");
  });

  it("sets aria-label on the root when falling back and alt/name is provided", () => {
    render(<Avatar name="Jane Doe" />);
    expect(screen.getByRole("img", { name: "Jane Doe" })).toBeInTheDocument();
  });

  it("does not set an aria-label when neither alt nor name is provided", () => {
    const { container } = render(<Avatar />);
    const root = container.firstChild as HTMLElement;
    expect(root).not.toHaveAttribute("aria-label");
    expect(root).toHaveAttribute("role", "img");
  });

  it("merges a custom className with default styles", () => {
    const { container } = render(<Avatar name="Jane Doe" className="my-custom-class" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying div element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Avatar name="Jane Doe" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
