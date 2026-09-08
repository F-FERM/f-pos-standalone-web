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

const TABLE_GRID = "grid-cols-[48px_1.3fr_0.7fr_0.9fr_1.2fr_0.9fr_0.9fr_1fr_70px]";

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

  const totalCredit = useMemo(
    () => filteredCustomers.reduce((sum, customer) => sum + customer.credit, 0),
    [filteredCustomers],
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

  const CARD_TOP = 0;
  const CARD_LEFT = 20;
  const CARD_WIDTH = 984;
  const CARD_HEIGHT = 661;

  return (
    <main className="flex h-full flex-col overflow-y-auto bg-black text-black">
      <POSHeader />

      {/* relative canvas — explicit min-height guarantees the card + footer always fit and render */}
      <div
        className="relative flex-1 bg-[#EFEFEF]"
        style={{ minHeight: CARD_TOP + CARD_HEIGHT + 40 }}
      >
        {/* content card — exact spec: 984x661, radius15, bg #D2D2D2 */}
        <div
          className="absolute"
          style={{
            top: CARD_TOP,
            left: CARD_LEFT,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            borderRadius: 15,
            background: "#D2D2D2",
          }}
        />

        <div
          className="absolute flex items-center justify-between"
          style={{ top: CARD_TOP + 20, left: 30, width: 964 }}
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
            Customer
          </span>

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

        <div
          className="absolute"
          style={{ top: CARD_TOP + 88, left: 30, width: 964, display: "flex" }}
        >
          <SearchInput
            variant="panel"
            value={search}
            onChange={(value) => setSearch(value)}
            className="ml-auto"
          />
        </div>

        {/* header row — exact spec: 964x40, radius10, bg #EFEFEF */}
        <div
          className="absolute hidden items-center sm:flex"
          style={{
            top: CARD_TOP + 139,
            left: 30,
            width: 964,
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

        {/* list — exact spec: 964x255, radius10, bg #B8B8B8 */}
        <div
          className="absolute flex flex-col overflow-y-auto"
          style={{
            top: CARD_TOP + 184,
            left: 30,
            width: 964,
            height: 255,
            borderRadius: 10,
            background: "#B8B8B8",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          {filteredCustomers.length === 0 ? (
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
              No customers Data Available
            </p>
          ) : (
            filteredCustomers.slice(0, pageSize).map((customer, index) => (
              <div
                key={customer.id}
                className={`grid border-b border-black/5 px-[16px] py-[10px] text-[12px] text-black ${TABLE_GRID}`}
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
            ))
          )}

          <span
            className="absolute bottom-3 right-3 rounded-sm bg-[#868686] px-4 py-2 text-[13px] font-medium text-white"
          >
            No Credit : {totalCredit}
          </span>
        </div>

        <div
          className="absolute"
          style={{ top: CARD_TOP + 184 + 255 + 14, left: 30, width: 964 }}
        >
          <Pagination
            currentPage={currentPage}
            totalItems={filteredCustomers.length}
            itemsPerPage={pageSize}
            onPageChange={handlePageChange}
          />
        </div>

        {/* footer copyright — sits BELOW the card, outside its background, not overlapping it */}
        <div
          className="absolute flex items-center justify-center"
          style={{ top: CARD_TOP + CARD_HEIGHT + 14, left: CARD_LEFT, width: CARD_WIDTH }}
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

      <AddCustomerModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddCustomer}
      />
    </main>
  );
}