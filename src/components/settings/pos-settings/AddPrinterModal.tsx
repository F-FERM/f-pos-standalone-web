"use client";

import FormCombobox, { selectType } from "@/src/components/form/FormCombobox";
import FormInput from "@/src/components/form/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";


import { useAddPrinter } from "@/src/api/printer/hooks/create.hook";
import { useUpdatePrinter } from "@/src/api/printer/hooks/update.hook";
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";

const printerSchema = z.object({
  printerName: z
    .string()
    .min(1, "Printer name is required")
    .max(100, "Printer name must be 100 characters or less"),
  printerType: z.string().min(1, "Printer type is required"),
  customerTypeId: z.string().min(1, "Customer type is required"),
  kitchenId: z.string().min(1, "Kitchen is required"),
  printerIp: z
    .string()
    .min(1, "Printer IP / model is required")
    .max(200, "Printer IP must be 200 characters or less"),
  paperWidth: z.string().min(1, "Paper width is required"),
  isDefault: z.boolean(),
});

export type PrinterFormValues = z.infer<typeof printerSchema>;
export type NewPrinterInput = PrinterFormValues;

const emptyForm: PrinterFormValues = {
  printerName: "",
  printerType: "",
  customerTypeId: "",
  kitchenId: "",
  printerIp: "",
  isDefault: false,
  paperWidth: "",
};

const PRINTER_TYPE_OPTIONS: selectType[] = [
  { label: "Customer Type", value: "Customer Type" },
  { label: "KOT", value: "KOT" },
];

const PAPER_WIDTH_OPTIONS: selectType[] = [
  { label: "MM_58", value: "58mm" },
  { label: "MM_80", value: "80mm" },
];

type AddPrinterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  id?: string;
  initialPrinter?: NewPrinterInput | null;
  kitchenOptions: selectType[];
  customerTypeOptions: selectType[];
};

export default function AddPrinterModal({
  isOpen,
  onClose,
  mode = "add",
  id,
  initialPrinter = null,
  kitchenOptions,
  customerTypeOptions,
}: AddPrinterModalProps) {
  const isEdit = mode === "edit";

  const form = useForm<PrinterFormValues>({
    defaultValues: emptyForm,
    resolver: zodResolver(printerSchema),
  });

  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const { mutate: addPrinter, isPending: isAdding } = useAddPrinter({ form, onOpenChange });
  const { mutate: updatePrinter, isPending: isUpdating } = useUpdatePrinter({ form, onOpenChange });

  useEffect(() => {
    if (!isOpen) return;
    form.reset(initialPrinter ?? emptyForm);
  }, [initialPrinter, isOpen, form]);

  const handleClose = () => {
    form.reset(emptyForm);
    onClose();
  };

  const handleSubmit = form.handleSubmit((values) => {
    const payload = {
      ...values,
      printerName: values.printerName.trim(),
      printerIp: values.printerIp.trim(),
    };

    if (isEdit && id) {
      updatePrinter({ id, value: payload });
    } else {
      addPrinter(payload);
    }
  });

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
          flex flex-col gap-[10px]
          rounded-[20px] border-[1px]
          bg-[#E9E9E9]
          pt-[26px] pr-[34px] pb-[26px] pl-[34px]
          opacity-100 shadow-[0_0_30px_rgba(0,0,0,0.35)]
        "
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg"
          aria-label="Close printer modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <DialogTitle className="mb-2 text-[22px] font-semibold text-black">
          {isEdit ? "Edit Printer" : "Add Printer"}
        </DialogTitle>

        <FormProvider {...form}>
          <div
            className="
              w-full rounded-[10px] border-[1px] border-[#B5B5B5]
              bg-[#E9E9E9] p-[10px]
            "
          >
            <div className="grid grid-cols-1 gap-x-[12px] gap-y-[10px] sm:grid-cols-2">
              <label className="block">
                <FormInput
                  name="printerName"
                  placeholder="Enter Printer Name"
                  label="Printer Name"
                  required
                />
              </label>

              <label className="block">
                <FormCombobox
                  name="printerType"
                  placeholder="Select printer type"
                  options={PRINTER_TYPE_OPTIONS}
                  label="Printer Type"
                  required
                />
              </label>

              <label className="block">
                <FormCombobox
                  name="kitchenId"
                  placeholder="Select kitchen"
                  options={kitchenOptions}
                  label="Kitchen"
                  required
                />
              </label>

              <label className="block">
                <FormCombobox
                  name="customerTypeId"
                  placeholder="Select customer type"
                  options={customerTypeOptions}
                  label="Customer Type"
                  required
                />
              </label>

              <label className="block">
                <FormInput
                  name="printerIp"
                  placeholder="Enter Printer IP"
                  label="Printer IP"
                  required
                />
              </label>

              <label className="block">
                <FormCombobox
                  name="paperWidth"
                  placeholder="Select paper width"
                  options={PAPER_WIDTH_OPTIONS}
                  label="Paper Width"
                  required
                />
              </label>

              <label className="col-span-1 flex items-center gap-2 pt-1 sm:col-span-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#B5B5B5]"
                  {...form.register("isDefault")}
                />
                <span className="text-[13px] font-medium text-black">
                  Set as Default Printer
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
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