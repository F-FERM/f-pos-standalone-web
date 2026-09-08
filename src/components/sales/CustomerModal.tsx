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
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[2px]">
      {/* outer positioned wrapper — no overflow clipping, so the close button can sit outside the card */}
      <div
        className="relative"
        style={{
          position: "absolute",
          top: 119,
          left: 106,
          width: 812,
          height: 503,
        }}
      >
        {/* close button — sits on the outer wrapper, never clipped */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center"
          style={{
            position: "absolute",
            top: -14,
            right: -14,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#FFFFFF",
            border: "1px solid #E0E0E0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            color: "#FF3B3B",
            zIndex: 10,
          }}
          aria-label="Close customers modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* card — 812x503, radius20, bg #EFEFEF, padding 26/34, gap6, clips its own content only */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#EFEFEF",
            border: "1px solid #EFEFEF",
            borderRadius: 20,
            backdropFilter: "blur(4px)",
            paddingTop: 26,
            paddingRight: 34,
            paddingBottom: 26,
            paddingLeft: 34,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            overflow: "hidden",
          }}
        >
          {/* title */}
          <h3
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: 22,
              lineHeight: "100%",
              letterSpacing: 0,
              color: "#000000",
              marginBottom: 17,
            }}
          >
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

          {/* header row — exact spec: 743x35, padding 0/5, radius10, bg #EFEFEF, border 1px #D8D8D8 */}
          <div
            className="hidden items-center sm:flex"
            style={{
              width: 743,
              height: 35,
              justifyContent: "space-between",
              borderRadius: 10,
              background: "#EFEFEF",
              border: "1px solid #D8D8D8",
              paddingRight: 13,
              paddingLeft: 13,
            }}
          >
            {columns.map((col) => (
              <span
                key={col}
                className=" truncate text-center"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  color: "#000000",
                }}
              >
                {col}
              </span>
            ))}
          </div>

          {/* list — exact spec: 742x255, padding 10/0, gap10, radius10, bg #D2D2D2 */}
          <div
            className="flex flex-col overflow-y-auto"
            style={{
              width: 742,
              height: 255,
              borderRadius: 10,
              background: "#D2D2D2",
              paddingTop: 10,
              paddingBottom: 10,
              gap: 10,
            }}
          >
            {pageItems.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: "100%",
                    letterSpacing: 0,
                    color: "#9A9A9A",
                  }}
                >
                  No customers found
                </span>
              </div>
            ) : (
              pageItems.map((customer, i) => (
                <div
                  key={customer.id}
                  className="flex flex-col gap-1 px-[18px] text-[13px] text-black sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-[14px]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
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
          <div className="mt-[8px]">
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