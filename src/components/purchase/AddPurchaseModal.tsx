"use client";

import { Button } from "@/src/components/Button";
import FormCombobox, { selectType } from "@/src/components/form/FormCombobox";
import FormInput from "@/src/components/form/FormInput";
import { Plus, Trash2, X } from "lucide-react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

export type VatMode = "VAT Inclusive" | "VAT Exclusive";

export type PurchaseLineItemInput = {
  item: string;
  qty: string;
  price: string;
};

export type PurchaseFormValues = {
  supplierName: string;
  date: string;
  paymentType: string;
  invoiceNo: string;
  vatMode: VatMode;
  lineItems: PurchaseLineItemInput[];
};

export type NewPurchaseInput = {
  supplierName: string;
  date: string;
  paymentType: string;
  invoiceNo: string;
  vatMode: VatMode;
  lineItems: { item: string; qty: number; price: number }[];
};

const emptyLineItem: PurchaseLineItemInput = { item: "", qty: "", price: "" };

const emptyForm: PurchaseFormValues = {
  supplierName: "",
  date: "01/01/2026",
  paymentType: "",
  invoiceNo: "",
  vatMode: "VAT Inclusive",
  lineItems: [emptyLineItem],
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
  "No.",
  "Item",
  "Qty",
  "Price",
  "Amount",
  "Actions",
] as const;

type AddPurchaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (purchase: NewPurchaseInput) => void;
  itemOptions?: selectType[];
};

export default function AddPurchaseModal({
  isOpen,
  onClose,
  onAdd,
  itemOptions = [],
}: AddPurchaseModalProps) {
  const methods = useForm<PurchaseFormValues>({ defaultValues: emptyForm });
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "lineItems",
  });

  if (!isOpen) return null;

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    if (!values.supplierName || !values.supplierName.trim()) return;

    const lineItems = values.lineItems
      .filter((line) => line.item && line.item.trim())
      .map((line) => ({
        item: line.item.trim(),
        qty: Number(line.qty) || 0,
        price: Number(line.price) || 0,
      }));

    onAdd({
      supplierName: values.supplierName.trim(),
      date: values.date,
      paymentType: values.paymentType,
      invoiceNo: values.invoiceNo.trim(),
      vatMode: values.vatMode,
      lineItems,
    });

    methods.reset(emptyForm);
  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#2C192BE5] p-4 py-6 backdrop-blur-[2px]">
      <FormProvider {...methods}>
       
        <div className="relative my-auto w-full max-w-[920px]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute z-10 right-2 top-2 flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white bg-[#2B102B]/60 text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px] sm:h-[42px] sm:w-[42px]"
            aria-label="Close purchase modal"
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
              Purchase
            </h3>

            <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
              <div className="rounded-[12px] bg-black px-[14px] py-[12px]">
                <p className="mb-[8px] text-[14px] font-medium text-white">
                  Select Supplier
                </p>

                <div className="flex items-center gap-[8px]">
                  <div className="min-w-0 flex-1">
                    <FormInput
                      name="supplierName"
                      placeholder="Enter Customer Name"
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
                    <span className="mb-[6px] block text-[13px] text-white">
                      Date
                    </span>
                    <FormInput name="date"  />
                  </label>

                  <label className="block">
                    <span className="mb-[6px] block text-[13px] text-white">
                      Payment Type
                    </span>
                    <FormCombobox
                      name="paymentType"
                      placeholder="Select Or Search"
                      options={PAYMENT_TYPE_OPTIONS}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-[6px] block text-[13px] text-white">
                      Invoice No
                    </span>
                    <FormInput
                      name="invoiceNo"
                      placeholder="Enter INV No."
                 
                    />
                  </label>

                  <label className="block">
                    <span className="mb-[6px] block text-[13px] text-white">
                      VAT Mode
                    </span>
                    <FormCombobox
                      name="vatMode"
                      placeholder="Select VAT Mode"
                      options={VAT_MODE_OPTIONS}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-[12px] rounded-[12px] bg-black px-[14px] py-[12px]">
              {fields.map((field, index) => (
                <div
                  key={field.id}
className="
  grid
grid-cols-1
items-end
gap-[10px]
sm:grid-cols-[1fr_1fr_1fr_42px]
sm:gap-[10px]
lg:grid-cols-[0.85fr_1fr_1fr_42px]
lg:gap-[10px]
sm:[&:not(:first-child)]:mt-[10px]
"
>
                  <label className="block min-w-0">
                    <span className="mb-[6px] block text-[13px] text-white">
                      Item
                    </span>
                    <FormCombobox
                      name={`lineItems.${index}.item`}
                      placeholder="Type to search or create"
                      options={itemOptions}
                     
                 
                    />
                  </label>

                  <label className="block min-w-0">
                    <span className="mb-[6px] block text-[13px] text-white">
                      Qty
                    </span>
                    <FormInput
                      name={`lineItems.${index}.qty`}
                      placeholder="Enter quantity"
               
                    />
                  </label>

                  <label className="block min-w-0">
                    <span className="mb-[6px] block text-[13px] text-white">
                      Price
                    </span>
                    <FormInput
                      name={`lineItems.${index}.price`}
                      placeholder="Enter price"
                   
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      fields.length > 1
                        ? remove(index)
                        : append(emptyLineItem)
                    }
                    className="mb-[1px] flex h-[38px] w-[38px] items-center justify-center rounded-[8px] border border-[#777777] bg-[#1A0F1A] text-white"
                    aria-label={
                      index === fields.length - 1
                        ? "Add line item"
                        : "Remove line item"
                    }
                  >
                    {index === fields.length - 1 ? (
                      <Plus size={16} />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              ))}

              {fields.length > 0 &&
                fields[fields.length - 1] &&
                methods.watch(`lineItems.${fields.length - 1}.item`) && (
                  <button
                    type="button"
                    onClick={() => append(emptyLineItem)}
                    className="mt-[10px] flex h-[34px] items-center gap-[6px] rounded-[8px] border border-[#777777] bg-[#1A0F1A] px-[12px] text-[12px] text-white"
                  >
                    <Plus size={14} />
                    Add another item
                  </button>
                )}
            </div>

            <div className="mt-[12px] flex flex-col gap-2">
              <div className="hidden grid-cols-[48px_1.4fr_1fr_1fr_1fr_80px] rounded-[10px] bg-black px-[14px] py-[10px] text-[12px] font-medium text-white sm:grid">
                {MODAL_ITEM_COLUMNS.map((column) => (
                  <span key={column}>{column}</span>
                ))}
              </div>

              {(() => {
                const watchedLineItems = methods.watch("lineItems");
                const rows = watchedLineItems
                  .map((line, originalIndex) => ({ ...line, originalIndex }))
                  .filter((line) => line.item && line.item.trim());

                if (rows.length === 0) {
                  return (
                    <div className="min-h-0 rounded-[10px] bg-[#82367F4D] px-[14px] py-[14px] text-[13px] text-white/80">
                      Line items are added above and will appear on the purchase.
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col gap-[6px]">
                    {rows.map((row, displayIndex) => {
                      const qty = Number(row.qty) || 0;
                      const price = Number(row.price) || 0;
                      const amount = qty * price;

                      return (
                        <div
                          key={row.originalIndex}
                          className="
                            grid
                            grid-cols-[24px_1fr_60px]
                            items-center
                            gap-[8px]
                            rounded-[10px]
                            bg-[#82367F4D]
                            px-[14px]
                            py-[10px]
                            text-[13px]
                            text-white
                            sm:grid-cols-[48px_1.4fr_1fr_1fr_1fr_80px]
                            sm:gap-0
                          "
                        >
                          <span className="text-white/70">
                            {displayIndex + 1}
                          </span>
                          <span className="truncate">{row.item}</span>
                          <span className="hidden sm:block">{qty || "-"}</span>
                          <span className="hidden sm:block">
                            {price ? price.toFixed(2) : "-"}
                          </span>
                          <span className="hidden font-medium sm:block">
                            {amount.toFixed(2)}
                          </span>
                          <div className="flex justify-end sm:justify-start">
                            <button
                              type="button"
                              onClick={() => remove(row.originalIndex)}
                              className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[#777777] bg-[#1A0F1A] text-white"
                              aria-label={`Remove ${row.item}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          {/* Qty/Price/Amount stacked for mobile where the grid collapses */}
                          <div className="col-span-3 flex gap-[12px] text-[12px] text-white/70 sm:hidden">
                            <span>Qty: {qty || "-"}</span>
                            <span>Price: {price ? price.toFixed(2) : "-"}</span>
                            <span>Amount: {amount.toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
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