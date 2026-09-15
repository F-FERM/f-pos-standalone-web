"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { useAddCustomerType } from "@/src/api/customer-type/hooks/create.hook";
import { useUpdateCustomerType } from "@/src/api/customer-type/hooks/update.hook";
// ASSUMPTION: naming this to match the existing ListFoodByIdApi convention
// (@/src/api/food/api/GetById). Adjust the path/export name if yours differs.
import { ListCustomerTypeByIdApi } from "@/src/api/customer-type/api/GetById";
import FormCombobox, { selectType } from "@/src/components/form/FormCombobox";
import {
  AddCustomerTypePayload,
  CUSTOMER_TYPE_OPTIONS,
  CustomerTypeValue,
} from "@/src/interfaces/customer-type/AddCustomerTypePayload";
import { Button } from "../../ui/button";

const schema = z.object({
  type: z.string().min(1, "Please select a customer type"),
  onlinePlatforms: z.array(z.string()),
});

export type CustomerTypeFormValues = z.infer<typeof schema>;

const emptyForm: CustomerTypeFormValues = { type: "", onlinePlatforms: [] };

type AddCustomerTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  id?: string;
  initialType?: string | null;
  // ASSUMPTION: edit mode needs the previously saved platforms passed in the
  // same way initialType is — add this prop wherever the edit trigger is opened.
  initialOnlinePlatforms?: string[];
};

export default function AddCustomerTypeModal({
  isOpen,
  onClose,
  mode = "add",
  id,
  initialType = null,
  initialOnlinePlatforms = [],
}: AddCustomerTypeModalProps) {
  const isEdit = mode === "edit";

  const form = useForm<CustomerTypeFormValues>({
    defaultValues: emptyForm,
    resolver: zodResolver(schema),
  });
  const [platformInput, setPlatformInput] = useState("");

  const selectedType = form.watch("type");
  const isOnline = selectedType === "ONLINE";

  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const { mutate: addCustomerType, isPending: isAdding } = useAddCustomerType({ form, onOpenChange });
  const { mutate: updateCustomerType, isPending: isUpdating } = useUpdateCustomerType({ form, onOpenChange });

 const { data: customerTypeData } = useQuery({
  queryKey: ["getCustomerTypeById", id],
  queryFn: () => ListCustomerTypeByIdApi(String(id)),
  enabled: isEdit && !!id && isOpen,
});

useEffect(() => {
  if (!isOpen) return;
  if (isEdit && customerTypeData) {
    const record = customerTypeData.data;
    form.reset({
      type: record.type,
      onlinePlatforms: record.type === "ONLINE" ? record.onlinePlatforms ?? [] : [],
    });
  } else if (!isEdit) {
    form.reset(emptyForm);
  }
  setPlatformInput("");
}, [isOpen, isEdit, customerTypeData, form]);

  // Clear out any platforms if the customer type is switched away from ONLINE,
  // so a stale list can't get carried into a non-online payload.
  useEffect(() => {
    if (!isOnline) {
      form.setValue("onlinePlatforms", []);
      setPlatformInput("");
    }
  }, [isOnline, form]);

  if (!isOpen) return null;

  const handleClose = () => {
    form.reset(emptyForm);
    setPlatformInput("");
    onClose();
  };

  const handleAddPlatform = () => {
    const value = platformInput.trim();
    if (!value) return;
    const current = form.getValues("onlinePlatforms") || [];
    if (current.includes(value)) {
      setPlatformInput("");
      return;
    }
    form.setValue("onlinePlatforms", [...current, value]);
    setPlatformInput("");
  };

  const handleRemovePlatform = (value: string) => {
    const current = form.getValues("onlinePlatforms") || [];
    form.setValue(
      "onlinePlatforms",
      current.filter((platform) => platform !== value),
    );
  };

  const handleSubmit = form.handleSubmit((values) => {
    const type = values.type as CustomerTypeValue;

    // If the user typed a platform but never clicked "+" (or hit Enter),
    // fold it in on submit instead of silently dropping it — same pattern
    // used for the Choices input in the food form.
    const pendingPlatform = platformInput.trim();
    const mergedPlatforms =
      pendingPlatform && !values.onlinePlatforms.includes(pendingPlatform)
        ? [...values.onlinePlatforms, pendingPlatform]
        : values.onlinePlatforms;

    const payload: AddCustomerTypePayload = {
      type,
      ...(type === "ONLINE" ? { onlinePlatforms: mergedPlatforms } : {}),
    };

    setPlatformInput("");

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

  const platforms = form.watch("onlinePlatforms") || [];

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

            {isOnline && (
              <div className="flex w-full flex-col gap-[10px] rounded-[10px] border border-[#B5B5B5] bg-[#E9E9E9] p-2.5 sm:max-w-[742px]">
                <label className="mb-1 block text-sm font-medium text-black sm:text-base">
                  Online Platforms
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={platformInput}
                    onChange={(e) => setPlatformInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddPlatform();
                      }
                    }}
                    placeholder="Enter platform name (e.g. Zomato, Swiggy)..."
                    className="w-full rounded-[8px] border border-[#E9E9E9] bg-[#D2D2D2] px-3 py-2 text-sm text-black placeholder:text-[#8A8A8A] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPlatform}
                    aria-label="Add online platform"
                    className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] bg-[#D2D2D2] text-black"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {platforms.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {platforms.map((platform) => (
                      <span
                        key={platform}
                        className="flex items-center gap-1 rounded-[6px] bg-[#9A379633] px-2 py-[3px] text-xs text-[#450042]"
                      >
                        <span className="max-w-[160px] truncate">{platform}</span>
                        <X
                          size={12}
                          className="cursor-pointer hover:text-red-500"
                          onClick={() => handleRemovePlatform(platform)}
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

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