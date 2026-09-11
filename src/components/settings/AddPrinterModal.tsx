"use client";

import FormCombobox, { selectType } from "@/src/components/form/FormCombobox";
import FormInput from "@/src/components/form/FormInput";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";

export type PrinterFormValues = {
  printerName: string;
  printerType: string;
  printerIp: string;
};

export type NewPrinterInput = {
  printerName: string;
  printerType: string;
  printerIp: string;
};

const emptyForm: PrinterFormValues = {
  printerName: "",
  printerType: "",
  printerIp: "",
};

const PRINTER_TYPE_OPTIONS: selectType[] = [
  { label: "Kitchen Printer", value: "Kitchen Printer" },
  { label: "Bill Printer", value: "Bill Printer" },
  { label: "Bar Printer", value: "Bar Printer" },
];

type AddPrinterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (printer: NewPrinterInput) => void;
};

export default function AddPrinterModal({ isOpen, onClose, onAdd }: AddPrinterModalProps) {
  const methods = useForm<PrinterFormValues>({ defaultValues: emptyForm });

  if (!isOpen) return null;

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    if (!values.printerName || !values.printerName.trim()) return;

    onAdd({
      printerName: values.printerName.trim(),
      printerType: values.printerType,
      printerIp: values.printerIp.trim(),
    });

    methods.reset(emptyForm);
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-[2px]">
      <FormProvider {...methods}>
        <div
          className="absolute"
          style={{
            top: 204,
            left: 106,
            width: 812,
            height: 333,
            borderRadius: 20,
            border: "1px solid #A6A6A6",
            background: "#E9E9E9",
            paddingTop: 26,
            paddingRight: 34,
            paddingBottom: 26,
            paddingLeft: 34,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            boxShadow: "0 0 30px rgba(0,0,0,0.35)",
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg"
            aria-label="Close printer modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <h3
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: 22,
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#000000",
            }}
            className="mb-2"
          >
            Add Printer
          </h3>

          <div
            style={{
              width: 742,
              height: 176,
              borderRadius: 10,
              border: "1px solid #B5B5B5",
              background: "#E9E9E9",
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div className="grid grid-cols-2 gap-x-[12px] gap-y-[10px]">
              <label className="block">
                <FormInput name="printerName" placeholder="Enter Printer Name" label="Printer Name" />
              </label>

              <label className="block">
                <FormCombobox
                  name="printerType"
                  placeholder="Select or search"
                  options={PRINTER_TYPE_OPTIONS}
                  label="Printer Type"
                />
              </label>

              <label className="col-span-2 block">
                <FormInput name="printerIp" placeholder="Enter Printer Ip" label="Printer Ip" />
              </label>
            </div>
          </div>

          <div className="mt-auto flex justify-end">
            <Button type="button" variant="add" size="none" onClick={handleSubmit}>
              ADD
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
