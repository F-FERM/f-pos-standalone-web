
import { CustomerTypeFormValues } from "@/src/components/settings/restaurant/AddCustomerTypeModal";
import { AddCustomerTypePayload } from "@/src/interfaces/customer-type/AddCustomerTypePayload";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { UpdateCustomerType } from "../api/Update";

interface UseUpdateCustomerTypeProps {
  form: UseFormReturn<CustomerTypeFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useUpdateCustomerType = ({ form, onOpenChange }: UseUpdateCustomerTypeProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: AddCustomerTypePayload }) => {
      return await UpdateCustomerType(id, value);
    },
    onSuccess: (_, variables) => {
      toast.success("Customer type updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllCustomerTypes"] });
      queryClient.invalidateQueries({ queryKey: ["getCustomerTypeById", variables.id] });

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

