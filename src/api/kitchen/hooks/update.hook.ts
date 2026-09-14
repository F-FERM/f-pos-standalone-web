
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddKitchenPayload } from "@/src/interfaces/kitchen/AddKitchenPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { UpdateKitchen } from "../api/Update";
import { KitchenFormValues } from "@/src/components/settings/kitchen/AddKitchenModal";

interface UseUpdateKitchenProps {
  form: UseFormReturn<KitchenFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useUpdateKitchen = ({ form, onOpenChange }: UseUpdateKitchenProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: AddKitchenPayload }) => {
      return await UpdateKitchen(id, value);
    },
    onSuccess: (_, variables) => {
      toast.success("Kitchen updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllKitchen"] });
      queryClient.invalidateQueries({ queryKey: ["getKitchenById", variables.id] });

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

