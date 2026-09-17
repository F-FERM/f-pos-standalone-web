
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddKitchenPayload } from "@/src/interfaces/kitchen/AddKitchenPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddKitchen } from "../api/Create";
import { KitchenFormValues } from "@/src/components/settings/kitchen/AddKitchenModal";

interface UseAddKitchenProps {
  form: UseFormReturn<KitchenFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useAddKitchen = ({ form, onOpenChange }: UseAddKitchenProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddKitchenPayload) => {
      return await AddKitchen(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Kitchen added successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllKitchen"] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

