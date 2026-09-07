"use client";

import FormInput from "@/src/components/form/FormInput";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import FormCombobox, { selectType } from "../form/FormCombobox";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

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

const PURCHASE_UNIT_OPTIONS: selectType[] = [
  { label: "Kg", value: "Kg" },
  { label: "Gram", value: "Gram" },
  { label: "Litre", value: "Litre" },
  { label: "Piece", value: "Piece" },
];

type AddItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: NewItemInput) => void;
};

export default function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const methods = useForm<ItemFormValues>({ defaultValues: emptyForm });

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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="
          w-[812px] max-w-[calc(100vw-2rem)]
          h-auto min-h-[280px]
          flex flex-col justify-between gap-[16px]
          rounded-[20px] border-[1px]
          bg-[#EFEFEF] text-black
          pt-[26px] pr-[34px] pb-[26px] pl-[34px]
          opacity-100 shadow-[0_0_30px_rgba(0,0,0,0.35)]
        "
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg"
          aria-label="Close add item modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col gap-[16px]">
          <DialogTitle className="text-[22px] font-semibold text-black">
            Add Item
          </DialogTitle>

          <FormProvider {...methods}>
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
                  options={PURCHASE_UNIT_OPTIONS}
                  name="purchaseUnit"
                  placeholder="Select Or Search"
                  label="Purchase Unit"
                />
              </label>
            </div>
          </FormProvider>
        </div>

        <FormProvider {...methods}>
          <div className="flex justify-end">
            <Button type="button" variant="add" size="none" onClick={handleSubmit}>
              ADD
            </Button>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}