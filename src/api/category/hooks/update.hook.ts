
import { CategoryFormValues } from "@/src/components/menu/AddCategoryModal";
import { AddCategoryPayload } from "@/src/interfaces/category/AddCategoryPayload";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { UpdateCategory } from "../api/Update";

interface UseUpdateCategoryProps {
  form: UseFormReturn<CategoryFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useUpdateCategory = ({ form, onOpenChange }: UseUpdateCategoryProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: AddCategoryPayload }) => {
      return await UpdateCategory(id, value);
    },
    onSuccess: (_, variables) => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllCategories"] });
      queryClient.invalidateQueries({ queryKey: ["getCategoryById", variables.id] });

      form.reset();
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

