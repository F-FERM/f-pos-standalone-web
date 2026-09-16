"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SearchInput } from "../common/SearchInput";
import { Pagination } from "../common/Pagination";
import { ListCustomerApi } from "@/src/api/customer/api/GetAll";

type CustomerModalProps = {
  open: boolean;
  onClose: () => void;
  pageSize?: number;
};

const columns = ["No.", "Customer Name", "Customer Address", "Phone No.", "Credit"];

export function CustomerModal({
  open,
  onClose,
  pageSize = 10,
}: CustomerModalProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const { data: customerData, isLoading } = useQuery({
    queryKey: ["getAllCustomer", ""], // we fetch all up to a reasonable limit and filter client-side for immediate responsiveness
    queryFn: () => ListCustomerApi({ search: "", page: 1, limit: 1000 }),
    enabled: open,
  });

  const customers = customerData?.data || [];

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
      <div className="relative w-full max-w-[812px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          aria-label="Close customers modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="flex max-h-[85vh] w-full flex-col gap-1.5 overflow-y-auto rounded-[20px] border border-[#A6A6A6] bg-[#E9E9E9] p-5 backdrop-blur-[4px] sm:px-[34px] sm:py-[26px]">
          <h3 className="mb-4  text-lg font-semibold leading-none text-black sm:text-[22px]">
            Customers
          </h3>

          <SearchInput
            variant="panel"
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            className="mb-3"
          />

          <div
            className="hidden w-full items-center justify-between rounded-[10px] border border-[#D8D8D8] bg-[#EFEFEF] px-[13px] py-2 sm:flex"
          >
            {columns.map((col) => (
              <span
                key={col}
                className="flex-1 truncate text-center  text-sm font-normal text-black"
              >
                {col}
              </span>
            ))}
          </div>

          <div className="flex max-h-[45vh] min-h-[160px] w-full flex-col gap-2.5 overflow-y-auto rounded-[10px] bg-[#D2D2D2] py-2.5 sm:max-h-[350px] custom-scrollbar">
            {isLoading ? (
               <div className="flex h-full items-center justify-center">
                 <span className=" text-sm font-normal leading-none text-[#5D5D5D]">
                   Loading customers...
                 </span>
               </div>
            ) : pageItems.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <span className=" text-sm font-normal leading-none text-[#9A9A9A]">
                  No customers found
                </span>
              </div>
            ) : (
              pageItems.map((customer, i) => (
                <div
                  key={customer._id}
                  className="flex flex-col gap-1 px-[18px]  text-[13px] text-black sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-sm"
                >
                  <span className="sm:min-w-0 sm:flex-1 text-center font-semibold sm:font-normal">
                    <span className="sm:hidden font-semibold mr-1">No:</span>
                    {(page - 1) * pageSize + i + 1}
                  </span>
                  <span className="sm:min-w-0 sm:flex-1 sm:truncate text-center">
                    <span className="sm:hidden font-semibold mr-1">Name:</span>
                    {customer.name}
                  </span>
                  <span className="sm:min-w-0 sm:flex-1 sm:truncate text-center">
                    <span className="sm:hidden font-semibold mr-1">Address:</span>
                    {customer.address}
                  </span>
                  <span className="sm:min-w-0 sm:flex-1 sm:truncate text-center">
                    <span className="sm:hidden font-semibold mr-1">Phone:</span>
                    {customer.phone}
                  </span>
                  <span className="sm:min-w-0 sm:flex-1 text-center font-medium">
                    <span className="sm:hidden font-semibold mr-1">Credit:</span>
                    ₹{customer.credit}
                  </span>
                </div>
              ))
            )}
          </div>

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