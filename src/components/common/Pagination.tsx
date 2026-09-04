"use client";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
};

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

  const buttonStyle: React.CSSProperties = {
    width: 62,
    height: 30,
    borderRadius: 7,
    border: "1px solid #000000",
    background: "transparent",
    paddingTop: 6,
    paddingRight: 15,
    paddingBottom: 6,
    paddingLeft: 15,
    gap: 9,
    fontFamily: "Poppins, sans-serif",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "100%",
    letterSpacing: 0,
    color: "#000000",
  };

  return (
    <div
      className={`flex flex-col gap-3 px-1 text-[13px] text-black/70 sm:flex-row sm:items-center sm:justify-between sm:text-[14px] ${className}`}
    >
      <span style={{ fontFamily: "Poppins, sans-serif" }}>
        Showing {from} to {to} of {totalItems} entries
      </span>

      <div className="flex items-center" style={{ gap: 10 }}>
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="flex shrink-0 items-center justify-center disabled:opacity-40"
          style={buttonStyle}
        >
          Prev
        </button>

        <div
          className="flex shrink-0 items-center justify-center"
          style={{
            height: 30,
            minWidth: 62,
            borderRadius: 7,
            border: "1px solid #000000",
            paddingTop: 6,
            paddingRight: 15,
            paddingBottom: 6,
            paddingLeft: 15,
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "100%",
            letterSpacing: 0,
            color: "#000000",
          }}
        >
          {currentPage} / {totalPages}
        </div>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="flex shrink-0 items-center justify-center disabled:opacity-40"
          style={buttonStyle}
        >
          Next
        </button>
      </div>
    </div>
  );
}