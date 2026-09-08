"use client";

import { useMemo, useState } from "react";
import userplus from "../../../../public/images/icons/usergroup.png";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";
import AddExpenseModal, { NewExpenseInput } from "@/src/components/expense/AddExpenseModal";
import { Button } from "@/src/components/ui/button";

type Expense = {
  id: number;
  date: string;
  paymentType: string;
  supplier: string;
  invoiceNo: string;
  amount: number; // base amount, excl. VAT
  vat: number;
  total: number;
};

const EXPENSE_COLUMNS = [
  "No.",
  "Date",
  "Payment Mode",
  "Supplier",
  "Amount",
  "Total VAT",
  "Invoice No",
  "Actions",
] as const;

const EXPENSE_GRID = "grid-cols-[48px_0.9fr_1fr_1fr_0.9fr_0.9fr_1fr_70px]";

const VAT_RATE = 0.05;

export default function ExpensePage() {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return expenses;
    return expenses.filter((expense) =>
      [expense.supplier, expense.invoiceNo, expense.paymentType]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [expenses, search]);

  const totals = useMemo(
    () =>
      filteredExpenses.reduce(
        (acc, expense) => ({
          vat: acc.vat + expense.vat,
          total: acc.total + expense.total,
        }),
        { vat: 0, total: 0 },
      ),
    [filteredExpenses],
  );

  const handleAddExpense = (data: NewExpenseInput) => {
    const subTotal = data.lineItems.reduce((sum, line) => sum + line.qty * line.amount, 0);
    const vat =
      data.vatMode === "VAT Inclusive"
        ? subTotal - subTotal / (1 + VAT_RATE)
        : subTotal * VAT_RATE;
    const baseAmount = data.vatMode === "VAT Inclusive" ? subTotal - vat : subTotal;
    const total = baseAmount + vat;

    setExpenses((current) => [
      ...current,
      {
        id: current.length + 1,
        date: data.date,
        paymentType: data.paymentType,
        supplier: data.supplierName,
        invoiceNo: data.invoiceNo,
        amount: baseAmount,
        vat,
        total,
      },
    ]);
    setIsExpenseModalOpen(false);
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

      <div
        className="relative flex-1 bg-[#EFEFEF]"
        style={{ minHeight: CARD_TOP + CARD_HEIGHT + 40 }}
      >
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
              color: "#000000",
            }}
          >
            Expense
          </span>

          <Button
            variant="addcustomer"
            size="none"
            iconSrc={userplus}
            iconAlt="Add expense"
            onClick={() => setIsExpenseModalOpen(true)}
          >
            Add Expense
          </Button>
        </div>

        <div
          className="absolute flex"
          style={{ top: CARD_TOP + 88, left: 30, width: 964 }}
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
            width: 964,
            height: 40,
            justifyContent: "space-between",
            borderRadius: 10,
            background: "#EFEFEF",
            paddingRight: 11,
            paddingLeft: 11,
          }}
        >
          {EXPENSE_COLUMNS.map((column) => (
            <span
              key={column}
              className="truncate text-center"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 12,
                lineHeight: "normal",
                color: "#000000",
              }}
            >
              {column}
            </span>
          ))}
        </div>

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
          {filteredExpenses.length === 0 ? (
            <p
              className="px-[16px]"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 14,
                color: "#5D5D5D",
              }}
            >
              No Data Available
            </p>
          ) : (
            filteredExpenses.slice(0, pageSize).map((expense, index) => (
              <div
                key={expense.id}
                className={`grid border-b border-black/5 px-[16px] py-[10px] text-[12px] text-black ${EXPENSE_GRID}`}
              >
                <span>{index + 1}</span>
                <span className="truncate">{expense.date}</span>
                <span className="truncate">{expense.paymentType}</span>
                <span className="truncate">{expense.supplier}</span>
                <span>{expense.amount.toFixed(2)}</span>
                <span>{expense.vat.toFixed(2)}</span>
                <span className="truncate">{expense.invoiceNo}</span>
                <span />
              </div>
            ))
          )}

                      <div
  className="
    sticky bottom-0 ml-auto mr-3 mt-auto
    flex h-[76px] w-[208px]
    flex-col gap-[10px]
    rounded-[10px]
    bg-[#868686]
    px-[18px]
    pt-[9px]
    pb-[9px]
    pr-[17px]
    text-[16px]
    font-medium
    text-white
  "
>
            <p>Total VAT: AED {totals.vat.toFixed(2)}</p>
            <p className="mt-[2px]">Grand Total: AED {totals.total.toFixed(2)}</p>
          </div>
        </div>

        <div
          className="absolute"
          style={{ top: CARD_TOP + 184 + 255 + 14, left: 30, width: 964 }}
        >
          <Pagination
            currentPage={currentPage}
            totalItems={filteredExpenses.length}
            itemsPerPage={pageSize}
            onPageChange={handlePageChange}
          />
        </div>

        <div
          className="absolute flex items-center justify-center"
          style={{ top: CARD_TOP + CARD_HEIGHT + 14, left: CARD_LEFT, width: CARD_WIDTH }}
        >
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: 12,
              color: "#939393",
            }}
          >
            © 2026 Techon Innovations. All rights reserved.
          </span>
        </div>
      </div>

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onAdd={handleAddExpense}
      />
    </main>
  );
}