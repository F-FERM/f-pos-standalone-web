"use client";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AddCustomerIcon from "../../../../public/images/icons/usergroup.png";
import { POSHeader } from "@/src/components/sales/PosHeader";
import AddCustomerModal, {
  NewCustomerInput,
} from "@/src/components/customer/AddCustomerModal";
import { Button } from "@/src/components/ui/button";
import { AddCustomer } from "@/src/api/customer/api/Create";
import { DeleteCustomer } from "@/src/api/customer/api/Delete";
import { ListCustomerApi } from "@/src/api/customer/api/GetAll";
import { UpdateCustomer } from "@/src/api/customer/api/Update";
import type { Customer } from "@/src/interfaces/customer/ListCustomerResponse";

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

const TABLE_GRID =
  "grid-cols-[48px_1.3fr_0.7fr_0.9fr_1.2fr_0.9fr_0.9fr_1fr_70px]";

const COUNTRY_CODES = [
  "+971", "+966", "+91", "+44", "+86", "+81", "+49", "+33", "+39",
  "+7", "+55", "+61", "+82", "+34", "+31", "+46", "+41", "+65", "+60", "+1",
];

function formatDate(date: string) {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-GB");
}

function getPhoneParts(phone: string) {
  const countryCode = COUNTRY_CODES.find((code) => phone.startsWith(code)) || "+91";
  return {
    countryCode,
    phone: phone.startsWith(countryCode)
      ? phone.slice(countryCode.length)
      : phone.replace(/\D/g, ""),
  };
}

export default function CustomerPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    let cancelled = false;

    ListCustomerApi({})
      .then((response) => {
        if (!cancelled) setCustomers(response.data || []);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "Unable to load customers");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

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

  const handleSaveCustomer = async (data: NewCustomerInput) => {
    const payload = {
      name: data.name,
      credit: data.credit,
      phone: `${data.countryCode}${data.phone.replace(/^\+/, "")}`,
      address: data.address,
    };

    try {
      if (editingCustomer) {
        const response = await UpdateCustomer(editingCustomer._id, payload);
        setCustomers((current) =>
          current.map((customer) =>
            customer._id === editingCustomer._id ? response.data : customer,
          ),
        );
        toast.success("Customer updated successfully");
      } else {
        const response = await AddCustomer(payload);
        setCustomers((current) => [response.data, ...current]);
        toast.success("Customer created successfully");
      }

      setEditingCustomer(null);
      setIsAddOpen(false);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Unable to save customer");
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (!window.confirm(`Delete ${customer.name}?`)) return;

    try {
      await DeleteCustomer({ id: customer._id });
      setCustomers((current) => current.filter((item) => item._id !== customer._id));
      toast.success(`${customer.name} deleted successfully`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Unable to delete customer");
    }
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
          style={{ top: CARD_TOP + 88, left: 30, right: 30, display: "flex" }}
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

        {/* list — exact spec: 964x255, radius10, bg #B8B8B8 */}
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
                key={customer._id}
                className={`grid border-b border-black/5 px-[16px] py-[10px] text-[12px] text-black ${TABLE_GRID}`}
              >
                <span>{index + 1}</span>
                <span className="truncate">{customer.name}</span>
                <span>{customer.credit}</span>
                <span className="truncate">{customer.phone}</span>
                <span className="truncate">{customer.address}</span>
                <span>0</span>
                <span>0</span>
                <span>{formatDate(customer.createdAt)}</span>
                <span className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="editicon"
                    size="icon"
                    aria-label={`Edit ${customer.name}`}
                    onClick={() => {
                      setEditingCustomer(customer);
                      setIsAddOpen(true);
                    }}
                  >
                    <Pencil size={15} />
                  </Button>
                  <Button
                    type="button"
                    variant="deleteicon"
                    size="icon"
                    aria-label={`Delete ${customer.name}`}
                    onClick={() => handleDeleteCustomer(customer)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </span>
              </div>
            ))
          )}

          <span className="absolute bottom-3 right-3 rounded-sm bg-[#868686] px-4 py-2 text-[13px] font-medium text-white">
            No Credit : {totalCredit}
          </span>
        </div>

        <div
          className="absolute"
          style={{ top: CARD_TOP + 184 + 255 + 14, left: 30, right: 30 }}
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

      <AddCustomerModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditingCustomer(null);
        }}
        onAdd={handleSaveCustomer}
        mode={editingCustomer ? "edit" : "add"}
        initialCustomer={
          editingCustomer
            ? {
                ...getPhoneParts(editingCustomer.phone),
                name: editingCustomer.name,
                credit: editingCustomer.credit,
                address: editingCustomer.address,
              }
            : null
        }
      />
    </main>
  );
}
