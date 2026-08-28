"use client";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
};

/**
 * Shared pagination bar ("Showing x to y of z entries" + Prev / page / Next).
 * Used anywhere a list needs paging (currently the Customers modal, but
 * built generically so Orders or Products lists can reuse it too).
 */
export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
}: PaginationProps) {
  const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 0);
  const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`flex flex-col gap-3 px-1 text-[13px] text-white/80 sm:flex-row sm:items-center sm:justify-between sm:text-[16px] ${className}`}
    >
      <span>
        Showing {from} to {to} of {totalItems} entries
      </span>

      <div className="flex items-center gap-[10px] sm:gap-[12px]">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="rounded-[8px] border border-[#D9D9D9]/60 bg-[#2B102B]/40 px-[10px] py-[6px] text-white disabled:opacity-40 sm:px-[14px] sm:py-[8px]"
        >
          Prev
        </button>

        <div className="rounded-[8px] border border-[#D9D9D9]/60 bg-[#2B102B]/40 px-[10px] py-[6px] text-white sm:px-[14px] sm:py-[8px]">
          {currentPage} / {totalPages}
        </div>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="rounded-[8px] border border-[#D9D9D9]/60 bg-[#2B102B]/40 px-[10px] py-[6px] text-white disabled:opacity-40 sm:px-[14px] sm:py-[8px]"
        >
          Next
        </button>
      </div>
    </div>
  );
}