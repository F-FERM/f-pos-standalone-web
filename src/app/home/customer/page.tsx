"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Search,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", label: "India" },
  { code: "+1", flag: "🇺🇸", label: "United States" },
  { code: "+44", flag: "🇬🇧", label: "United Kingdom" },
  { code: "+971", flag: "🇦🇪", label: "UAE" },
] as const;

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

const emptyForm = {
  name: "",
  credit: "0",
  phone: "",
  countryCode: "+91",
  address: "",
};

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function CustomerPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(
    10,
  );
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState(emptyForm);

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

  const totalCredit = customers.reduce(
    (sum, customer) => sum + customer.credit,
    0,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / pageSize) || 0,
  );
  const currentPageLabel = filteredCustomers.length === 0 ? 0 : 1;

  const selectedCountry =
    COUNTRY_CODES.find((country) => country.code === form.countryCode) ??
    COUNTRY_CODES[0];

  const closeModal = () => {
    setIsAddOpen(false);
    setForm(emptyForm);
  };

  const handleAddCustomer = () => {
    if (!form.name.trim()) return;

    setCustomers((current) => [
      ...current,
      {
        id: current.length + 1,
        name: form.name.trim(),
        credit: Number(form.credit) || 0,
        phone: form.phone.trim(),
        countryCode: form.countryCode,
        address: form.address.trim(),
        totalOrders: 0,
        totalSpend: 0,
        createdDate: formatDate(new Date()),
      },
    ]);
    closeModal();
  };

  return (
    <main className="flex h-full flex-col overflow-hidden bg-black text-white">
      <header className="relative flex h-[115px] shrink-0 items-center px-[29px]">
        <Button
          size="icon"
          onClick={() => router.push("/home")}
          className="h-[40px] w-[40px] rounded-[6px] bg-[#292929] hover:bg-[#333333]"
        >
          <ArrowLeft size={22} />
        </Button>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-[10px]">
          <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#D9D9D9]">
            <UserRound className="text-black" size={22} />
          </div>

          <h1 className="text-[32px] font-semibold tracking-[-1px]">
            My Restaurant
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-[8px]">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#D9D9D9]">
            <UserRound size={18} className="text-black" />
          </div>

          <div>
            <p className="text-[20px] font-semibold leading-[20px]">Admin</p>
            <p className="text-[13px] text-[#AAAAAA]">Company Admin</p>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col bg-[#2C192B] px-[29px] pb-[18px] pt-[22px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[28px] font-semibold">Customer</h2>

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="
              flex
              h-[42px]
              items-center
              gap-[8px]
              rounded-[12px]
              border
              border-[#D4CCD4]
              bg-[#241323]
              px-[16px]
              text-[15px]
              font-medium
              text-white
            "
          >
            <UserPlus size={18} />
            Add Customer
          </button>
        </div>

        <div className="mt-[14px] flex justify-end">
          <div className="relative w-[240px]">
            <Search
              size={16}
              className="
                pointer-events-none
                absolute
                left-[14px]
                top-1/2
                -translate-y-1/2
                text-[#B0B0B0]
              "
            />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="
                h-[38px]
                rounded-[10px]
                border-[#8A8A8A]
                bg-transparent
                pl-[38px]
                text-[14px]
                text-white
                shadow-none
                placeholder:text-[#B0B0B0]
                focus-visible:border-[#8A8A8A]
                focus-visible:ring-0
              "
            />
          </div>
        </div>

        <div className="mt-[14px] flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px]">
          <div className="grid grid-cols-[48px_1.3fr_0.7fr_0.9fr_1.2fr_0.9fr_0.9fr_1fr_70px] bg-black px-[16px] py-[10px] text-[12px] font-medium text-white">
            {TABLE_COLUMNS.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 flex-col bg-[#3A2040]">
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

        <div className="mt-[14px] flex items-center justify-between">
          <div className="relative">
            <select
              value={pageSize}
              onChange={(event) =>
                setPageSize(
                  Number(event.target.value) as (typeof PAGE_SIZE_OPTIONS)[number],
                )
              }
              className="
                h-[32px]
                appearance-none
                rounded-[8px]
                border
                border-[#8A8A8A]
                bg-transparent
                px-[12px]
                pr-[28px]
                text-[13px]
                text-white
                outline-none
              "
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size} className="bg-[#2C192B]">
                  {size}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-white"
            />
          </div>

          <div className="flex items-center gap-[12px]">
            <span className="rounded-[8px] bg-[#B8B8B8] px-[12px] py-[6px] text-[13px] font-medium text-black">
              No Credit : {totalCredit}
            </span>

            <button
              type="button"
              className="rounded-[8px] border border-[#8A8A8A] px-[12px] py-[5px] text-[13px] text-white"
            >
              Prev
            </button>
            <span className="rounded-[8px] border border-[#8A8A8A] px-[12px] py-[5px] text-[13px] text-white">
              {currentPageLabel} / {filteredCustomers.length === 0 ? 0 : totalPages}
            </span>
            <button
              type="button"
              className="rounded-[8px] border border-[#8A8A8A] px-[12px] py-[5px] text-[13px] text-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-[2px]">
          <div className="relative w-[540px] rounded-[22px] border border-[#DFA3E3]/70 bg-[#3B1836] px-[28px] pb-[24px] pt-[22px] shadow-[0_0_30px_rgba(0,0,0,0.35)]">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-[14px] top-[14px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#FF3B3B] text-white"
              aria-label="Close add customer modal"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            <h3 className="mb-[18px] text-[26px] font-semibold text-white">
              Add Customer
            </h3>

            <div className="space-y-[14px]">
              <label className="block">
                <span className="mb-[6px] block text-[14px] font-medium text-white">
                  Customer Name
                </span>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter Customer Name"
                  className="
                    h-[42px]
                    rounded-[8px]
                    border-transparent
                    bg-[#24101F]
                    px-[14px]
                    text-[14px]
                    text-white
                    shadow-none
                    placeholder:text-[#8A8A8A]
                    focus-visible:border-transparent
                    focus-visible:ring-0
                  "
                />
              </label>

              <label className="block">
                <span className="mb-[6px] block text-[14px] font-medium text-white">
                  Credit
                </span>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    value={form.credit}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        credit: event.target.value,
                      }))
                    }
                    className="
                      h-[42px]
                      rounded-[8px]
                      border-transparent
                      bg-[#24101F]
                      px-[14px]
                      pr-[52px]
                      text-[14px]
                      text-white
                      shadow-none
                      focus-visible:border-transparent
                      focus-visible:ring-0
                    "
                  />
                  <span className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[13px] text-[#C9C9C9]">
                    INR
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="mb-[6px] block text-[14px] font-medium text-white">
                  Customer Phone No
                </span>
                <div className="flex h-[42px] items-center rounded-[8px] bg-[#24101F] px-[10px]">
                  <div className="relative mr-[6px] flex items-center">
                    <span className="pointer-events-none text-[18px]">
                      {selectedCountry.flag}
                    </span>
                    <select
                      value={form.countryCode}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          countryCode: event.target.value,
                        }))
                      }
                      className="absolute inset-0 cursor-pointer opacity-0"
                      aria-label="Country code"
                    >
                      {COUNTRY_CODES.map((country) => (
                        <option
                          key={country.code}
                          value={country.code}
                          className="bg-[#24101F]"
                        >
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="ml-[4px] text-white/80"
                    />
                  </div>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        phone: event.target.value.replace(/\D/g, ""),
                      }))
                    }
                    className="h-full flex-1 bg-transparent text-[14px] text-white outline-none"
                    maxLength={15}
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-[6px] block text-[14px] font-medium text-white">
                  Customer Address
                </span>
                <textarea
                  value={form.address}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                  placeholder="Enter Customer Address"
                  className="
                    h-[88px]
                    w-full
                    resize-none
                    rounded-[8px]
                    border-0
                    bg-[#24101F]
                    px-[14px]
                    py-[10px]
                    text-[14px]
                    text-white
                    outline-none
                    placeholder:text-[#8A8A8A]
                  "
                />
              </label>
            </div>

            <div className="mt-[22px] flex justify-end">
              <button
                type="button"
                onClick={handleAddCustomer}
                className="
                  h-[40px]
                  min-w-[88px]
                  rounded-[10px]
                  bg-[#4A0A4A]
                  px-[22px]
                  text-[15px]
                  font-semibold
                  tracking-wide
                  text-white
                  hover:bg-[#5C0D5C]
                "
              >
                ADD
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
