"use client";

import FormInput from "@/src/components/form/FormInput";
import { X } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../ui/button";

type KitchenFormValues = { name: string };
export type NewKitchenInput = { name: string };

type AddKitchenModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (kitchen: NewKitchenInput) => void;
  initialName?: string | null;
  mode?: "add" | "edit";
};

const emptyForm: KitchenFormValues = { name: "" };

export default function AddKitchenModal({
  isOpen,
  onClose,
  onAdd,
  initialName = null,
  mode = "add",
}: AddKitchenModalProps) {
  const methods = useForm<KitchenFormValues>({ defaultValues: emptyForm });

  useEffect(() => {
    if (isOpen) methods.reset({ name: initialName || "" });
  }, [initialName, isOpen, methods]);

  if (!isOpen) return null;

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    const name = methods.getValues("name").trim();
    if (!name) return;
    onAdd({ name });
    methods.reset(emptyForm);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]">
      <FormProvider {...methods}>
        <div className="relative w-full max-w-[812px] rounded-[20px] border border-[#A6A6A6] bg-[#E9E9E9] p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px]">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close kitchen modal"
            className="absolute right-[-18px] top-[-18px] flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
          <h3 className="font-poppins text-[22px] font-semibold text-black">
            {mode === "edit" ? "Edit Kitchen" : "Add Kitchen"}
          </h3>
          <div className="mt-4 rounded-[10px] border border-[#B5B5B5] bg-[#E9E9E9] p-2.5">
            <FormInput
              name="name"
              label="Kitchen Name"
              placeholder="Enter Kitchen Name"
            />
          </div>
          <div className="mt-5 flex justify-end">
            <Button
              type="button"
              variant="add"
              size="none"
              onClick={handleSubmit}
            >
              {mode === "edit" ? "SAVE" : "ADD"}
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
