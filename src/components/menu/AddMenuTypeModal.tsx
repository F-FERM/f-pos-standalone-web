"use client";

import FormMultiSelectInput, {
  selectType,
} from "@/src/components/form/FormMultiSelectInput";
import { X } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

export type MenuTypeFormValues = {
  menuTypes: string[];
};

export type NewMenuTypeInput = {
  menuType: string;
};

const emptyForm: MenuTypeFormValues = { menuTypes: [] };

type AddMenuTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (menuType: NewMenuTypeInput) => void;
  existingOptions?: selectType[];
};

export default function AddMenuTypeModal({
  isOpen,
  onClose,
  onAdd,
  existingOptions = [],
}: AddMenuTypeModalProps) {
  const methods = useForm<MenuTypeFormValues>({ defaultValues: emptyForm });
  const [createdOptions, setCreatedOptions] = useState<selectType[]>([]);

  const handleClose = () => {
    methods.reset(emptyForm);
    setCreatedOptions([]);
    onClose();
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    const menuTypes = values.menuTypes.filter((v) => v && v.trim());
    if (menuTypes.length === 0) return;

    menuTypes.forEach((menuType) => onAdd({ menuType }));

    methods.reset(emptyForm);
    setCreatedOptions([]);
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
          h-[249px]
          flex flex-col justify-center gap-[10px]
          rounded-[20px] border-[1px]
          bg-[#E9E9E9] text-black
          pt-[26px] pr-[34px] pb-[26px] pl-[34px]
          opacity-100 shadow-[0_0_30px_rgba(0,0,0,0.35)]
        "
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-white text-[#FF3B3B] shadow-lg"
          aria-label="Close menu type modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div>
          <DialogTitle className="text-[22px] font-semibold text-black">
            Add Menu Type
          </DialogTitle>
          <p className="text-[14px] text-[#A4A4A4] font-medium mb-2">
            Define food categories to streamline menu management (e.g.
            Desserts, Beverages).
          </p>
        </div>

        <FormProvider {...methods}>
          <label className="block w-full">
            <FormMultiSelectInput
              name="menuTypes"
              label="Add Menu Type"
              placeholder="Enter Menu Type..."
              searchPlaceholder="Type a menu type and press +"
              options={[...existingOptions, ...createdOptions]}
              allowCreate
              className="w-full"
              onCreate={(label) =>
                setCreatedOptions((prev) =>
                  prev.some((o) => o.value === label)
                    ? prev
                    : [...prev, { label, value: label }],
                )
              }
            />
          </label>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="add"
              size="none"
              onClick={handleSubmit}
            >
              ADD
            </Button>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}