
import { CategoryFormValues } from "@/src/components/menu/AddCategoryModal";
import { AddCategoryPayload } from "@/src/interfaces/category/AddCategoryPayload";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddCategory } from "../api/Create";

interface UseAddCategoryProps {
  form: UseFormReturn<CategoryFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useAddCategory = ({ form, onOpenChange }: UseAddCategoryProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddCategoryPayload) => {
      return await AddCategory(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllCategories"] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

