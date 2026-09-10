"use client";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { useMemo, useState } from "react";
import AddSupplierIcon from "../../../../public/images/icons/usergroup.png";
import { POSHeader } from "@/src/components/sales/PosHeader";
import AddSupplierModal, {
  NewSupplierInput,
} from "@/src/components/supplier/AddSupplierModal";
import { Button } from "@/src/components/ui/button";

type Supplier = {
  id: number;
  name: string;
  credit: number;
  phone: string;
  countryCode: string;
  trnNo: string;
  address: string;
  createdDate: string;
};

const TABLE_COLUMNS = [
  "No.",
  "Supplier Name",
  "Credit",
  "Mobile Number",
  "Address",
  "Created Date",
  "Actions",
] as const;

const TABLE_GRID = "grid-cols-[48px_1.4fr_0.8fr_1fr_1.6fr_1fr_70px]";

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function SupplierPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return suppliers;

    return suppliers.filter((supplier) =>
      [supplier.name, supplier.phone, supplier.address]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [suppliers, search]);

  const totalCredit = useMemo(
    () => filteredSuppliers.reduce((sum, supplier) => sum + supplier.credit, 0),
    [filteredSuppliers],
  );

  const handleAddSupplier = (data: NewSupplierInput) => {
    setSuppliers((current) => [
      ...current,
      {
        id: current.length + 1,
        ...data,
        createdDate: formatDate(new Date()),
      },
    ]);
    setIsAddOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const CARD_TOP = 0;
  const CARD_LEFT = 20;
  const CARD_HEIGHT = 661;

  return (
    <main className="flex h-full flex-col overflow-x-hidden overflow-y-auto bg-black text-black">
      <POSHeader />

      <div
        className="relative flex-1 bg-[#EFEFEF]"
        style={{ minHeight: CARD_TOP + CARD_HEIGHT + 40 }}
      >
        <div
          className="absolute"
          style={{
            top: CARD_TOP,
            left: CARD_LEFT,
            right: CARD_LEFT,
            height: CARD_HEIGHT,
            borderRadius: 15,
            background: "#D2D2D2",
          }}
        />

        <div
          className="absolute flex items-center justify-between"
          style={{ top: CARD_TOP + 20, left: 30, right: 30 }}
        >
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: 26,
              lineHeight: "100%",
              letterSpacing: 0,
              color: "#000000",
            }}
          >
            Supplier
          </span>

          <Button
            variant="addcustomer"
            size="none"
            iconSrc={AddSupplierIcon}
            iconAlt="Add supplier"
            onClick={() => setIsAddOpen(true)}
          >
            Add Supplier
          </Button>
        </div>

        <div
          className="absolute"
          style={{ top: CARD_TOP + 88, left: 30, right: 30, display: "flex" }}
        >
          <SearchInput
            variant="panel"
            value={search}
            onChange={(value) => setSearch(value)}
            className="ml-auto"
          />
        </div>

        <div
          className="absolute hidden items-center sm:flex"
          style={{
            top: CARD_TOP + 139,
            left: 30,
            right: 30,
            height: 40,
            justifyContent: "space-between",
            borderRadius: 10,
            background: "#EFEFEF",
            paddingRight: 11,
            paddingLeft: 11,
          }}
        >
          {TABLE_COLUMNS.map((column) => (
            <span
              key={column}
              className="truncate text-center"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 12,
                lineHeight: "normal",
                letterSpacing: 0,
                color: "#000000",
              }}
            >
              {column}
            </span>
          ))}
        </div>

        <div
          className="absolute flex flex-col overflow-x-hidden overflow-y-auto"
          style={{
            top: CARD_TOP + 184,
            left: 30,
            right: 30,
            height: 255,
            borderRadius: 10,
            background: "#B8B8B8",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          {filteredSuppliers.length === 0 ? (
            <p
              className="px-[16px]"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "100%",
                letterSpacing: 0,
                color: "#5D5D5D",
              }}
            >
              No data Data Available
            </p>
          ) : (
            filteredSuppliers.slice(0, pageSize).map((supplier, index) => (
              <div
                key={supplier.id}
                className={`grid border-b border-black/5 px-[16px] py-[10px] text-[12px] text-black ${TABLE_GRID}`}
              >
                <span>{index + 1}</span>
                <span className="truncate">{supplier.name}</span>
                <span>{supplier.credit}</span>
                <span className="truncate">
                  {supplier.countryCode} {supplier.phone}
                </span>
                <span className="truncate">{supplier.address}</span>
                <span>{supplier.createdDate}</span>
                <span />
              </div>
            ))
          )}

          <span className="absolute bottom-3 right-3 rounded-sm bg-[#868686] px-4 py-2 text-[13px] font-medium text-white">
            Total Credit: INR {totalCredit.toFixed(2)}
          </span>
        </div>

        <div
          className="absolute"
          style={{ top: CARD_TOP + 184 + 255 + 14, left: 30, right: 30 }}
        >
          <Pagination
            currentPage={currentPage}
            totalItems={filteredSuppliers.length}
            itemsPerPage={pageSize}
            onPageChange={handlePageChange}
          />
        </div>

        <div
          className="absolute flex items-center justify-center"
          style={{
            top: CARD_TOP + CARD_HEIGHT + 14,
            left: CARD_LEFT,
            right: CARD_LEFT,
          }}
        >
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: 12,
              lineHeight: "100%",
              letterSpacing: 0,
              color: "#939393",
            }}
          >
            © 2026 Techon Innovations. All rights reserved.
          </span>
        </div>
      </div>

      <AddSupplierModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddSupplier}
      />
    </main>
  );
}
