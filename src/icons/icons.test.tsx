import * as React from "react";
import { render } from "@testing-library/react";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  InfoIcon,
  MailIcon,
  SearchIcon,
  SpinnerIcon,
  StarIcon,
} from "./icons";

const icons = {
  CloseIcon,
  CheckIcon,
  CheckCircleIcon,
  InfoIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  ChevronDownIcon,
  SearchIcon,
  MailIcon,
  StarIcon,
  SpinnerIcon,
};

describe("icons", () => {
  it.each(Object.entries(icons))("%s renders an svg hidden from assistive tech", (_, Icon) => {
    const { container } = render(<Icon />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
  });

  it("applies a custom size", () => {
    const { container } = render(<CloseIcon size={24} />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
  });

  it("merges a custom className", () => {
    const { container } = render(<CloseIcon className="text-destructive" />);
    expect(container.querySelector("svg")).toHaveClass("text-destructive");
  });

  it("forwards refs to the underlying svg element", () => {
    const ref = React.createRef<SVGSVGElement>();
    render(<CloseIcon ref={ref} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it("uses fill for filled icons (e.g. StarIcon) and stroke for outline icons (e.g. CloseIcon)", () => {
    const { container: filled } = render(<StarIcon />);
    const { container: outline } = render(<CloseIcon />);

    expect(filled.querySelector("svg")).toHaveAttribute("fill", "currentColor");
    expect(outline.querySelector("svg")).toHaveAttribute("stroke", "currentColor");
  });

  it("allows overriding aria-hidden to make an icon accessible", () => {
    const { container } = render(<InfoIcon aria-hidden={undefined} role="img" aria-label="Info" />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("aria-label", "Info");
    expect(svg).toHaveAttribute("role", "img");
  });
});
