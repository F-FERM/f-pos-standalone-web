"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { useAddCustomerType } from "@/src/api/customer-type/hooks/create.hook";
import { useUpdateCustomerType } from "@/src/api/customer-type/hooks/update.hook";
import FormCombobox, { selectType } from "@/src/components/form/FormCombobox";
import { CUSTOMER_TYPE_OPTIONS, CustomerTypeValue } from "@/src/interfaces/customer-type/AddCustomerTypePayload";
import { Button } from "../../ui/button";

const schema = z.object({
  type: z.string().min(1, "Please select a customer type"),
});

export type CustomerTypeFormValues = z.infer<typeof schema>;

const emptyForm: CustomerTypeFormValues = { type: "" };

type AddCustomerTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  id?: string;
  initialType?: string | null;
};

export default function AddCustomerTypeModal({
  isOpen,
  onClose,
  mode = "add",
  id,
  initialType = null,
}: AddCustomerTypeModalProps) {
  const isEdit = mode === "edit";

  const form = useForm<CustomerTypeFormValues>({
    defaultValues: emptyForm,
    resolver: zodResolver(schema),
  });

  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const { mutate: addCustomerType, isPending: isAdding } = useAddCustomerType({ form, onOpenChange });
  const { mutate: updateCustomerType, isPending: isUpdating } = useUpdateCustomerType({ form, onOpenChange });

  useEffect(() => {
    if (!isOpen) return;
    form.reset({ type: initialType ?? "" });
  }, [initialType, isOpen, form]);

  if (!isOpen) return null;

  const handleClose = () => {
    form.reset(emptyForm);
    onClose();
  };

  const handleSubmit = form.handleSubmit((values) => {
    const type = values.type as CustomerTypeValue;

    const payload = { type };

    if (isEdit && id) {
      updateCustomerType({ id: id, value: payload });
    } else {
      addCustomerType(payload);
    }
  });

  const options: selectType[] = CUSTOMER_TYPE_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 py-6 backdrop-blur-[2px]">
      <FormProvider {...form}>
        <div className="relative my-auto w-full max-w-[812px]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-2 top-2 z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px]"
            aria-label="Close customer type modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="flex min-h-[249px] w-full flex-col gap-[16px] rounded-[20px] border border-[#A6A6A6] bg-[#E9E9E9] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px]">
            <h3 className="text-[22px] font-semibold leading-none text-black">
              {isEdit ? "Edit Customer Type" : "Add Customer Type"}
            </h3>

            <div className="flex w-full flex-col gap-[10px] rounded-[10px] border border-[#B5B5B5] bg-[#E9E9E9] p-2.5 sm:max-w-[742px]">
              <FormCombobox name="type" label="Type" placeholder="Select customer type" options={options} required />
            </div>

            <div className="mt-auto flex justify-end">
              <Button
                type="button"
                variant="add"
                size="none"
                onClick={handleSubmit}
                disabled={isEdit ? isUpdating : isAdding}
              >
                {isEdit ? "SAVE" : "ADD"}
              </Button>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}