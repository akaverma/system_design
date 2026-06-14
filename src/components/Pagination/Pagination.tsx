import * as React from "react";
import { cn } from "../../utils/cn";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** 1-indexed page number. */
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current page before collapsing into an ellipsis. */
  siblingCount?: number;
  hideControls?: boolean;
  className?: string;
}

const itemStyles =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors";

/** Returns the page numbers and ellipsis placeholders to render around `currentPage`. */
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

/** Page navigation with Previous/Next controls and collapsible page numbers. */
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
