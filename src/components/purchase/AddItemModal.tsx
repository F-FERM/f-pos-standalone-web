"use client";

import { Button } from "@/src/components/Button";
import FormInput from "@/src/components/form/FormInput";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import FormCombobox, { selectType } from "../form/FormCombobox";

export type NewItemInput = {
  ingredientName: string;
  purchaseUnit: string;
};

export type ItemFormValues = {
  ingredientName: string;
  purchaseUnit: string;
};

const emptyForm: ItemFormValues = {
  ingredientName: "",
  purchaseUnit: "",
};

type AddItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: NewItemInput) => void;
};

export default function AddItemModal({
  isOpen,
  onClose,
  onAdd,
}: AddItemModalProps) {
  const methods = useForm<ItemFormValues>({ defaultValues: emptyForm });

  if (!isOpen) return null;

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    if (!values.ingredientName || !values.ingredientName.trim()) return;

    onAdd({
      ingredientName: values.ingredientName.trim(),
      purchaseUnit: String(values.purchaseUnit || "").trim(),
    });

    methods.reset(emptyForm);
  };

const PAYMENT_TYPE_OPTIONS: selectType[] = [
  { label: "Cash", value: "Cash" },
  { label: "Card", value: "Card" },
  { label: "Bank Transfer", value: "Bank Transfer" },
  { label: "Credit", value: "Credit" },
];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C192BE5] p-4 backdrop-blur-[2px]">
      <FormProvider {...methods}>
        <div className="relative w-full max-w-[812px]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute z-10 right-2 top-2 flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white bg-[#2B102B]/60 text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px] sm:h-[42px] sm:w-[42px]"
            aria-label="Close add item modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div
            className="
              flex
              w-full
              min-h-[329px]
              flex-col
              justify-between
              gap-[16px]
              rounded-[20px]
              border
              border-gray-600
              bg-[#2C192BE5]
              px-[34px]
              py-[26px]
              opacity-100
              shadow-[0_0_30px_rgba(0,0,0,0.35)]
            "
          >
            <div className="flex flex-col gap-[16px]">
              <h3 className="text-[18px] font-semibold text-white sm:text-[26px]">
                Add Item
              </h3>

              <div className="flex flex-col gap-[14px]">
                <label className="block">
                 
                  <FormInput
                    name="ingredientName"
                    placeholder="Enter Ingredient Name"
                    label="Ingredient Name"
                  />
                </label>

                <label className="block">
                 
                  <FormCombobox
                  options={PAYMENT_TYPE_OPTIONS}
                    name="purchaseUnit"
                    placeholder="Select Or Search"
                    label="Purchase Unit"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
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