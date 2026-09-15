"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { SearchInput } from "../common/SearchInput";
import { Pagination } from "../common/Pagination";
import { Customer } from "./Types";

type CustomerModalProps = {
  open: boolean;
  onClose: () => void;
  customers?: Customer[];
  pageSize?: number;
};

const columns = ["No.", "Customer Name", "Customer Address", "Phone No.", "Credit"];

export function CustomerModal({
  open,
  onClose,
  customers = [],
  pageSize = 10,
}: CustomerModalProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  if (!open) return null;

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-[2px]">
      {/* outer positioned wrapper — fluid width capped at 812px, height follows content */}
      <div className="relative w-full max-w-[812px]">
        {/* close button — sits on the outer wrapper, never clipped */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#E0E0E0] bg-white text-[#FF3B3B] shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          aria-label="Close customers modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* card — fluid, scrolls internally if content exceeds viewport height */}
        <div className="flex max-h-[85vh] w-full flex-col gap-1.5 overflow-y-auto rounded-[20px] border border-[#EFEFEF] bg-[#EFEFEF] p-5 backdrop-blur-[4px] sm:px-[34px] sm:py-[26px]">
          {/* title */}
          <h3 className="mb-4 font-['Poppins',sans-serif] text-lg font-semibold leading-none text-black sm:text-[22px]">
            Customers
          </h3>

          {/* search */}
          <SearchInput
            variant="panel"
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            className="mb-3"
          />

          {/* header row — hidden on mobile, shown once columns fit */}
          <div
            className="hidden w-full items-center justify-between rounded-[10px] border border-[#D8D8D8] bg-[#EFEFEF] px-[13px] py-2 sm:flex"
          >
            {columns.map((col) => (
              <span
                key={col}
                className="flex-1 truncate text-center font-['Poppins',sans-serif] text-sm font-normal text-black"
              >
                {col}
              </span>
            ))}
          </div>

          {/* list — fluid width, fixed max-height with its own scroll */}
          <div className="flex max-h-[45vh] min-h-[160px] w-full flex-col gap-2.5 overflow-y-auto rounded-[10px] bg-[#D2D2D2] py-2.5 sm:max-h-[255px]">
            {pageItems.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <span className="font-['Poppins',sans-serif] text-sm font-normal leading-none text-[#9A9A9A]">
                  No customers found
                </span>
              </div>
            ) : (
              pageItems.map((customer, i) => (
                <div
                  key={customer.id}
                  className="flex flex-col gap-1 px-[18px] font-['Poppins',sans-serif] text-[13px] text-black sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-sm"
                >
                  <span className="sm:min-w-0 sm:flex-1">
                    {(page - 1) * pageSize + i + 1}
                  </span>
                  <span className="sm:min-w-0 sm:flex-1 sm:truncate">{customer.name}</span>
                  <span className="sm:min-w-0 sm:flex-1 sm:truncate">{customer.address}</span>
                  <span className="sm:min-w-0 sm:flex-1 sm:truncate">{customer.phone}</span>
                  <span className="sm:min-w-0 sm:flex-1">₹{customer.credit}</span>
                </div>
              ))
            )}
          </div>

          {/* pagination */}
          <div className="mt-2">
            <Pagination
              currentPage={page}
              totalItems={filtered.length}
              itemsPerPage={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}