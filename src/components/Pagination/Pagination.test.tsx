import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination, getPageRange } from "./Pagination";

describe("getPageRange", () => {
  it("returns all pages with no ellipsis when totalPages is small", () => {
    expect(getPageRange(1, 5, 1)).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns all pages when totalPages equals the threshold", () => {
    expect(getPageRange(4, 7, 1)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("collapses the middle range into ellipses on both sides", () => {
    expect(getPageRange(5, 10, 1)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });

  it("does not show a left ellipsis when current page is near the start", () => {
    expect(getPageRange(1, 10, 1)).toEqual([1, 2, "ellipsis", 10]);
  });

  it("does not show a left ellipsis when leftSiblingIndex is exactly 2", () => {
    expect(getPageRange(3, 10, 1)).toEqual([1, 2, 3, 4, "ellipsis", 10]);
  });

  it("does not show a right ellipsis when current page is near the end", () => {
    expect(getPageRange(10, 10, 1)).toEqual([1, "ellipsis", 9, 10]);
  });

  it("does not show a right ellipsis when rightSiblingIndex is exactly totalPages - 1", () => {
    expect(getPageRange(8, 10, 1)).toEqual([1, "ellipsis", 7, 8, 9, 10]);
  });

  it("respects a larger siblingCount", () => {
    expect(getPageRange(10, 20, 2)).toEqual([1, "ellipsis", 8, 9, 10, 11, 12, "ellipsis", 20]);
  });

  it("defaults siblingCount to 1 when not provided", () => {
    expect(getPageRange(5, 10)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });
});

describe("Pagination", () => {
  it("renders a navigation landmark with an accessible label", () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={jest.fn()} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("renders page number buttons", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />);
    for (let page = 1; page <= 5; page++) {
      expect(screen.getByRole("button", { name: String(page) })).toBeInTheDocument();
    }
  });

  it("renders ellipses for large page counts", () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={jest.fn()} />);
    expect(screen.getAllByText("…")).toHaveLength(2);
  });

  it("marks the current page with aria-current", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={jest.fn()} />);
    const current = screen.getByRole("button", { name: "3" });
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("does not set aria-current on non-current pages", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={jest.fn()} />);
    const other = screen.getByRole("button", { name: "1" });
    expect(other).not.toHaveAttribute("aria-current");
  });

  it("applies highlighted styles to the current page button", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={jest.fn()} />);
    const current = screen.getByRole("button", { name: "3" });
    expect(current.className).toContain("bg-primary");
  });

  it("applies non-highlighted styles to other page buttons", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={jest.fn()} />);
    const other = screen.getByRole("button", { name: "1" });
    expect(other.className).toContain("hover:bg-accent");
    expect(other.className).not.toContain("bg-primary");
  });

  it("calls onPageChange with the clicked page number", async () => {
    const handlePageChange = jest.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />);

    await userEvent.click(screen.getByRole("button", { name: "3" }));

    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("renders Previous and Next buttons by default", () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next page" })).toBeInTheDocument();
  });

  it("disables the Previous button on the first page", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });

  it("disables the Next button on the last page", () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("enables Previous and Next on middle pages", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Previous page" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).not.toBeDisabled();
  });

  it("calls onPageChange with currentPage - 1 when Previous is clicked", async () => {
    const handlePageChange = jest.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={handlePageChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Previous page" }));

    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with currentPage + 1 when Next is clicked", async () => {
    const handlePageChange = jest.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={handlePageChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it("hides Previous and Next buttons when hideControls is true", () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={jest.fn()} hideControls />);
    expect(screen.queryByRole("button", { name: "Previous page" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next page" })).not.toBeInTheDocument();
  });

  it("respects a custom siblingCount", () => {
    render(<Pagination currentPage={10} totalPages={20} onPageChange={jest.fn()} siblingCount={2} />);

    [8, 9, 10, 11, 12].forEach((page) => {
      expect(screen.getByRole("button", { name: String(page) })).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: "7" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "13" })).not.toBeInTheDocument();
  });

  it("merges a custom className with default styles", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={jest.fn()}
        className="my-custom-class"
      />,
    );
    expect(screen.getByRole("navigation").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying nav element", () => {
    const ref = React.createRef<HTMLElement>();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("NAV");
  });

  it("spreads additional props onto the nav element", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={jest.fn()}
        data-testid="pagination-nav"
      />,
    );
    expect(screen.getByTestId("pagination-nav")).toBeInTheDocument();
  });
});
