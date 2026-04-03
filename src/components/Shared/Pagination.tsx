import type { PaginationProps } from "../../types/sharedComponents";
import { useMemo } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Button from "./Button";
import "./Pagination.scss";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const pageNumbers = useMemo(() => {
    const maxVisiblePages = 5;
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav className={`pagination ${className}`.trim()} aria-label="Pagination">
      <div className="pagination-info">
        {totalItems !== undefined && pageSize !== undefined ? (
          <span>
            Showing{" "}
            <strong>
              {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalItems)}
            </strong>{" "}
            of <strong>{totalItems}</strong>
          </span>
        ) : (
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="pagination-controls">
        <Button
          className="pagination-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          variant="secondary"
          size="small"
          type="button"
        >
          <MdChevronLeft />
          <span>Previous</span>
        </Button>

        <div className="pagination-numbers">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="pagination-ellipsis"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }

            const page = Number(pageNum);
            if (isNaN(page)) {
              console.warn(`Invalid page number: ${pageNum}`);
              return null;
            }
            const isCurrentPage = page === currentPage;

            return (
              <Button
                key={page}
                className={`pagination-number ${isCurrentPage ? "pagination-number--active" : ""}`}
                onClick={() => onPageChange(page)}
                disabled={isCurrentPage}
                variant={isCurrentPage ? "primary" : "secondary"}
                size="small"
                type="button"
                aria-current={isCurrentPage ? "page" : undefined}
                aria-label={`Page ${page}`}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          className="pagination-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          variant="secondary"
          size="small"
          type="button"
        >
          <span>Next</span>
          <MdChevronRight />
        </Button>
      </div>
    </nav>
  );
};

export default Pagination;
