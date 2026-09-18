"use client";

import { ListAccountApi } from "@/src/api/account/api/GetAll";
import { ListCustomerApi } from "@/src/api/customer/api/GetAll";
import { ListCustomerByIdApi } from "@/src/api/customer/api/GetById";
import { getOrderById } from "@/src/api/order";
import { Account } from "@/src/interfaces/accounts/ListAccountResponse";
import { useAddPayment } from "@/src/api/payment/hooks/create.hook";
import { useQuery } from "@tanstack/react-query";
import { Banknote, ChevronDown, Smartphone, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export type PaymentFormValues = {
  customerId: string;
};

type PaymentModalProps = {
  open: boolean;
  onClose: () => void;
  orderId: string | null;
};

export function PaymentModal({ open, onClose, orderId }: PaymentModalProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [enteredAmount, setEnteredAmount] = useState<string>("");

  const form = useForm<PaymentFormValues>({
    defaultValues: {
      customerId: "",
    },
  });

  // Queries
  const { data: orderData } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId && open,
  });

  const { data: customersData } = useQuery({
    queryKey: ["customers"],
    queryFn: () => ListCustomerApi({ limit: 1000 }),
    enabled: open,
  });

  const { data: selectedCustomerData } = useQuery({
    queryKey: ["customer", selectedCustomerId],
    queryFn: () => ListCustomerByIdApi(selectedCustomerId),
    enabled: !!selectedCustomerId && open,
  });

  const { data: accountsData } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => ListAccountApi({ limit: 1000 }),
    enabled: open,
  });

  const order = orderData?.data;
  const grandTotal = order?.totalAmount || 0;
  const customers = customersData?.data || [];
  const accounts = accountsData?.data?.filter((a: Account) => a.showInPos) || [];
  const customerCredit = selectedCustomerData?.data?.credit || 0;

  const activeAccount = accounts.find((a: Account) => a._id === activeAccountId);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedCustomerId("");
      setActiveAccountId(null);
      setEnteredAmount("");
      form.reset({ customerId: "" });
    }
  }, [open]);

  const handleCustomerSelect = (id: string) => {
    setSelectedCustomerId(id);
    form.setValue("customerId", id);
  };

  // Handle Numpad click
  const handleNumpadClick = (value: string) => {
    if (!activeAccountId) {
      toast.error("Please select a payment method first.");
      return;
    }

    if (value === "Fill") {
      setEnteredAmount(grandTotal.toString());
      return;
    }

    if (value === "Clear") {
      setEnteredAmount("");
      return;
    }

    // Number append
    if (value === "." && enteredAmount.includes(".")) return;

    if (["100", "200", "500", "1000"].includes(value)) {
      setEnteredAmount((prev) => {
        const current = parseFloat(prev || "0");
        return (current + parseInt(value)).toString();
      });
      return;
    }

    setEnteredAmount((prev) => {
      // Don't allow multiple leading zeros
      if (prev === "0" && value !== ".") return value;
      return prev + value;
    });
  };

  const parsedEnteredAmount = parseFloat(enteredAmount || "0");
  const balance = parsedEnteredAmount - grandTotal;

  const isCash = activeAccount?.accountType?.toLowerCase() === "cash" || activeAccount?.accountName?.toLowerCase().includes("cash");

  // Validation
  let canPay = false;
  let payErrorMessage = "";

  if (activeAccountId && parsedEnteredAmount >= grandTotal) {
    if (!isCash && parsedEnteredAmount > grandTotal) {
      payErrorMessage = "Amount exceeds total";
      canPay = false;
    } else {
      canPay = true;
    }
  }

  const { mutate: addPayment, isPending: isPaying } = useAddPayment({
    form,
    onOpenChange: onClose,
  });

  const handlePay = () => {
    if (!canPay) {
      if (payErrorMessage) toast.error(payErrorMessage);
      return;
    }

    if (!orderId || !activeAccountId) return;

    addPayment({
      orderId,
      amount: isCash ? parsedEnteredAmount : grandTotal,
      accountId: activeAccountId,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-[2px]">
      <div className="relative flex w-full max-w-[800px] flex-col rounded-[20px] bg-[#EFEFEF] border border-[#E0E0E0] p-6 shadow-2xl text-black">

        {/* Header Row */}
        <div className="flex items-center justify-between border-b border-[#D0D0D0] pb-4 mb-4">
          <h2 className="text-2xl font-bold text-black sm:text-3xl">Payment</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D0D0D0] bg-white text-[#FF3B3B] shadow-sm transition-colors hover:bg-gray-50"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Left Column: Details */}
          <div className="flex flex-1 flex-col gap-6">

            {/* Customer Dropdown */}
            <SimpleSearchDropdown
              placeholder="Enter Customer Name"
              value={selectedCustomerId}
              onChange={handleCustomerSelect}
              options={customers.map((c) => ({
                label: c.name,
                value: c._id,
              }))}
            />

            {/* Account Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {accounts.map((acc: Account) => {
                const isActive = activeAccountId === acc._id;
                const isAccCash = acc.accountType?.toLowerCase() === "cash" || acc.accountName?.toLowerCase().includes("cash");
                return (
                  <button
                    key={acc._id}
                    onClick={() => {
                      setActiveAccountId(acc._id);
                      setEnteredAmount("");
                    }}
                    className={`flex h-[80px] flex-col items-center justify-center gap-2 rounded-xl border transition-colors shadow-sm ${
                      isActive
                        ? "border-[#BFBFBF] bg-[#450042] text-white"
                        : "border-[#D0D0D0] bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {isAccCash ? <Banknote size={24} /> : <Smartphone size={24} />}
                    <span className="text-xs font-bold uppercase">{acc.accountName}</span>
                  </button>
                );
              })}
            </div>

            {/* Totals & Inputs */}
            <div className="mt-4 flex flex-col gap-4 bg-white p-5 rounded-xl border border-[#D0D0D0] shadow-sm">
              {selectedCustomerId && (
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-600">Customer Credit</span>
                  <span className="text-black">{customerCredit.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-base font-bold border-b border-[#F0F0F0] pb-3">
                <span className="text-gray-800">Grand Total</span>
                <span className="text-black text-lg">{grandTotal.toFixed(2)}</span>
              </div>

              {activeAccount && (
                <div className="flex justify-between items-center gap-4 mt-2">
                  <span className="text-gray-800 font-semibold min-w-[100px]">{activeAccount.accountName}</span>
                  <input
                    type="text"
                    value={enteredAmount}
                    onChange={(e) => setEnteredAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="Enter Amount"
                    className="flex-1 rounded-lg border border-[#D5D5D5] bg-[#F5F5F5] text-black font-bold px-4 py-3 text-left focus:outline-none focus:border-[#BFBFBF]"
                  />
                </div>
              )}

              {activeAccount && (
                <div className="flex justify-between items-center text-lg font-bold mt-2 pt-2 border-t border-[#F0F0F0]">
                  <span className="text-black">Balance</span>
                  <span className={balance < 0 ? "text-[#FF3B3B]" : "text-green-600"}>
                    {balance === 0 ? "0.00" : balance.toFixed(2)}
                  </span>
                </div>
              )}

              {payErrorMessage && (
                <div className="text-[#FF3B3B] text-sm text-right font-semibold mt-[-10px]">
                  {payErrorMessage}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Numpad */}
          <div className="w-full md:w-[350px]">
            <div className="grid grid-cols-4 gap-3">
              {/* Row 1 */}
              <NumpadBtn onClick={() => handleNumpadClick("100")}>100</NumpadBtn>
              <NumpadBtn onClick={() => handleNumpadClick("200")}>200</NumpadBtn>
              <NumpadBtn onClick={() => handleNumpadClick("500")}>500</NumpadBtn>
              <NumpadBtn onClick={() => handleNumpadClick("1000")}>1000</NumpadBtn>

              {/* Row 2 */}
              <NumpadBtn onClick={() => handleNumpadClick("7")}>7</NumpadBtn>
              <NumpadBtn onClick={() => handleNumpadClick("8")}>8</NumpadBtn>
              <NumpadBtn onClick={() => handleNumpadClick("9")}>9</NumpadBtn>
              <NumpadBtn onClick={() => handleNumpadClick("Fill")}>Fill</NumpadBtn>

              {/* Row 3 */}
              <NumpadBtn onClick={() => handleNumpadClick("4")}>4</NumpadBtn>
              <NumpadBtn onClick={() => handleNumpadClick("5")}>5</NumpadBtn>
              <NumpadBtn onClick={() => handleNumpadClick("6")}>6</NumpadBtn>
              <NumpadBtn onClick={() => handleNumpadClick("Clear")}>Clear</NumpadBtn>

              {/* Row 4 */}
              <NumpadBtn onClick={() => handleNumpadClick("1")}>1</NumpadBtn>
              <NumpadBtn onClick={() => handleNumpadClick("2")}>2</NumpadBtn>
              <NumpadBtn onClick={() => handleNumpadClick("3")}>3</NumpadBtn>

              {/* Pay Button - spans 2 rows */}
              <button
                onClick={handlePay}
                disabled={!canPay || isPaying}
                className={`row-span-2 rounded-xl flex items-center justify-center text-lg font-bold transition-colors ${
                  canPay && !isPaying
                    ? "bg-[#009933] text-white hover:bg-[#007A29]"
                    : "bg-[#004d1a] text-[#80bf99] cursor-not-allowed"
                }`}
              >
                {isPaying ? "..." : "Pay"}
              </button>

              {/* Row 5 */}
              <NumpadBtn onClick={() => handleNumpadClick("0")}>0</NumpadBtn>
              <NumpadBtn onClick={() => handleNumpadClick(".")}>.</NumpadBtn>
              <NumpadBtn onClick={() => handleNumpadClick("00")}>00</NumpadBtn>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function NumpadBtn({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-[60px] items-center justify-center rounded-xl border border-[#D0D0D0] bg-white text-black text-xl font-bold shadow-sm hover:bg-gray-100 transition-colors"
    >
      {children}
    </button>
  );
}

type SimpleOption = {
  label: string;
  value: string;
};

type SimpleSearchDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: SimpleOption[];
  placeholder?: string;
};

function SimpleSearchDropdown({ value, onChange, options, placeholder }: SimpleSearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-[46px] w-full items-center justify-between rounded-lg border border-[#D5D5D5] bg-white px-4 text-left text-black shadow-sm"
      >
        <span className={selectedLabel ? "text-black" : "text-[#8A8A8A]"}>
          {selectedLabel || placeholder || "Select"}
        </span>
        <ChevronDown size={16} className={`shrink-0 text-[#8A8A8A] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-[200] w-full rounded-lg border border-[#D5D5D5] bg-white shadow-lg">
          <div className="border-b border-[#F0F0F0] p-2">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md border border-[#E5E5E5] bg-[#F7F7F7] px-3 py-2 text-sm text-black outline-none"
            />
          </div>

          <div className="max-h-[220px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-[#8A8A8A]">No customers found</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-[#F5F0F5] ${
                    option.value === value ? "bg-[#F5F0F5] font-semibold text-[#450042]" : "text-black"
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}