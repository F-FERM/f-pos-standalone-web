"use client";

import { Button } from "@/src/components/Button";
import FormInput from "@/src/components/form/FormInput";
import FormPhoneNumberInput from "@/src/components/form/FormPhoneNumberInput";
import FormTextArea from "@/src/components/form/FormTextArea";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

export type NewCustomerInput = {
  name: string;
  credit: number;
  phone: string;
  countryCode: string;
  address: string;
};

export type CustomerFormValues = {
  name: string;
  credit: string;
  phone: string;
  countryCode: string;
  address: string;
};

const emptyForm: CustomerFormValues = {
  name: "",
  credit: "0",
  phone: "",
  countryCode: "+91",
  address: "",
};

type AddCustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (customer: NewCustomerInput) => void;
};

export default function AddCustomerModal({
  isOpen,
  onClose,
  onAdd,
}: AddCustomerModalProps) {
  const methods = useForm<CustomerFormValues>({ defaultValues: emptyForm });

  if (!isOpen) return null;

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    if (!values.name || !values.name.trim()) return;

    onAdd({
      name: values.name.trim(),
      credit: Number(values.credit) || 0,
      phone: String(values.phone || "").trim(),
      countryCode: values.countryCode || "+91",
      address: String(values.address || "").trim(),
    });

    methods.reset(emptyForm);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C192BE5] p-4 backdrop-blur-[2px]">
      <FormProvider {...methods}>
        <div className="relative w-full max-w-[812px]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute z-10 right-2 top-2 flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white bg-[#2B102B]/60 text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px] sm:h-[42px] sm:w-[42px]"
            aria-label="Close add customer modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div
            className="
              h-auto
              min-h-[583px]
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
            <h3 className="mb-[18px] text-[18px] font-semibold text-white sm:text-[26px]">
              Add Customer
            </h3>

            <div className="space-y-[14px]">
              <label className="block">
             
                <FormInput
                  name="name"
                  placeholder="Enter Customer Name"
                  label="Customer Name"
               
                />
              </label>

              <label className="block">
               
                <div className="relative">
                  <FormInput
                    name="credit"
                    type="number"
                    label="Credit"
                  />
                  <span className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[13px] text-[#C9C9C9]">
                    INR
                  </span>
                </div>
              </label>

              <label className="block">
              
                <FormPhoneNumberInput
                  name="phone"
                  label="Customer Phone No"
                  countryCode={methods.watch("countryCode")}
                  onChange={(phone: string, country: string) => {
                    methods.setValue("phone", phone);
                    methods.setValue("countryCode", country);
                  }}
               
                />
              </label>

              <label className="block">
            
             
                <FormTextArea
                  name="address"
                  placeholder="Enter Customer Address"
                  label="Customer Address"
                />
              </label>
            </div>

            <div className="mt-[22px] flex justify-end">
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