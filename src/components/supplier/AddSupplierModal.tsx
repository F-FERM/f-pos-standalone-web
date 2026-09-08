"use client";

import FormInput from "@/src/components/form/FormInput";
import FormPhoneNumberInput from "@/src/components/form/FormPhoneNumberInput";
import FormTextArea from "@/src/components/form/FormTextArea";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

export type NewSupplierInput = {
  name: string;
  phone: string;
  countryCode: string;
  credit: number;
  trnNo: string;
  address: string;
};

export type SupplierFormValues = {
  name: string;
  phone: string;
  countryCode: string;
  credit: string;
  trnNo: string;
  address: string;
};

const emptyForm: SupplierFormValues = {
  name: "",
  phone: "",
  countryCode: "+91",
  credit: "0",
  trnNo: "",
  address: "",
};

type AddSupplierModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (supplier: NewSupplierInput) => void;
};

export default function AddSupplierModal({
  isOpen,
  onClose,
  onAdd,
}: AddSupplierModalProps) {
  const methods = useForm<SupplierFormValues>({ defaultValues: emptyForm });

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    if (!values.name || !values.name.trim()) return;

    onAdd({
      name: values.name.trim(),
      phone: String(values.phone || "").trim(),
      countryCode: values.countryCode || "+91",
      credit: Number(values.credit) || 0,
      trnNo: String(values.trnNo || "").trim(),
      address: String(values.address || "").trim(),
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
          aria-label="Close add supplier modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div>
          <DialogTitle className="text-[22px] font-semibold text-black">
            Add Supplier
          </DialogTitle>
        </div>

        <FormProvider {...methods}>
          <div className="space-y-[14px]">
            <label className="block">
              <FormInput
                name="name"
                placeholder="Enter Supplier Name"
                label="Supplier Name"
              />
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
              <FormInput name="credit" type="number" label="Credit" />
            </label>

            <label className="block">
              <FormInput
                name="trnNo"
                placeholder="Enter TRN No."
                label="TRN No."
              />
            </label>

            <label className="block">
              <FormTextArea
                name="address"
                placeholder="Enter Address"
                label="Address"
              />
            </label>
          </div>

          <div className="mt-[22px] flex justify-end">
            <Button type="button" variant="add" size="none" onClick={handleSubmit}>
              ADD
            </Button>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}