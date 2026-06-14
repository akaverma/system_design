import * as React from "react";
import { cn } from "../../utils/cn";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Current 1-indexed page number. */
  currentPage: number;
  /** Total number of pages. */
  totalPages: number;
  /** Called with the new page number when the user navigates. */
  onPageChange: (page: number) => void;
  /**
   * Number of page buttons shown adjacent to the current page on each side
   * before collapsing into an ellipsis.
   * @default 1
   */
  siblingCount?: number;
  /**
   * Hides the "Previous"/"Next" buttons.
   * @default false
   */
  hideControls?: boolean;
  /** Additional class names merged with the component's default styles. */
  className?: string;
}

const itemStyles =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors";

/**
 * Computes the list of page numbers (and ellipsis placeholders) to render
 * for a pagination control.
 *
 * Always includes the first and last page, plus `siblingCount` pages on
 * either side of `currentPage`. Gaps larger than one page are collapsed into
 * a single `"ellipsis"` entry. If `totalPages` is small enough that all pages
 * fit without collapsing, every page is returned with no ellipses.
 *
 * @example
 * ```ts
 * getPageRange(5, 10, 1); // [1, "ellipsis", 4, 5, 6, "ellipsis", 10]
 * ```
 */
export function getPageRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): Array<number | "ellipsis"> {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const pages: Array<number | "ellipsis"> = [1];

  if (leftSiblingIndex > 2) {
    pages.push("ellipsis");
  }

  for (let page = Math.max(leftSiblingIndex, 2); page <= Math.min(rightSiblingIndex, totalPages - 1); page++) {
    pages.push(page);
  }

  if (rightSiblingIndex < totalPages - 1) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);

  return pages;
}

/**
 * A navigation control for moving between pages of paginated content.
 *
 * Renders a `<nav>` containing page-number buttons with optional
 * "Previous"/"Next" controls. Page numbers collapse into ellipses for large
 * page counts based on `siblingCount`.
 *
 * @example
 * ```tsx
 * <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
 * ```
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { currentPage, totalPages, onPageChange, siblingCount = 1, hideControls = false, className, ...props },
  ref,
) {
  const pageRange = getPageRange(currentPage, totalPages, siblingCount);

  return (
    <nav ref={ref} aria-label="Pagination" className={cn("flex items-center gap-1", className)} {...props}>
      <ul className="flex items-center gap-1">
        {!hideControls && (
          <li>
            <button
              type="button"
              aria-label="Previous page"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className={cn(
                itemStyles,
                "disabled:pointer-events-none disabled:opacity-50",
                "text-foreground hover:bg-accent",
              )}
            >
              ‹
            </button>
          </li>
        )}
        {pageRange.map((page, index) =>
          page === "ellipsis" ? (
            <li key={`ellipsis-${index}`}>
              <span
                className="flex h-9 w-9 items-center justify-center text-muted-foreground"
                aria-hidden="true"
              >
                …
              </span>
            </li>
          ) : (
            <li key={page}>
              <button
                type="button"
                aria-current={page === currentPage ? "page" : undefined}
                onClick={() => onPageChange(page)}
                className={cn(
                  itemStyles,
                  page === currentPage
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent",
                )}
              >
                {page}
              </button>
            </li>
          ),
        )}
        {!hideControls && (
          <li>
            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className={cn(
                itemStyles,
                "disabled:pointer-events-none disabled:opacity-50",
                "text-foreground hover:bg-accent",
              )}
            >
              ›
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
});
