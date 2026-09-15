
import { FoodFormValues } from "@/src/components/menu/AddFoodModal";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddFoodPayload } from "@/src/interfaces/food/AddFoodPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddFood } from "../api/Create";

interface UseAddFoodProps {
  form: UseFormReturn<FoodFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useAddFood = ({ form, onOpenChange }: UseAddFoodProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ value, imageFile }: { value: AddFoodPayload; imageFile?: File }) => {
      return await AddFood(value, imageFile);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Food created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllFoods"] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

