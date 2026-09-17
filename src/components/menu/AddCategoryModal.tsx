"use client";

import FormInput from "@/src/components/form/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";

import { useAddCategory } from "@/src/api/category/hooks/create.hook";
import { useUpdateCategory } from "@/src/api/category/hooks/update.hook";

const categorySchema = z.object({
  categoryName: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must be 100 characters or less"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
const emptyForm: CategoryFormValues = { categoryName: "" };

type AddCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  id?: string;
  initialName?: string | null;
};

export default function AddCategoryModal({
  isOpen,
  onClose,
  mode = "add",
  id,
  initialName = null,
}: AddCategoryModalProps) {
  const isEdit = mode === "edit";

  const form = useForm<CategoryFormValues>({
    defaultValues: emptyForm,
    resolver: zodResolver(categorySchema),
  });

  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const { mutate: addCategory, isPending: isAdding } = useAddCategory({ form, onOpenChange });
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory({ form, onOpenChange });

  useEffect(() => {
    if (!isOpen) return;
    form.reset({ categoryName: initialName ?? "" });
  }, [initialName, isOpen, form]);

  if (!isOpen) return null;

  const handleClose = () => {
    form.reset(emptyForm);
    onClose();
  };

  const handleSubmit = form.handleSubmit((values) => {
    const categoryName = values.categoryName.trim();
    const payload = {name:categoryName}
    if (isEdit && id) {
      updateCategory({id, value: payload});
    } else {
      addCategory(payload);
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
            aria-label="Close category modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="flex min-h-[249px] w-full flex-col gap-[16px] rounded-[20px] border border-[#A6A6A6] bg-[#E9E9E9] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px]">
            <div>
              <h3 className="text-[22px] font-semibold leading-none text-black">
                {isEdit ? "Edit Category" : "Add Category"}
              </h3>
              <p className="mb-2 mt-2 text-[14px] font-medium text-[#A4A4A4]">
                Define food categories to streamline menu management (e.g. Desserts, Beverages).
              </p>
            </div>

            <div className="flex w-full flex-col gap-[10px] rounded-[10px] border border-[#B5B5B5] bg-[#E9E9E9] p-2.5 sm:max-w-[742px]">
              <FormInput name="categoryName" label="Category Name" placeholder="Enter Category Name" required />
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