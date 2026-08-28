"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { SearchInput } from "../SearchInput";
import { Pagination } from "../Pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  if (!open) return null;

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
 const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-[880px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute z-10 right-2 top-2 flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white bg-[#2B102B]/60 text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px] sm:h-[42px] sm:w-[42px]"
          aria-label="Close customers modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="max-h-[90vh] w-full overflow-y-auto rounded-[20px] border border-gray-600 bg-[#2C192BE5] px-4 pb-4 pt-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:rounded-[30px] sm:px-[24px] sm:pb-[18px] sm:pt-[22px]">
          <div className="mb-[18px] flex items-center justify-between">
            <h3 className="text-[18px] font-semibold text-white sm:text-[22px]">Customers</h3>
          </div>

        <SearchInput
          variant="panel"
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
          className="mb-4"
        />

        <div className="flex flex-col gap-[8px] overflow-hidden rounded-[10px]">
          {/* Header row - hidden on very small screens in favor of stacked cards */}
          <div className="hidden items-center justify-between gap-2 bg-[#2B102B]/60 px-[18px] py-[12px] text-[13px] font-normal text-white sm:flex sm:text-[16px]">
            {columns.map((col) => (
              <span key={col} className="  truncate">
                {col}
              </span>
            ))}
          </div>

          {pageItems.length === 0 ? (
            <div className="flex min-h-[160px] items-center justify-center bg-[#82367F4D] px-[18px] py-[28px] text-[14px] font-normal text-[#9A9A9A] sm:min-h-[220px] sm:text-[16px]">
              No customers found
            </div>
          ) : (
            pageItems.map((customer, i) => (
              <div
                key={customer.id}
                className="flex flex-col gap-1 bg-[#82367F4D] px-[18px] py-[12px] text-[13px] text-white sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-[16px]"
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
<div className="mt-[14px]">

       <Pagination
            currentPage={1}
            totalItems={10}
         
            itemsPerPage={pageSize}
            onPageChange={handlePageChange}
          />
</div>
        </div>
      </div>
    </div>
  );
}