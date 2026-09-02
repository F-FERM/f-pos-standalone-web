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

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

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

const EXPENSE_GRID =
  "grid-cols-[48px_0.9fr_1fr_1fr_0.9fr_0.9fr_1fr_70px]";

const VAT_RATE = 0.05;

export default function ExpensePage() {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(
    10,
  );
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredExpenses.length / pageSize) || 0,
  );

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
    const subTotal = data.lineItems.reduce(
      (sum, line) => sum + line.qty * line.amount,
      0,
    );
    const vat =
      data.vatMode === "VAT Inclusive"
        ? subTotal - subTotal / (1 + VAT_RATE)
        : subTotal * VAT_RATE;
    const baseAmount =
      data.vatMode === "VAT Inclusive" ? subTotal - vat : subTotal;
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

  return (
    <main className="flex h-full flex-col overflow-hidden bg-black text-white">
      <POSHeader />

      <div className="flex min-h-0 flex-1 flex-col bg-[#2C192B] px-[29px] pb-[18px] pt-[22px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[26px] font-semibold">Expense</h2>

          <Button
            variant="addcustomer"
            size="none"
            iconSrc={userplus}
            iconAlt="Add purchase"
            onClick={() => setIsExpenseModalOpen(true)}
          >
            Add Expense
          </Button>
        </div>

        <div className="mt-[16px] flex flex-wrap items-center gap-[12px]">
          <SearchInput
            variant="panel"
            value={search}
            onChange={(value) => setSearch(value)}
            className="w-full sm:ml-auto sm:w-[280px]"
          />
        </div>

        <div className="mt-[14px] flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px]">
          <div
            className={`hidden items-center justify-between gap-2 bg-black px-[18px] py-[12px] text-[13px] font-normal text-white sm:flex sm:text-[16px] ${EXPENSE_GRID}`}
          >
            {EXPENSE_COLUMNS.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#82367F4D]">
            {filteredExpenses.length === 0 ? (
              <p className="px-[16px] py-[18px] text-[14px] text-white/80">
                No Data Available
              </p>
            ) : (
              filteredExpenses.slice(0, pageSize).map((expense, index) => (
                <div
                  key={expense.id}
                  className={`grid border-b border-white/5 px-[16px] py-[12px] text-[12px] text-white/90 ${EXPENSE_GRID}`}
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

            <div className="sticky bottom-[14px] ml-auto mr-[14px] mt-auto rounded-[10px] bg-[#6E6E6E] px-[16px] py-[10px] text-[13px] text-white">
              <p>Total VAT: AED {totals.vat.toFixed(2)}</p>
              <p className="mt-[2px]">
                Grand Total: AED {totals.total.toFixed(2)}
              </p>
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

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onAdd={handleAddExpense}
      />
    </main>
  );
}