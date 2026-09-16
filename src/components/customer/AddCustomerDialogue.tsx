"use client";

import FormInput from "@/src/components/form/FormInput";
import FormPhoneNumberInput from "@/src/components/form/FormPhoneNumberInput";
import FormTextArea from "@/src/components/form/FormTextArea";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

import { useAddCustomer } from "@/src/api/customer/hooks/create.hook";
import { useUpdateCustomer } from "@/src/api/customer/hooks/update.hook";
import { ListCustomerByIdApi } from "@/src/api/customer/api/GetById";
import { useQuery } from "@tanstack/react-query";

const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required").max(150),
  credit: z
    .number({ error: "Credit must be a number" })
    .optional(),
  phone: z.string().max(20, "Phone number looks too long").optional().or(z.literal("")),
  countryCode: z.string().optional(),
  address: z.string().max(500).optional().or(z.literal("")),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

const emptyForm: CustomerFormValues = {
  name: "",
  credit: 0,
  phone: "",
  countryCode: "+91",
  address: "",
};

import { Country } from "country-state-city";

function getPhoneParts(phone: string) {
  const allCountries = Country.getAllCountries();
  // Sort by length of phonecode descending so we match +971 before +9
  const sortedCodes = Array.from(new Set(allCountries.map((c) => `+${c.phonecode}`))).sort((a, b) => b.length - a.length);
  
  const countryCode = sortedCodes.find((c) => phone.startsWith(c)) || "+91";
  return {
    countryCode,
    phone: phone.startsWith(countryCode)
      ? phone.slice(countryCode.length)
      : phone.replace(/\D/g, ""),
  };
}

type AddCustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  customerId?: string;
};

export default function AddCustomerModal({
  isOpen,
  onClose,
  mode = "add",
  customerId,
}: AddCustomerModalProps) {
  const isEdit = mode === "edit";

  const form = useForm<CustomerFormValues>({
    defaultValues: emptyForm,
    resolver: zodResolver(customerSchema),
  });

  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const { data: customerData } = useQuery({
    queryKey: ["getCustomerById", customerId],
    queryFn: () => ListCustomerByIdApi(String(customerId)),
    enabled: isEdit && !!customerId,
  });

  const { mutate: addCustomer, isPending: isAdding } = useAddCustomer({
    form,
    onOpenChange,
  });
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer({
    form,
    onOpenChange,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && customerData) {
      const { countryCode, phone } = getPhoneParts(customerData.data.phone);
      form.reset({
        name: customerData.data.name,
        credit: customerData.data.credit,
        phone,
        countryCode,
        address: customerData.data.address,
      });
      return;
    }

    if (!isEdit) form.reset(emptyForm);
  }, [isEdit, customerData, isOpen, form]);

  function handleClose() {
    form.reset(emptyForm);
    onClose();
  }

  const handleSubmit = form.handleSubmit((values) => {
    const payload = {
      name: values.name.trim(),
      credit: values.credit ?? 0,
      phone: values.phone?.trim() ? `${values.countryCode ?? ""}${values.phone.trim()}` : "",
      address: String(values.address || "").trim(),
    };

    if (isEdit && customerId) {
      updateCustomer({ id: customerId, value: payload });
    } else {
      addCustomer(payload);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="
          w-[812px] max-w-[calc(100vw-2rem)]
          h-auto min-h-[583px]
          flex flex-col gap-[10px]
          rounded-[20px] border-[1px]
          bg-[#E9E9E9] text-white
          pt-[26px] pr-[34px] pb-[26px] pl-[34px]
          opacity-100 shadow-[0_0_30px_rgba(0,0,0,0.35)]
        "
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg"
          aria-label="Close add customer modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div>
          <DialogTitle className="text-[22px] font-semibold text-black">
            {isEdit ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
        </div>

        <FormProvider {...form}>
          <div className="space-y-[14px]">
            <label className="block">
              <FormInput name="name" placeholder="Enter Customer Name" label="Customer Name" required />
            </label>

            <label className="block">
              <FormInput name="credit" type="number" label="Credit" />
            </label>

            <label className="block">
              <FormPhoneNumberInput
                name="phone"
                label="Customer Phone No"
                countryCode={form.watch("countryCode")}
                onChange={(phone: string, country: string) => {
                  form.setValue("phone", phone);
                  form.setValue("countryCode", country);
                }}
              />
            </label>

            <label className="block">
              <FormTextArea name="address" placeholder="Enter Customer Address" label="Customer Address" />
            </label>
          </div>

          <div className="mt-[22px] flex justify-end">
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}