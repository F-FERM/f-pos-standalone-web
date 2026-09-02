"use client";


import FormInput from "@/src/components/form/FormInput";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

export type CategoryFormValues = {
  categoryName: string;
};

export type NewCategoryInput = {
  categoryName: string;
};

const emptyForm: CategoryFormValues = { categoryName: "" };

type AddCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: NewCategoryInput) => void;
};

export default function AddCategoryModal({
  isOpen,
  onClose,
  onAdd,
}: AddCategoryModalProps) {
  const methods = useForm<CategoryFormValues>({ defaultValues: emptyForm });

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    if (!values.categoryName || !values.categoryName.trim()) return;

    onAdd({ categoryName: values.categoryName.trim() });
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
          h-[249px]
          flex flex-col justify-center gap-[10px]
          rounded-[20px] border border-gray-600 border-[1px]
          bg-[#2C192BE5] text-white
         pt-[26px] pr-[34px] pb-[26px] pl-[34px]
          opacity-100 shadow-[0_0_30px_rgba(0,0,0,0.35)]
        "
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white bg-[#2B102B]/60 text-[#FF3B3B] shadow-lg"
          aria-label="Close category modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div>
          <DialogTitle className=" text-[22px] font-semibold text-white">
            Add Category
          </DialogTitle>
          <p className="text-[14px] text-[#A4A4A4] font-medium mb-2">
            Define food categories to streamline menu management (e.g.
            Desserts, Beverages).
          </p>
        </div>

        <FormProvider {...methods}>
          <label className="block">
          
            <FormInput name="categoryName" label="Category Name" placeholder="Enter Category Name" />
          </label>

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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}