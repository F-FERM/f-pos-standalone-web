"use client";

import FormMultiSelectInput, {
  selectType,
} from "@/src/components/form/FormMultiSelectInput";
import { X } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../ui/button";

export type FloorFormValues = {
  floorNames: string[];
};

export type NewFloorInput = {
  floorNames: string[];
};

const emptyForm: FloorFormValues = { floorNames: [] };

type AddFloorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (floor: NewFloorInput) => void;
  existingFloorOptions?: selectType[];
  initialFloor?: string | null;
  mode?: "add" | "edit";
};

export default function AddFloorModal({
  isOpen,
  onClose,
  onAdd,
  existingFloorOptions = [],
  initialFloor = null,
  mode = "add",
}: AddFloorModalProps) {
  const methods = useForm<FloorFormValues>({ defaultValues: emptyForm });

  useEffect(() => {
    if (!isOpen) return;
    methods.reset({ floorNames: initialFloor ? [initialFloor] : [] });
  }, [initialFloor, isOpen, methods]);

  if (!isOpen) return null;

  const handleClose = () => {
    methods.reset(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    const floorNames = (values.floorNames || [])
      .map((f) => f.trim())
      .filter(Boolean);
    if (floorNames.length === 0) return;

    onAdd({ floorNames });
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
            aria-label="Close floor modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="flex min-h-[249px] w-full flex-col gap-[16px] rounded-[20px] border  border-[#A6A6A6] bg-[#E9E9E9] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px]">
            <h3 className="font-poppins text-[22px] font-semibold leading-none text-black ">
              {mode === "edit" ? "Edit Floor" : "Add Floor"}
            </h3>

            <div className="flex w-full flex-col gap-[10px] rounded-[10px] border border-[#B5B5B5] bg-[#E9E9E9] p-2.5 sm:max-w-[742px]">
              <label className="block">
                <FormMultiSelectInput
                  name="floorNames"
                  label="Add Floors"
                  placeholder="Enter Floor Name"
                  options={existingFloorOptions}
                  allowCreate
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
