"use client";

import { useState } from "react";
import FormCombobox, { selectType } from "@/src/components/form/FormCombobox";
import FormInput from "@/src/components/form/FormInput";
import { Plus, Trash2, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";

export type VatMode = "VAT Inclusive" | "VAT Exclusive";

export type ExpenseLineItem = {
  id: number;
  accountName: string;
  note: string;
  qty: number;
  amount: number;
};

export type ExpenseFormValues = {
  supplierName: string;
  date: string;
  paymentType: string;
  invoiceNo: string;
  vatMode: VatMode;
  draftAccountName: string;
  draftNote: string;
  draftQty: string;
  draftAmount: string;
};

export type NewExpenseInput = {
  supplierName: string;
  date: string;
  paymentType: string;
  invoiceNo: string;
  vatMode: VatMode;
  lineItems: { accountName: string; note: string; qty: number; amount: number }[];
};

const emptyDraft = {
  draftAccountName: "",
  draftNote: "",
  draftQty: "1",
  draftAmount: "",
};

const emptyForm: ExpenseFormValues = {
  supplierName: "",
  date: "01/01/2026",
  paymentType: "",
  invoiceNo: "",
  vatMode: "VAT Inclusive",
  ...emptyDraft,
};

const PAYMENT_TYPE_OPTIONS: selectType[] = [
  { label: "Cash", value: "Cash" },
  { label: "Card", value: "Card" },
  { label: "Bank Transfer", value: "Bank Transfer" },
  { label: "Credit", value: "Credit" },
];

const VAT_MODE_OPTIONS: selectType[] = [
  { label: "VAT Inclusive", value: "VAT Inclusive" },
  { label: "VAT Exclusive", value: "VAT Exclusive" },
];

const MODAL_ITEM_COLUMNS = [
  "Item",
  "Qty",
  "Amount",
  "Base Total",
  "VAT",
  "Total",
  "Action",
] as const;

const VAT_RATE = 0.05;

type AddExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: NewExpenseInput) => void;
  accountOptions?: selectType[];
};

export default function AddExpenseModal({
  isOpen,
  onClose,
  onAdd,
  accountOptions = [],
}: AddExpenseModalProps) {
  const methods = useForm<ExpenseFormValues>({ defaultValues: emptyForm });
  const [lineItems, setLineItems] = useState<ExpenseLineItem[]>([]);
  const [nextLineId, setNextLineId] = useState(1);

  if (!isOpen) return null;

  const vatMode = methods.watch("vatMode");

  const getLineTotals = (qty: number, amount: number) => {
    const rawBase = qty * amount;
    if (vatMode === "VAT Inclusive") {
      const base = rawBase / (1 + VAT_RATE);
      return { base, vat: rawBase - base, total: rawBase };
    }
    const vat = rawBase * VAT_RATE;
    return { base: rawBase, vat, total: rawBase + vat };
  };

  const resetAll = () => {
    methods.reset(emptyForm);
    setLineItems([]);
    setNextLineId(1);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const handleAddLine = () => {
    const values = methods.getValues();
    if (!values.draftAccountName || !values.draftAccountName.trim()) return;

    setLineItems((current) => [
      ...current,
      {
        id: nextLineId,
        accountName: values.draftAccountName.trim(),
        note: values.draftNote.trim(),
        qty: Number(values.draftQty) || 0,
        amount: Number(values.draftAmount) || 0,
      },
    ]);
    setNextLineId((id) => id + 1);
    methods.setValue("draftAccountName", "");
    methods.setValue("draftNote", "");
    methods.setValue("draftQty", "1");
    methods.setValue("draftAmount", "");
  };

  const handleRemoveLine = (id: number) => {
    setLineItems((current) => current.filter((line) => line.id !== id));
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    if (!values.supplierName || !values.supplierName.trim()) return;
    if (lineItems.length === 0) return;

    onAdd({
      supplierName: values.supplierName.trim(),
      date: values.date,
      paymentType: values.paymentType,
      invoiceNo: values.invoiceNo.trim(),
      vatMode: values.vatMode,
      lineItems: lineItems.map(({ accountName, note, qty, amount }) => ({
        accountName,
        note,
        qty,
        amount,
      })),
    });

    resetAll();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#2C192BE5] p-4 py-6 backdrop-blur-[2px]">
      <FormProvider {...methods}>
        <div className="relative my-auto w-full max-w-[920px]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute z-10 right-2 top-2 flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white bg-[#2B102B]/60 text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px] sm:h-[42px] sm:w-[42px]"
            aria-label="Close expense modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div
            className="
              h-auto
              w-full
              rounded-[20px]
              border
              border-gray-600
              bg-[#2C192BE5]
              px-4
              py-6
              shadow-[0_0_30px_rgba(0,0,0,0.35)]
              sm:px-[34px]
              sm:py-[26px]
            "
          >
            <h3 className="mb-[14px] text-[18px] font-semibold text-white sm:text-[26px]">
              Expense
            </h3>

            <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
              <div className="rounded-[12px] bg-black px-[14px] py-[12px]">
            

               <div className="flex items-end gap-[8px]">
  <div className="min-w-0 flex-1">
    <FormInput
      name="supplierName"
      placeholder="Enter Customer Name"
      label="Select Supplier"
    />
  </div>
  <button
    type="button"
    className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] border border-[#777777] bg-[#1A0F1A] text-white"
    aria-label="Add supplier"
  >
    <Plus size={16} />
  </button>
</div>

                <div className="mt-[10px] space-y-[6px] text-[16px] font-normal text-[#A1A1A1]">
                  <p>TRN: -</p>
                  <p>Address: -</p>
                </div>
              </div>

              <div className="rounded-[12px] bg-black px-[14px] py-[12px]">
                <div className="grid grid-cols-2 gap-x-[12px] gap-y-[10px]">
                  <label className="block">
                  
                    <FormInput name="date" label="Date" />
                  </label>

                
                    <FormCombobox
                      name="paymentType"
                      placeholder="Select Or Search"
                      options={PAYMENT_TYPE_OPTIONS}
                         label="Payment Type"
                    />
            

               
                    
                    <FormInput name="invoiceNo" label="Invoice No." placeholder="Enter INV No." />
                  

                 
                    <FormCombobox
                      name="vatMode"
                      placeholder="Select VAT Mode"
                      options={VAT_MODE_OPTIONS}
                      label="VAT Mode"
                    />
             
                </div>
              </div>
            </div>

            <div className="mt-[12px] rounded-[12px] bg-black px-[14px] py-[12px]">
              <div
                className="
                  grid
                  grid-cols-1
                  items-end
                  gap-[10px]
                  sm:grid-cols-[1.4fr_1.4fr_0.7fr_1fr_42px]
                  sm:gap-[10px]
                "
              >
                <label className="block min-w-0">
                 
                  <FormCombobox
                    name="draftAccountName"
                    placeholder="Select or search"
                    options={accountOptions}
                    label="Account Name"
                  />
                </label>

                <label className="block min-w-0">
                  
                  <FormInput name="draftNote" placeholder="Item note" label="Note"/>
                </label>

                <label className="block min-w-0">
                
                   
                  <FormInput name="draftQty" placeholder="1" label="Qty"/>
                </label>

                <label className="block min-w-0">
                  
                  <FormInput name="draftAmount" placeholder="Enter prize" label="Amount"/>
                </label>

                <button
                  type="button"
                  onClick={handleAddLine}
                  className="mb-[1px] flex h-[38px] w-[38px] items-center justify-center rounded-[8px] border border-[#777777] bg-[#1A0F1A] text-white"
                  aria-label="Add line item"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="mt-[12px] flex flex-col gap-2">
              <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr_80px] rounded-[10px] bg-black px-[14px] py-[10px] text-[12px] font-medium text-white sm:grid">
                {MODAL_ITEM_COLUMNS.map((column) => (
                  <span key={column}>{column}</span>
                ))}
              </div>

              {lineItems.length === 0 ? (
                <div className="min-h-0 rounded-[10px] bg-[#82367F4D] px-[14px] py-[14px] text-[13px] text-white/80">
                  No Data Available
                </div>
              ) : (
                <div className="flex flex-col gap-[6px]">
                  {lineItems.map((line) => {
                    const { base, vat, total } = getLineTotals(
                      line.qty,
                      line.amount,
                    );

                    return (
                      <div
                        key={line.id}
                        className="
                          grid
                          grid-cols-[1fr_60px]
                          items-center
                          gap-[8px]
                          rounded-[10px]
                          bg-[#82367F4D]
                          px-[14px]
                          py-[10px]
                          text-[13px]
                          text-white
                          sm:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr_80px]
                          sm:gap-0
                        "
                      >
                        <span className="truncate">{line.accountName}</span>
                        <span className="hidden sm:block">{line.qty || "-"}</span>
                        <span className="hidden sm:block">
                          {line.amount ? line.amount.toFixed(2) : "-"}
                        </span>
                        <span className="hidden sm:block">
                          {base.toFixed(2)}
                        </span>
                        <span className="hidden sm:block">
                          {vat.toFixed(2)}
                        </span>
                        <span className="hidden font-medium sm:block">
                          {total.toFixed(2)}
                        </span>
                        <div className="flex justify-end sm:justify-start">
                          <button
                            type="button"
                            onClick={() => handleRemoveLine(line.id)}
                            className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[#777777] bg-[#1A0F1A] text-white"
                            aria-label={`Remove ${line.accountName}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {/* Qty/Amount/Total stacked for mobile where the grid collapses */}
                        <div className="col-span-2 flex flex-wrap gap-[12px] text-[12px] text-white/70 sm:hidden">
                          <span>Qty: {line.qty || "-"}</span>
                          <span>
                            Amount: {line.amount ? line.amount.toFixed(2) : "-"}
                          </span>
                          <span>Base: {base.toFixed(2)}</span>
                          <span>VAT: {vat.toFixed(2)}</span>
                          <span>Total: {total.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-[16px] flex justify-end">
              <Button
                type="button"
                variant="add"
                size="none"
                onClick={handleSubmit}
              >
                ADD
              </Button>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}