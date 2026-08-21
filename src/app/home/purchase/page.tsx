"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Plus,
  Search,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TABS = ["Purchase", "Item"] as const;
type PurchaseTab = (typeof TABS)[number];

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

const PURCHASE_COLUMNS = [
  "No.",
  "Date",
  "Payment Mode",
  "Supplier",
  "Invoice",
  "Sub Total",
  "VAT",
  "Total",
  "Actions",
] as const;

const ITEM_COLUMNS = [
  "No.",
  "Ingredient Name",
  "Purchase Unit",
  "Created Date",
  "Updated Date",
  "Actions",
] as const;

const MODAL_ITEM_COLUMNS = [
  "No.",
  "Ingredient Name",
  "Purchase Unit",
  "Created Date",
  "Updated Date",
  "Actions",
] as const;

const inputClassName = `
  h-[38px]
  rounded-[8px]
  border
  border-[#777777]
  bg-[#1A0F1A]
  px-[12px]
  text-[13px]
  text-white
  shadow-none
  placeholder:text-[#8A8A8A]
  focus-visible:border-[#777777]
  focus-visible:ring-0
`;

export default function PurchasePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PurchaseTab>("Purchase");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(
    10,
  );
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const [supplierName, setSupplierName] = useState("");
  const [date, setDate] = useState("01/01/2026");
  const [paymentType, setPaymentType] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [vatMode, setVatMode] = useState("VAT Inclusive");
  const [itemOne, setItemOne] = useState("");
  const [itemTwo, setItemTwo] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  const [ingredientName, setIngredientName] = useState("");
  const [purchaseUnit, setPurchaseUnit] = useState("");

  const isPurchase = activeTab === "Purchase";
  const columns = isPurchase ? PURCHASE_COLUMNS : ITEM_COLUMNS;

  const openAddModal = () => {
    if (isPurchase) {
      setIsPurchaseModalOpen(true);
      return;
    }
    setIsItemModalOpen(true);
  };

  const closePurchaseModal = () => {
    setIsPurchaseModalOpen(false);
    setSupplierName("");
    setDate("01/01/2026");
    setPaymentType("");
    setInvoiceNo("");
    setVatMode("VAT Inclusive");
    setItemOne("");
    setItemTwo("");
    setQty("");
    setPrice("");
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false);
    setIngredientName("");
    setPurchaseUnit("");
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
          <h2 className="text-[28px] font-semibold">
            {isPurchase ? "Purchase" : "Item"}
          </h2>

          <button
            type="button"
            onClick={openAddModal}
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
            {isPurchase ? "Add Purchase" : "Add Item"}
          </button>
        </div>

        <div className="mt-[16px] flex items-center gap-[12px]">
          {TABS.map((tab) => {
            const selected = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setSearch("");
                }}
                className={`
                  h-[40px]
                  rounded-[12px]
                  px-[22px]
                  text-[15px]
                  font-medium
                  whitespace-nowrap
                  transition-colors
                  ${
                    selected
                      ? "border border-[#D4CCD4] bg-[#3A2040] text-white"
                      : "bg-black text-white"
                  }
                `}
              >
                {tab}
              </button>
            );
          })}

          <div className="relative ml-auto w-[280px]">
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
                h-[40px]
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
          <div
            className={`grid bg-black px-[16px] py-[10px] text-[12px] font-medium text-white ${
              isPurchase
                ? "grid-cols-[48px_0.9fr_1.1fr_1fr_0.9fr_0.9fr_0.7fr_0.8fr_70px]"
                : "grid-cols-[48px_1.4fr_1fr_1fr_1fr_80px]"
            }`}
          >
            {columns.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col bg-[#3A2040]">
            <p className="px-[16px] py-[18px] text-[14px] text-white/80">
              No data Data Available
            </p>

            {isPurchase && (
              <div className="absolute bottom-[14px] right-[14px] rounded-[10px] bg-[#6E6E6E] px-[16px] py-[10px] text-[13px] text-white">
                <p>Total VAT: AED 0.00</p>
                <p className="mt-[2px]">Grand Total: AED 0.00</p>
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
                  Number(
                    event.target.value,
                  ) as (typeof PAGE_SIZE_OPTIONS)[number],
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
            <button
              type="button"
              className="rounded-[8px] border border-[#8A8A8A] px-[12px] py-[5px] text-[13px] text-white"
            >
              Prev
            </button>
            <span className="rounded-[8px] border border-[#8A8A8A] px-[12px] py-[5px] text-[13px] text-white">
              1 / 0
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

      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-[2px]">
          <div className="relative w-[920px] rounded-[22px] border border-[#DFA3E3]/70 bg-[#3B1836] px-[22px] pb-[20px] pt-[18px] shadow-[0_0_30px_rgba(0,0,0,0.35)]">
            <button
              type="button"
              onClick={closePurchaseModal}
              className="absolute right-[-12px] top-[-12px] flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#FF3B3B] text-white"
              aria-label="Close purchase modal"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            <h3 className="mb-[14px] text-[26px] font-semibold text-white">
              Purchase
            </h3>

            <div className="grid grid-cols-2 gap-[12px]">
              <div className="rounded-[12px] bg-black px-[14px] py-[12px]">
                <p className="mb-[8px] text-[14px] font-medium text-white">
                  Select Supplier
                </p>

                <div className="flex items-center gap-[8px]">
                  <Input
                    value={supplierName}
                    onChange={(event) => setSupplierName(event.target.value)}
                    placeholder="Enter Customer Name"
                    className={inputClassName}
                  />
                  <button
                    type="button"
                    className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] border border-[#777777] bg-[#1A0F1A] text-white"
                    aria-label="Add supplier"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="mt-[10px] space-y-[4px] text-[13px] text-white">
                  <p>TRN: -</p>
                  <p>Address: -</p>
                </div>
              </div>

              <div className="rounded-[12px] bg-black px-[14px] py-[12px]">
                <div className="grid grid-cols-2 gap-x-[12px] gap-y-[10px]">
                  <label className="block">
                    <span className="mb-[6px] block text-[13px] text-white">
                      Date
                    </span>
                    <Input
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className={inputClassName}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-[6px] block text-[13px] text-white">
                      Payment Type
                    </span>
                    <Input
                      value={paymentType}
                      onChange={(event) => setPaymentType(event.target.value)}
                      placeholder="Select Or Search"
                      className={inputClassName}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-[6px] block text-[13px] text-white">
                      Invoice No
                    </span>
                    <Input
                      value={invoiceNo}
                      onChange={(event) => setInvoiceNo(event.target.value)}
                      placeholder="Enter INV No."
                      className={inputClassName}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-[6px] block text-[13px] text-white">
                      VAT Mode
                    </span>
                    <div className="relative">
                      <select
                        value={vatMode}
                        onChange={(event) => setVatMode(event.target.value)}
                        className="
                          h-[38px]
                          w-full
                          appearance-none
                          rounded-[8px]
                          border
                          border-[#777777]
                          bg-[#1A0F1A]
                          px-[12px]
                          pr-[28px]
                          text-[13px]
                          text-white
                          outline-none
                        "
                      >
                        <option value="VAT Inclusive">VAT Inclusive</option>
                        <option value="VAT Exclusive">VAT Exclusive</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 text-white/80"
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-[12px] rounded-[12px] bg-black px-[14px] py-[12px]">
              <div className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr_42px] items-end gap-[10px]">
                <label className="block">
                  <span className="mb-[6px] block text-[13px] text-white">
                    Item
                  </span>
                  <Input
                    value={itemOne}
                    onChange={(event) => setItemOne(event.target.value)}
                    placeholder="Type to search or create"
                    className={inputClassName}
                  />
                </label>

                <label className="block">
                  <span className="mb-[6px] block text-[13px] text-white">
                    Item
                  </span>
                  <Input
                    value={itemTwo}
                    onChange={(event) => setItemTwo(event.target.value)}
                    placeholder="Type to search or create"
                    className={inputClassName}
                  />
                </label>

                <label className="block">
                  <span className="mb-[6px] block text-[13px] text-white">
                    Qty
                  </span>
                  <Input
                    value={qty}
                    onChange={(event) => setQty(event.target.value)}
                    placeholder="Enter quantity"
                    className={inputClassName}
                  />
                </label>

                <label className="block">
                  <span className="mb-[6px] block text-[13px] text-white">
                    Price
                  </span>
                  <Input
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="Enter Prize"
                    className={inputClassName}
                  />
                </label>

                <button
                  type="button"
                  className="mb-[1px] flex h-[38px] w-[38px] items-center justify-center rounded-[8px] border border-[#777777] bg-[#1A0F1A] text-white"
                  aria-label="Add line item"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="mt-[12px] overflow-hidden rounded-[10px]">
              <div className="grid grid-cols-[48px_1.4fr_1fr_1fr_1fr_80px] bg-black px-[14px] py-[10px] text-[12px] font-medium text-white">
                {MODAL_ITEM_COLUMNS.map((column) => (
                  <span key={column}>{column}</span>
                ))}
              </div>
              <div className="min-h-[140px] bg-[#3A2040] px-[14px] py-[14px] text-[13px] text-white/80">
                No data Data Available
              </div>
            </div>

            <div className="mt-[16px] flex justify-end">
              <button
                type="button"
                onClick={closePurchaseModal}
                className="
                  h-[42px]
                  min-w-[110px]
                  rounded-[12px]
                  border
                  border-[#D000C8]
                  bg-black
                  px-[28px]
                  text-[15px]
                  font-semibold
                  tracking-wide
                  text-white
                "
              >
                ADD
              </button>
            </div>
          </div>
        </div>
      )}

      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-[2px]">
          <div className="relative w-[520px] rounded-[22px] border border-[#DFA3E3]/70 bg-[#3B1836] px-[28px] pb-[24px] pt-[22px] shadow-[0_0_30px_rgba(0,0,0,0.35)]">
            <button
              type="button"
              onClick={closeItemModal}
              className="absolute right-[-12px] top-[-12px] flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#FF3B3B] text-white"
              aria-label="Close add item modal"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            <h3 className="mb-[18px] text-[26px] font-semibold text-white">
              Add Item
            </h3>

            <div className="space-y-[14px]">
              <label className="block">
                <span className="mb-[6px] block text-[14px] font-medium text-white">
                  Ingredient Name
                </span>
                <Input
                  value={ingredientName}
                  onChange={(event) => setIngredientName(event.target.value)}
                  placeholder="Enter Ingredient Name"
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
                  Purchase Unit
                </span>
                <Input
                  value={purchaseUnit}
                  onChange={(event) => setPurchaseUnit(event.target.value)}
                  placeholder="Select Or Search"
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
            </div>

            <div className="mt-[22px] flex justify-end">
              <button
                type="button"
                onClick={closeItemModal}
                className="
                  h-[40px]
                  min-w-[88px]
                  rounded-[10px]
                  border
                  border-[#D000C8]
                  bg-black
                  px-[22px]
                  text-[15px]
                  font-semibold
                  tracking-wide
                  text-[#D000C8]
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
