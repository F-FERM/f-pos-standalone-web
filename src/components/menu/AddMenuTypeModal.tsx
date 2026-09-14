// src/components/menu/AddMenuTypeModal.tsx
"use client";

import FormInput from "@/src/components/form/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";

import { useAddMenuType } from "@/src/api/menu-type/hooks/create.hook";
import { useUpdateMenuType } from "@/src/api/menu-type/hooks/update.hook";

const menuTypeSchema = z.object({
  name: z.string().min(1, "Menu type name is required").max(100, "Menu type name must be 100 characters or less"),
});

export type MenuTypeFormValues = z.infer<typeof menuTypeSchema>;
const emptyForm: MenuTypeFormValues = { name: "" };

type AddMenuTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  id?: string;
  initialName?: string | null;
};

export default function AddMenuTypeModal({
  isOpen,
  onClose,
  mode = "add",
  id,
  initialName = null,
}: AddMenuTypeModalProps) {
  const isEdit = mode === "edit";

  const form = useForm<MenuTypeFormValues>({
    defaultValues: emptyForm,
    resolver: zodResolver(menuTypeSchema),
  });

  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const { mutate: addMenuType, isPending: isAdding } = useAddMenuType({ form, onOpenChange });
  const { mutate: updateMenuType, isPending: isUpdating } = useUpdateMenuType({ form, onOpenChange });

  useEffect(() => {
    if (!isOpen) return;
    form.reset({ name: initialName ?? "" });
  }, [initialName, isOpen, form]);

  if (!isOpen) return null;

  const handleClose = () => {
    form.reset(emptyForm);
    onClose();
  };

  const handleSubmit = form.handleSubmit((values) => {
    const name = values.name.trim();
const payload={name}
    if (isEdit && id) {
      updateMenuType({ id, value:payload });
    } else {
      addMenuType(payload);
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 py-6 backdrop-blur-[2px]">
      <FormProvider {...form}>
        <div className="relative my-auto w-full max-w-[812px]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-2 top-2 z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px]"
            aria-label="Close menu type modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="flex min-h-[249px] w-full flex-col gap-[16px] rounded-[20px] border border-[#A6A6A6] bg-[#E9E9E9] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px]">
            <div>
              <h3 className="text-[22px] font-semibold leading-none text-black">
                {isEdit ? "Edit Menu Type" : "Add Menu Type"}
              </h3>
              <p className="mb-2 mt-2 text-[14px] font-medium text-[#A4A4A4]">
                Group items by menu type (e.g. Breakfast, Lunch, Dinner).
              </p>
            </div>

            <div className="flex w-full flex-col gap-[10px] rounded-[10px] border border-[#B5B5B5] bg-[#E9E9E9] p-2.5 sm:max-w-[742px]">
              <FormInput name="name" label="Menu Type Name" placeholder="Enter Menu Type Name" required />
            </div>

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