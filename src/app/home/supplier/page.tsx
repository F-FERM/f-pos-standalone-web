"use client";

import { Button } from "@/src/components/Button";
import { Pagination } from "@/src/components/Pagination";
import { SearchInput } from "@/src/components/SearchInput";
import { useMemo, useState } from "react";
import AddSupplierIcon from "../../../../public/images/icons/usergroup.png";
import { POSHeader } from "@/src/components/sales/PosHeader";
import AddSupplierModal, {
  NewSupplierInput,
} from "@/src/components/supplier/AddSupplierModal";

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

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function SupplierPage() {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(
    10,
  );
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSuppliers.length / pageSize) || 0,
  );

  const totalCredit = useMemo(
    () => suppliers.reduce((sum, supplier) => sum + (supplier.credit || 0), 0),
    [suppliers],
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

  return (
    <main className="flex h-full flex-col overflow-hidden bg-black text-white">
      <POSHeader />

      <div className="flex min-h-0 flex-1 flex-col bg-[#2C192B] px-[29px] pb-[18px] pt-[22px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[26px] font-semibold">Supplier</h2>
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

        <div className="mt-[14px] flex justify-end">
          <SearchInput variant="panel" className="w-full sm:ml-auto sm:w-[270px]" />
        </div>

        <div className="mt-[14px] flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] gap-2">
          <div className="grid grid-cols-[48px_1.3fr_0.8fr_1fr_1.4fr_1fr_70px] hidden items-center justify-between gap-2 bg-black px-[18px] py-[12px] text-[13px] font-normal text-white sm:flex sm:text-[16px]">
            {TABLE_COLUMNS.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 flex-col bg-[#82367F4D]">
            {filteredSuppliers.length === 0 ? (
              <p className="px-[16px] py-[18px] text-[14px] text-white/80">
                No suppliers Data available
              </p>
            ) : (
              <div className="overflow-y-auto">
                {filteredSuppliers.slice(0, pageSize).map((supplier, index) => (
                  <div
                    key={supplier.id}
                    className="grid grid-cols-[48px_1.3fr_0.8fr_1fr_1.4fr_1fr_70px] border-b border-white/5 px-[16px] py-[12px] text-[12px] text-white/90"
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
                ))}
              </div>
            )}

            <div className="mt-auto flex justify-end px-[16px] py-[12px]">
              <span className="flex h-[42px] w-[202px] items-center justify-center rounded-[10px] bg-[#6E6E6E] pb-[9px] pl-[18px] pr-[17px] pt-[9px] text-[16px] font-medium text-white">
                Total Credit: INR {totalCredit.toFixed(2)}
              </span>
            </div>
          </div>
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

      <AddSupplierModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddSupplier}
      />
    </main>
  );
}