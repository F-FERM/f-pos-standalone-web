"use client";

import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { X } from "lucide-react";

import FormInput from "@/src/components/form/FormInput";
import { Button } from "../../ui/button";
import { useAddFloor } from "@/src/api/floor/hooks/create.hook";
import { useUpdateFloor } from "@/src/api/floor/hooks/update.hook";

const schema = z.object({ name: z.string().min(1, "Floor name is required").max(100) });
export type FloorFormValues = z.infer<typeof schema>;
const emptyForm: FloorFormValues = { name: "" };

type AddFloorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  id?: string;
  initialFloor?: string | null;
};

export default function AddFloorModal({
  isOpen,
  onClose,
  mode = "add",
  id,
  initialFloor = null,
}: AddFloorModalProps) {
  const isEdit = mode === "edit";
  const form = useForm<FloorFormValues>({ defaultValues: emptyForm, resolver: zodResolver(schema) });
  const onOpenChange = (open: boolean) => { if (!open) onClose(); };

  const { mutate: addFloor, isPending: isAdding } = useAddFloor({ form, onOpenChange });
  const { mutate: updateFloor, isPending: isUpdating } = useUpdateFloor({ form, onOpenChange });

  useEffect(() => {
    if (!isOpen) return;
    form.reset({ name: initialFloor ?? "" });
  }, [initialFloor, isOpen, form]);

  if (!isOpen) return null;

  const handleClose = () => {
    form.reset(emptyForm);
    onClose();
  };

  const handleSubmit = form.handleSubmit((values) => {
    const name = values.name.trim();
    const payload = {name}
    if (isEdit && id) {
      updateFloor({id, value: payload});
    } else {
      addFloor(payload);
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
            aria-label="Close floor modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="flex min-h-[249px] w-full flex-col gap-[16px] rounded-[20px] border border-[#A6A6A6] bg-[#E9E9E9] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px]">
            <h3 className="font-poppins text-[22px] font-semibold leading-none text-black">
              {isEdit ? "Edit Floor" : "Add Floor"}
            </h3>

            <div className="flex w-full flex-col gap-[10px] rounded-[10px] border border-[#B5B5B5] bg-[#E9E9E9] p-2.5 sm:max-w-[742px]">
              <label className="block">
                <FormInput name="name" label="Floor Name" placeholder="Enter Floor Name" required/>
              </label>
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