import * as React from "react";
import { render } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders a div with the base pulsing styles", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton.tagName).toBe("DIV");
    expect(skeleton.className).toContain("animate-pulse");
    expect(skeleton.className).toContain("bg-muted");
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveAttribute("aria-hidden", "true");
  });

  it("defaults to the rectangular variant", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton.className).toContain("rounded-md");
  });

  it.each([
    ["text", "rounded-md"],
    ["circular", "rounded-full"],
    ["rectangular", "rounded-md"],
  ] as const)("applies styles for the %s variant", (variant, expectedClass) => {
    const { container } = render(<Skeleton variant={variant} />);
    expect((container.firstChild as HTMLElement).className).toContain(expectedClass);
  });

  it("defaults to a 1em height for the text variant when no height is provided", () => {
    const { container } = render(<Skeleton variant="text" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton.style.height).toBe("1em");
  });

  it("does not apply a default height for non-text variants", () => {
    const { container } = render(<Skeleton variant="rectangular" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton.style.height).toBe("");
  });

  it("converts numeric width and height props to pixel values", () => {
    const { container } = render(<Skeleton width={120} height={40} />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton.style.width).toBe("120px");
    expect(skeleton.style.height).toBe("40px");
  });

  it("applies string width and height values as-is", () => {
    const { container } = render(<Skeleton width="100%" height="2rem" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton.style.width).toBe("100%");
    expect(skeleton.style.height).toBe("2rem");
  });

  it("merges a custom style prop with computed dimensions", () => {
    const { container } = render(
      <Skeleton width={100} height={50} style={{ marginTop: "8px" }} />,
    );
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton.style.width).toBe("100px");
    expect(skeleton.style.height).toBe("50px");
    expect(skeleton.style.marginTop).toBe("8px");
  });

  it("allows a custom style prop to override computed dimensions", () => {
    const { container } = render(<Skeleton width={100} style={{ width: "200px" }} />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton.style.width).toBe("200px");
  });

  it("merges a custom className with default styles", () => {
    const { container } = render(<Skeleton className="my-custom-class" />);
    expect((container.firstChild as HTMLElement).className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying div element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
