"use client";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { useMemo, useState } from "react";
import AddCustomerIcon from "../../../../public/images/icons/usergroup.png";
import { POSHeader } from "@/src/components/sales/PosHeader";
import AddCustomerModal, {
  NewCustomerInput,
} from "@/src/components/customer/AddCustomerModal";
import { Button } from "@/src/components/ui/button";

type Customer = {
  id: number;
  name: string;
  credit: number;
  phone: string;
  countryCode: string;
  address: string;
  totalOrders: number;
  totalSpend: number;
  createdDate: string;
};

const TABLE_COLUMNS = [
  "No.",
  "Customer Name",
  "Credit",
  "Phone",
  "Address",
  "Total Orders",
  "Total Spend",
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

export default function CustomerPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter((customer) =>
      [customer.name, customer.phone, customer.address]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [customers, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / pageSize) || 0,
  );

  const handleAddCustomer = (data: NewCustomerInput) => {
    setCustomers((current) => [
      ...current,
      {
        id: current.length + 1,
        ...data,
        totalOrders: 0,
        totalSpend: 0,
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
          <h2 className="text-[26px] font-semibold">Customer</h2>
          <Button
            variant="addcustomer"
            size="none"
            iconSrc={AddCustomerIcon}
            iconAlt="Add customer"
            onClick={() => setIsAddOpen(true)}
          >
            Add Customer
          </Button>
        </div>

        <div className="mt-[22px] flex justify-end">
          <SearchInput variant="panel" className="w-full sm:ml-auto sm:w-[270px]" />
        </div>

        <div className="mt-[14px] flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] gap-2">
          <div className="grid grid-cols-[48px_1.3fr_0.7fr_0.9fr_1.2fr_0.9fr_0.9fr_1fr_70px] hidden items-center justify-between gap-2 bg-black px-[18px] py-[12px] text-[13px] font-normal text-white sm:flex sm:text-[16px]">
            {TABLE_COLUMNS.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 flex-col bg-[#82367F4D]">
            {filteredCustomers.length === 0 ? (
              <p className="px-[16px] py-[18px] text-[14px] text-white/80">
                No customers Data available
              </p>
            ) : (
              <div className="overflow-y-auto">
                {filteredCustomers.slice(0, pageSize).map((customer, index) => (
                  <div
                    key={customer.id}
                    className="grid grid-cols-[48px_1.3fr_0.7fr_0.9fr_1.2fr_0.9fr_0.9fr_1fr_70px] border-b border-white/5 px-[16px] py-[12px] text-[12px] text-white/90"
                  >
                    <span>{index + 1}</span>
                    <span className="truncate">{customer.name}</span>
                    <span>{customer.credit}</span>
                    <span className="truncate">
                      {customer.countryCode} {customer.phone}
                    </span>
                    <span className="truncate">{customer.address}</span>
                    <span>{customer.totalOrders}</span>
                    <span>{customer.totalSpend}</span>
                    <span>{customer.createdDate}</span>
                    <span />
                  </div>
                ))}
              </div>
            )}
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

      <AddCustomerModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddCustomer}
      />
    </main>
  );
}