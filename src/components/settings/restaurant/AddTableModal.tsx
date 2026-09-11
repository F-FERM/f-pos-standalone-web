"use client";

import FormCombobox, { selectType } from "@/src/components/form/FormCombobox";
import FormInput from "@/src/components/form/FormInput";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "../../ui/button";

export type TableFormValues = {
  floor: string;
  tableName: string;
  capacity: string;
};

export type NewTableInput = {
  floor: string;
  tableName: string;
  capacity: number;
};

const emptyForm: TableFormValues = { floor: "", tableName: "", capacity: "" };

type AddTableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (table: NewTableInput) => void;
  floorOptions?: selectType[];
  initialTable?: NewTableInput | null;
  mode?: "add" | "edit";
};

export default function AddTableModal({
  isOpen,
  onClose,
  onAdd,
  floorOptions = [],
  initialTable = null,
  mode = "add",
}: AddTableModalProps) {
  const methods = useForm<TableFormValues>({ defaultValues: emptyForm });

  useEffect(() => {
    if (!isOpen) return;
    methods.reset(
      initialTable
        ? {
            floor: initialTable.floor,
            tableName: initialTable.tableName,
            capacity: String(initialTable.capacity),
          }
        : emptyForm,
    );
  }, [initialTable, isOpen, methods]);

  if (!isOpen) return null;

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    if (!values.floor || !values.tableName || !values.tableName.trim()) return;

    onAdd({
      floor: values.floor,
      tableName: values.tableName.trim(),
      capacity: Number(values.capacity) || 0,
    });

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
            aria-label="Close table modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="flex min-h-[420px] w-full flex-col gap-[16px] rounded-[20px] border border-[#A6A6A6] bg-[#E9E9E9] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px]">
            <h3 className="font-poppins text-[22px] font-semibold leading-none text-black">
              {mode === "edit" ? "Edit Table" : "Add Table"}
            </h3>

            <div className="flex w-full flex-col gap-[10px] rounded-[10px] border border-[#B5B5B5] bg-[#E9E9E9] p-2.5 sm:max-w-[742px]">
              <label className="block">
                <FormCombobox
                  name="floor"
                  placeholder="Select Or Search"
                  options={floorOptions}
                  label="Floor"
                />
              </label>

              <label className="block">
                <FormInput
                  name="tableName"
                  placeholder="Enter Table"
                  label="Table"
                />
              </label>

              <label className="block">
                <FormInput
                  name="capacity"
                  type="number"
                  placeholder="Enter Capacity"
                  label="Capacity"
                />
              </label>
            </div>

            <div className="mt-auto flex justify-end">
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
        </div>
      </FormProvider>
    </div>
  );
}

