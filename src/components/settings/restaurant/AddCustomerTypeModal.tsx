"use client";

import FormMultiSelectInput, { selectType } from "@/src/components/form/FormMultiSelectInput";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../ui/button";

export type CustomerTypeFormValues = {
  types: string[];
};

export type NewCustomerTypeInput = {
  types: string[];
};

const emptyForm: CustomerTypeFormValues = { types: [] };

type AddCustomerTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (customerType: NewCustomerTypeInput) => void;
  existingTypeOptions?: selectType[];
};

export default function AddCustomerTypeModal({
  isOpen,
  onClose,
  onAdd,
  existingTypeOptions = [],
}: AddCustomerTypeModalProps) {
  const methods = useForm<CustomerTypeFormValues>({ defaultValues: emptyForm });

  if (!isOpen) return null;

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    const types = (values.types || []).map((t) => t.trim()).filter(Boolean);
    if (types.length === 0) return;

    onAdd({ types });
    methods.reset(emptyForm);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 py-6 backdrop-blur-[2px]">
      <FormProvider {...methods}>
        <div className="relative my-auto w-full max-w-[812px]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg"
            aria-label="Close customer type modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="flex min-h-[249px] w-full flex-col gap-[16px] rounded-[20px] border border-[#A6A6A6] bg-[#E9E9E9] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px] ">
            <h3 className="font-poppins text-[22px] font-semibold leading-none text-black">
              Add Customer Type
            </h3>

            <div className="flex w-full flex-col gap-[10px] rounded-[10px] border border-[#B5B5B5] bg-[#E9E9E9] p-2.5 sm:max-w-[742px]">
              <label className="block">
                <FormMultiSelectInput
                  name="types"
                  label="Type"
                  placeholder="Select or add customer type"
                  options={existingTypeOptions}
                />
              </label>
            </div>

            <div className="mt-auto flex justify-end">
              <Button type="button" variant="add" size="none" onClick={handleSubmit}>
                ADD
              </Button>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}