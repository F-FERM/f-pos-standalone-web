"use client";

import { ListAccountApi } from "@/src/api/account/api/GetAll";
import { ListCustomerApi } from "@/src/api/customer/api/GetAll";
import { ListCustomerByIdApi } from "@/src/api/customer/api/GetById";
import { getOrderById } from "@/src/api/order";
import { Account } from "@/src/interfaces/accounts/ListAccountResponse";
import { useAddPayment } from "@/src/api/payment/hooks/create.hook";
import { useQuery } from "@tanstack/react-query";
import { Banknote, ChevronDown, Plus, Smartphone, X } from "lucide-react";
import AddCustomerModal from "../customer/AddCustomerDialogue";
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
  onPaymentSuccess?: () => void;
};

const MAX_SELECTED_ACCOUNTS = 2;

// ── Spinopel sound singleton ──────────────────────────────────────────────────
let _spinopelAudio: HTMLAudioElement | null = null;
function playSpinopel() {
  if (typeof window === "undefined") return;
  if (!_spinopelAudio) {
    _spinopelAudio = new Audio("/voices/cash.mp3");
    _spinopelAudio.preload = "auto";
    _spinopelAudio.load();
  }
  _spinopelAudio.currentTime = 0;
  _spinopelAudio.play().catch(() => {
    const clone = new Audio("/voices/cash.mp3");
    clone.play().catch(() => {});
  });
}
// ─────────────────────────────────────────────────────────────────────────────

export function PaymentModal({ open, onClose, orderId, onPaymentSuccess }: PaymentModalProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  // Multi-account: set of selected account IDs (in insertion order), capped at
  // MAX_SELECTED_ACCOUNTS.
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  // Amount entered per account: { [accountId]: string }
  const [accountAmounts, setAccountAmounts] = useState<Record<string, string>>({});
  // Last touched account — keypad routes to this
  const [activeKeypadAccountId, setActiveKeypadAccountId] = useState<string | null>(null);

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
  const accounts = (accountsData?.data?.filter((a: Account) => a.showInPos) || []) as Account[];
  const customerCredit = selectedCustomerData?.data?.credit || 0;

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedCustomerId("");
      setSelectedAccountIds([]);
      setAccountAmounts({});
      setActiveKeypadAccountId(null);
      form.reset({ customerId: "" });
    }
  }, [open]);

  const handleCustomerSelect = (id: string) => {
    setSelectedCustomerId(id);
    form.setValue("customerId", id);
  };

  const isCashAccount = (acc: Account) =>
    acc.accountType?.toLowerCase() === "cash" ||
    acc.accountName?.toLowerCase().includes("cash");

  // Toggle account selection — capped at MAX_SELECTED_ACCOUNTS at a time.
  // Picking a new one while already at the cap keeps the first selection in
  // place and replaces the second (most recently picked) one with the new
  // choice, rather than blocking it.
  const handleToggleAccount = (accId: string) => {
    setSelectedAccountIds((prev) => {
      if (prev.includes(accId)) {
        // Deselect: remove and clear its amount
        setAccountAmounts((am) => {
          const next = { ...am };
          delete next[accId];
          return next;
        });
        const next = prev.filter((id) => id !== accId);
        setActiveKeypadAccountId(next[next.length - 1] ?? null);
        return next;
      }

      if (prev.length >= MAX_SELECTED_ACCOUNTS) {
        const droppedId = prev[prev.length - 1];
        const next = [...prev.slice(0, -1), accId];

        setAccountAmounts((am) => {
          const nextAmounts = { ...am };
          delete nextAmounts[droppedId];
          return nextAmounts;
        });

        setActiveKeypadAccountId(accId);
        return next;
      }

      const next = [...prev, accId];
      setActiveKeypadAccountId(accId);
      return next;
    });
  };

  // Focus a specific account input for keypad
  const handleFocusAccount = (accId: string) => {
    setActiveKeypadAccountId(accId);
  };

  // Handle Numpad click — routes to activeKeypadAccountId
  const handleNumpadClick = (value: string) => {
    if (!activeKeypadAccountId) {
      toast.error("Please select a payment method first.");
      return;
    }

    const accId = activeKeypadAccountId;

    if (value === "Fill") {
      // Fill the remaining amount into the active account
      const alreadyEntered = selectedAccountIds
        .filter((id) => id !== accId)
        .reduce((sum, id) => sum + (parseFloat(accountAmounts[id] || "0")), 0);
      const remaining = Math.max(0, grandTotal - alreadyEntered);
      setAccountAmounts((prev) => ({ ...prev, [accId]: remaining.toFixed(2) }));
      return;
    }

    if (value === "Clear") {
      setAccountAmounts((prev) => ({ ...prev, [accId]: "" }));
      return;
    }

    if (value === "." && (accountAmounts[accId] || "").includes(".")) return;

    if (["100", "200", "500", "1000"].includes(value)) {
      setAccountAmounts((prev) => {
        const current = parseFloat(prev[accId] || "0");
        return { ...prev, [accId]: (current + parseInt(value)).toString() };
      });
      return;
    }

    setAccountAmounts((prev) => {
      const current = prev[accId] || "";
      if (current === "0" && value !== ".") return { ...prev, [accId]: value };
      return { ...prev, [accId]: current + value };
    });
  };

  // Total entered across all selected accounts
  const totalEntered = selectedAccountIds.reduce(
    (sum, id) => sum + (parseFloat(accountAmounts[id] || "0")),
    0
  );
  const balance = totalEntered - grandTotal;

  // Validation per account
  const accountErrors: Record<string, string> = {};
  let canPay = selectedAccountIds.length > 0;

  selectedAccountIds.forEach((accId) => {
    const entered = parseFloat(accountAmounts[accId] || "0");
    if (entered <= 0) {
      accountErrors[accId] = "Enter amount";
      canPay = false;
    }
  });

  // Pay is only enabled when balance is exactly 0
  if (balance !== 0) {
    canPay = false;
  }

  const { mutate: addPayment, isPending: isPaying } = useAddPayment({
    form,
    onOpenChange: onClose,
    onSuccessCallback: () => {
      playSpinopel();
      onPaymentSuccess?.();
    },
  });

  const handlePay = () => {
    if (!canPay) {
      if (Object.keys(accountErrors).length > 0) {
        toast.error(Object.values(accountErrors)[0]);
      } else {
        toast.error("Entered amount must equal the total (balance must be 0).");
      }
      return;
    }

    if (!orderId) return;

    const methods = selectedAccountIds.map((accId) => {
      const acc = accounts.find((a) => a._id === accId);
      const entered = parseFloat(accountAmounts[accId] || "0");
      // Cash: allow overpayment (user gave more cash); non-cash: cap at share of total
      return {
        accountId: accId,
        amount: acc && isCashAccount(acc) ? entered : entered,
      };
    });

    addPayment({
      orderId,
      methods,
    });
  };

  if (!open) return null;

  return (
    <>
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 p-2 backdrop-blur-[2px] xs:p-3 sm:p-4">
      <div className="relative flex max-h-[95vh] w-full max-w-[800px] flex-col overflow-y-auto rounded-2xl bg-[#EFEFEF] border border-[#E0E0E0] p-3 shadow-2xl text-black xs:p-4 sm:rounded-[20px] sm:p-6">

        {/* Header Row */}
        <div className="flex items-center justify-between border-b border-[#D0D0D0] pb-3 mb-3 sm:pb-4 sm:mb-4">
          <h2 className="text-lg font-bold text-black xs:text-xl sm:text-2xl md:text-3xl">Payment</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D0D0D0] bg-white text-[#FF3B3B] shadow-sm transition-colors hover:bg-gray-50 sm:h-9 sm:w-9"
          >
            <X size={18} strokeWidth={2.5} className="sm:hidden" />
            <X size={20} strokeWidth={2.5} className="hidden sm:block" />
          </button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:gap-8">

          {/* Left Column: Details */}
          <div className="flex flex-1 flex-col gap-4 sm:gap-6 min-w-0">

            {/* Customer Dropdown */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SimpleSearchDropdown
                  placeholder="Enter Customer Name"
                  value={selectedCustomerId}
                  onChange={handleCustomerSelect}
                  options={customers.map((c) => ({
                    label: c.name,
                    value: c._id,
                  }))}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsAddCustomerOpen(true)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#670063] text-white hover:bg-[#85007f] transition-colors sm:h-[46px] sm:w-[46px]"
                aria-label="Add Customer"
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Account Buttons — multi-select, capped at MAX_SELECTED_ACCOUNTS */}
            <div className="grid grid-cols-2 gap-2.5 xs:gap-3 sm:grid-cols-3 sm:gap-4">
              {accounts.map((acc: Account) => {
                const isSelected = selectedAccountIds.includes(acc._id);
                const isActiveKeypad = activeKeypadAccountId === acc._id;
                const isAccCash = isCashAccount(acc);
                return (
                  <button
                    key={acc._id}
                    onClick={() => handleToggleAccount(acc._id)}
                    className={`flex h-16 flex-col items-center justify-center gap-1.5 rounded-xl border transition-colors shadow-sm xs:h-[72px] sm:h-[80px] sm:gap-2 ${
                      isSelected
                        ? isActiveKeypad
                          ? "border-[#BFBFBF] bg-[#450042] text-white ring-2 ring-[#9B59B6]"
                          : "border-[#BFBFBF] bg-[#450042] text-white"
                        : "border-[#D0D0D0] bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {isAccCash ? (
                      <Banknote size={20} className="sm:hidden" />
                    ) : (
                      <Smartphone size={20} className="sm:hidden" />
                    )}
                    {isAccCash ? (
                      <Banknote size={24} className="hidden sm:block" />
                    ) : (
                      <Smartphone size={24} className="hidden sm:block" />
                    )}
                    <span className="text-[11px] font-bold uppercase xs:text-xs">{acc.accountName}</span>
                  </button>
                );
              })}
            </div>

            {/* Totals & Per-Account Inputs */}
            <div className="mt-1 flex flex-col gap-2.5 bg-white p-3 rounded-xl border border-[#D0D0D0] shadow-sm xs:p-4 sm:mt-2 sm:gap-3 sm:p-5">
              {selectedCustomerId && (
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-600">Customer Credit</span>
                  <span className="text-black">{customerCredit.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm font-bold border-b border-[#F0F0F0] pb-2.5 sm:text-base sm:pb-3">
                <span className="text-gray-800">Grand Total</span>
                <span className="text-black text-base sm:text-lg">{grandTotal.toFixed(2)}</span>
              </div>

              {/* Per-account amount inputs */}
              {selectedAccountIds.map((accId) => {
                const acc = accounts.find((a) => a._id === accId);
                if (!acc) return null;
                const isActive = activeKeypadAccountId === accId;
                return (
                  <div key={accId} className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-4">
                      <span className="min-w-[70px] flex-1 basis-full text-sm font-semibold text-gray-800 xs:basis-auto sm:min-w-[100px] sm:flex-none sm:text-base">
                        {acc.accountName}
                      </span>
                      <input
                        type="text"
                        value={accountAmounts[accId] || ""}
                        onChange={(e) =>
                          setAccountAmounts((prev) => ({
                            ...prev,
                            [accId]: e.target.value.replace(/[^0-9.]/g, ""),
                          }))
                        }
                        onFocus={() => handleFocusAccount(accId)}
                        placeholder="Enter Amount"
                        className={`min-w-0 flex-1 rounded-lg border text-black font-bold px-3 py-2 text-left text-sm focus:outline-none sm:px-4 sm:py-3 sm:text-base ${
                          isActive
                            ? "border-[#450042] bg-[#F8F0FF]"
                            : "border-[#D5D5D5] bg-[#F5F5F5]"
                        }`}
                      />
                    </div>
                    {accountErrors[accId] && (
                      <span className="text-right text-xs text-[#FF3B3B] font-semibold">
                        {accountErrors[accId]}
                      </span>
                    )}
                  </div>
                );
              })}

              {selectedAccountIds.length > 0 && (
                <div className="flex justify-between items-center text-base font-bold mt-1 pt-2 border-t border-[#F0F0F0] sm:text-lg">
                  <span className="text-black">Balance</span>
                  <span className={balance < 0 ? "text-[#FF3B3B]" : "text-green-600"}>
                    {balance === 0 ? "0.00" : balance.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Numpad */}
          <div className="w-full md:w-[350px]">
            <div className="grid grid-cols-4 gap-2 xs:gap-2.5 sm:gap-3">
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
                className={`row-span-2 rounded-xl flex items-center justify-center text-base font-bold transition-colors sm:text-lg ${
                  canPay && !isPaying
                    ? "bg-[#009933] text-white hover:bg-[#007A29]"
                    : "bg-gray-400 text-gray-100 cursor-not-allowed"
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

    <AddCustomerModal
      isOpen={isAddCustomerOpen}
      onClose={() => setIsAddCustomerOpen(false)}
      mode="add"
    />
    </>
  );
}

function NumpadBtn({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-11 items-center justify-center rounded-xl border border-[#D0D0D0] bg-white text-black text-base font-bold shadow-sm hover:bg-gray-100 transition-colors xs:h-12 sm:h-14 sm:text-lg md:h-[60px] md:text-xl"
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
        className="flex h-11 w-full items-center justify-between rounded-lg border border-[#D5D5D5] bg-white px-3 text-left text-black shadow-sm sm:h-[46px] sm:px-4"
      >
        <span className={`truncate text-sm sm:text-base ${selectedLabel ? "text-black" : "text-[#8A8A8A]"}`}>
          {selectedLabel || placeholder || "Select"}
        </span>
        <ChevronDown size={16} className={`ml-2 shrink-0 text-[#8A8A8A] transition-transform ${isOpen ? "rotate-180" : ""}`} />
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