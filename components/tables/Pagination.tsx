import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const startPage = Math.max(
    1,
    Math.min(currentPage - 1, totalPages - 2)
  );

  const pagesAroundCurrent = Array.from(
    { length: Math.min(3, totalPages) },
    (_, i) => startPage + i
  );

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 bg-white text-gray-500 shadow-theme-xs hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex items-center gap-1">
        {currentPage > 3 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 transition-colors"
            >
              1
            </button>
            <span className="flex items-center justify-center h-9 w-5 text-xs text-gray-400 dark:text-gray-500">
              …
            </span>
          </>
        )}

        {pagesAroundCurrent.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                ? "bg-brand-500 text-white shadow-theme-xs"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
              }`}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages - 2 && (
          <>
            <span className="flex items-center justify-center h-9 w-5 text-xs text-gray-400 dark:text-gray-500">
              …
            </span>
            <button
              onClick={() => onPageChange(totalPages)}
              className="flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 bg-white text-gray-500 shadow-theme-xs hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
