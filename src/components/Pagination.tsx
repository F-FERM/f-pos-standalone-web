"use client";

type PaginationProps = {
  page: number;
  totalPages: number;
  totalEntries: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
};

/**
 * Shared pagination bar ("Showing x to y of z entries" + Prev / page / Next).
 * Used anywhere a list needs paging (currently the Customers modal, but
 * built generically so Orders or Products lists can reuse it too).
 */
export function Pagination({
  page,
  totalPages,
  totalEntries,
  pageSize,
  onPageChange,
  className = "",
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 0);
  const from = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalEntries);

  return (
    <div
      className={`flex flex-col gap-3 px-1 text-[13px] text-white/80 sm:flex-row sm:items-center sm:justify-between sm:text-[16px] ${className}`}
    >
      <span>
        Showing {from} to {to} of {totalEntries} entries
      </span>

      <div className="flex items-center gap-[10px] sm:gap-[12px]">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="rounded-[8px] border border-[#D9D9D9]/60 bg-[#2B102B]/40 px-[10px] py-[6px] text-white disabled:opacity-40 sm:px-[14px] sm:py-[8px]"
        >
          Prev
        </button>

        <div className="rounded-[8px] border border-[#D9D9D9]/60 bg-[#2B102B]/40 px-[10px] py-[6px] text-white sm:px-[14px] sm:py-[8px]">
          {page} / {safeTotalPages}
        </div>

        <button
          type="button"
          disabled={page >= safeTotalPages}
          onClick={() => onPageChange(Math.min(safeTotalPages, page + 1))}
          className="rounded-[8px] border border-[#D9D9D9]/60 bg-[#2B102B]/40 px-[10px] py-[6px] text-white disabled:opacity-40 sm:px-[14px] sm:py-[8px]"
        >
          Next
        </button>
      </div>
    </div>
  );
}