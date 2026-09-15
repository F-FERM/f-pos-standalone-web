
import { FoodFormValues } from "@/src/components/menu/AddFoodModal";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddFoodPayload } from "@/src/interfaces/food/AddFoodPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { UpdateFood } from "../api/Update";

interface UseUpdateFoodProps {
  form: UseFormReturn<FoodFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useUpdateFood = ({ form, onOpenChange }: UseUpdateFoodProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value, imageFile }: { id: string; value: AddFoodPayload; imageFile?: File }) => {
      return await UpdateFood(id, value, imageFile);
    },
    onSuccess: (_, variables) => {
      toast.success("Food updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllFoods"] });
      queryClient.invalidateQueries({ queryKey: ["getFoodById", variables.id] });

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

