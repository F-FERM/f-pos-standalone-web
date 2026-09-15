"use client";

import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";

import FormInput from "@/src/components/form/FormInput";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

import { useAddKitchen } from "@/src/api/kitchen/hooks/create.hook";
import { useUpdateKitchen } from "@/src/api/kitchen/hooks/update.hook";
import { ListKitchenApi } from "@/src/api/kitchen/api/GetAll";
import { ListKitchenByIdApi } from "@/src/api/kitchen/api/GetById";

const kitchenSchema = z.object({
  name: z.string().min(1, "Kitchen name is required").max(100),
});

export type KitchenFormValues = z.infer<typeof kitchenSchema>;

const emptyForm: KitchenFormValues = { name: "" };

type AddKitchenModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  kitchenId?: string;
};

export default function AddKitchenModal({
  isOpen,
  onClose,
  mode = "add",
  kitchenId,
}: AddKitchenModalProps) {
  const isEdit = mode === "edit";

  const form = useForm<KitchenFormValues>({
    defaultValues: emptyForm,
    resolver: zodResolver(kitchenSchema),
  });

  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const { data: kitchenData } = useQuery({
    queryKey: ["getKitchenById", kitchenId],
    queryFn: () => ListKitchenByIdApi(String(kitchenId)),
    enabled: isEdit && !!kitchenId,
  });

  const { mutate: addKitchen, isPending: isAdding } = useAddKitchen({ form, onOpenChange });
  const { mutate: updateKitchen, isPending: isUpdating } = useUpdateKitchen({ form, onOpenChange });

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && kitchenData) {
      form.reset({ name: kitchenData.data.name });
      return;
    }

    if (!isEdit) form.reset(emptyForm);
  }, [isEdit, kitchenData, isOpen, form]);

  function handleClose() {
    form.reset(emptyForm);
    onClose();
  }

  const handleSubmit = form.handleSubmit((values) => {
    const payload = { name: values.name.trim() };

    if (isEdit && kitchenId) {
      updateKitchen({ id: kitchenId, value: payload });
    } else {
      addKitchen(payload);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="
          w-[812px] max-w-[calc(100vw-2rem)]
          h-auto min-h-[249px]
          flex flex-col gap-[16px]
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
          aria-label="Close kitchen modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div>
          <DialogTitle className="text-[22px] font-semibold text-black">
            {isEdit ? "Edit Kitchen" : "Add Kitchen"}
          </DialogTitle>
        </div>

        <FormProvider {...form}>
          <div className="rounded-[10px] border border-[#B5B5B5] bg-[#E9E9E9] p-2.5">
            <label className="block">
              <FormInput name="name" placeholder="Enter Kitchen Name" label="Kitchen Name" required />
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}