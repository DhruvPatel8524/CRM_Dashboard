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

  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, currentPage + 1);

  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-1">
      
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex items-center gap-1">

        {/* Left dots */}
        {startPage > 1 && (
          <span className="flex items-center justify-center h-9 w-5 text-xs text-gray-400">
            ...
          </span>
        )}

        {/* Page Numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium ${
              currentPage === page
                ? "bg-brand-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Right dots */}
        {endPage < totalPages && (
          <span className="flex items-center justify-center h-9 w-5 text-xs text-gray-400">
            ...
          </span>
        )}

      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;