"use client";

import FormInput from "@/src/components/form/FormInput";
import { X } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import type { RestaurantRecord, RestaurantPayload } from "@/src/api/restaurant";

export type RestaurantFormValues = {
  name: string;
  address: string;
  country: string;
  state: string;
  city: string;
  phone: string;
  phone2: string;
  phone3: string;
  email: string;
  trn: string;
  vatPercentage: string;
  openingTime: string;
  closingTime: string;
  currency: string;
  currencySymbol: string;
};

const emptyForm: RestaurantFormValues = {
  name: "",
  address: "",
  country: "",
  state: "",
  city: "",
  phone: "",
  phone2: "",
  phone3: "",
  email: "",
  trn: "",
  vatPercentage: "0",
  openingTime: "",
  closingTime: "",
  currency: "",
  currencySymbol: "",
};

function recordToFormValues(record: RestaurantRecord): RestaurantFormValues {
  return {
    name: record.name ?? "",
    address: record.address ?? "",
    country: record.country ?? "",
    state: record.state ?? "",
    city: record.city ?? "",
    phone: record.phone ?? "",
    phone2: record.phone2 ?? "",
    phone3: record.phone3 ?? "",
    email: record.email ?? "",
    trn: record.trn ?? "",
    vatPercentage: String(record.vatPercentage ?? 0),
    openingTime: record.openingTime ?? "",
    closingTime: record.closingTime ?? "",
    currency: record.currency ?? "",
    currencySymbol: record.currencySymbol ?? "",
  };
}

type EditRestaurantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: RestaurantPayload) => Promise<void>;
  initialRecord: RestaurantRecord | null;
};

export default function EditRestaurantModal({
  isOpen,
  onClose,
  onSave,
  initialRecord,
}: EditRestaurantModalProps) {
  const methods = useForm<RestaurantFormValues>({ defaultValues: emptyForm });

  // Seed the form whenever the modal opens or the record changes
  useEffect(() => {
    if (!isOpen) return;
    methods.reset(
      initialRecord ? recordToFormValues(initialRecord) : emptyForm,
    );
  }, [isOpen, initialRecord, methods]);

  if (!isOpen) return null;

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = methods.handleSubmit(async (values) => {
    const payload: RestaurantPayload = {
      name: values.name.trim(),
      address: values.address.trim(),
      country: values.country.trim(),
      state: values.state.trim(),
      city: values.city.trim(),
      phone: values.phone.trim(),
      phone2: values.phone2.trim() || null,
      phone3: values.phone3.trim() || null,
      email: values.email.trim(),
      trn: values.trn.trim() || null,
      vatPercentage: Number(values.vatPercentage) || 0,
      openingTime: values.openingTime.trim() || null,
      closingTime: values.closingTime.trim() || null,
      currency: values.currency.trim(),
      currencySymbol: values.currencySymbol.trim(),
    };
    await onSave(payload);
    methods.reset(emptyForm);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 py-6 backdrop-blur-[2px]">
      <FormProvider {...methods}>
        <div className="relative my-auto w-full max-w-[860px]">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg"
            aria-label="Close edit restaurant modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="flex w-full flex-col gap-[16px] rounded-[20px] border border-[#A6A6A6] bg-[#E9E9E9] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px]">
            <h3 className="font-poppins text-[22px] font-semibold leading-none text-black">
              Edit Restaurant
            </h3>

            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-3">
              <FormInput name="name" label="Restaurant Name" placeholder="Enter name" />
              <FormInput name="email" label="Email" placeholder="Enter email" />
              <FormInput name="phone" label="Phone" placeholder="Enter phone" />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-3">
              <FormInput name="phone2" label="Phone 2" placeholder="Optional" />
              <FormInput name="phone3" label="Phone 3" placeholder="Optional" />
              <FormInput name="address" label="Address" placeholder="Enter address" />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-3">
              <FormInput name="country" label="Country" placeholder="Enter country" />
              <FormInput name="state" label="State" placeholder="Enter state" />
              <FormInput name="city" label="City" placeholder="Enter city" />
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
              <FormInput name="openingTime" label="Opening Time" placeholder="e.g. 09:00" />
              <FormInput name="closingTime" label="Closing Time" placeholder="e.g. 22:00" />
              <FormInput name="currency" label="Currency" placeholder="e.g. AED" />
              <FormInput name="currencySymbol" label="Currency Symbol" placeholder="e.g. د.إ" />
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
              <FormInput name="trn" label="TRN" placeholder="Tax Registration Number" />
              <FormInput name="vatPercentage" label="VAT %" placeholder="e.g. 5" />
            </div>

            <div className="mt-auto flex justify-end">
              <Button
                type="button"
                variant="add"
                size="none"
                onClick={handleSubmit}
              >
                SAVE
              </Button>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
