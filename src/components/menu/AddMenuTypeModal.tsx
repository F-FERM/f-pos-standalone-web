"use client";

import FormInput from "@/src/components/form/FormInput";
import { X } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

export type MenuTypeFormValues = {
  name: string;
};

export type NewMenuTypeInput = {
  name: string;
};

const emptyForm: MenuTypeFormValues = { name: "" };

type AddMenuTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (menuType: NewMenuTypeInput) => void;
  initialMenuType?: string | null;
  mode?: "add" | "edit";
};

export default function AddMenuTypeModal({
  isOpen,
  onClose,
  onAdd,
  initialMenuType = null,
  mode = "add",
}: AddMenuTypeModalProps) {
  const methods = useForm<MenuTypeFormValues>({ defaultValues: emptyForm });

  useEffect(() => {
    if (!isOpen) return;
    methods.reset({ name: initialMenuType ?? "" });
  }, [initialMenuType, isOpen, methods]);

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    const name = values.name.trim();
    if (!name) return;

    onAdd({ name });
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
          rounded-[20px] border-[1px]
          bg-[#E9E9E9] text-black
          pt-[26px] pr-[34px] pb-[26px] pl-[34px]
          opacity-100 shadow-[0_0_30px_rgba(0,0,0,0.35)]
        "
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg"
          aria-label="Close menu type modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div>
          <DialogTitle className="text-[22px] font-semibold text-black">
            {mode === "edit" ? "Edit Menu Type" : "Add Menu Type"}
          </DialogTitle>
          <p className="text-[14px] text-[#A4A4A4] font-medium mb-2">
            Define food categories to streamline menu management (e.g. Desserts,
            Beverages).
          </p>
        </div>

        <FormProvider {...methods}>
          <label className="block w-full">
            <FormInput
              name="name"
              label="Menu Type Name"
              placeholder="Enter Menu Type Name"
            />
          </label>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="add"
              size="none"
              onClick={handleSubmit}
            >
              {mode === "edit" ? "SAVE" : "ADD"}
            </Button>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
