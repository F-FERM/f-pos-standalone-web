
import { CustomerFormValues } from "@/src/components/customer/AddCustomerDialogue";
import { AddCustomerPayload } from "@/src/interfaces/customer/AddCustomerPayload";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { UpdateCustomer } from "../api/Update";

interface UseUpdateCustomerProps {
  form: UseFormReturn<CustomerFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useUpdateCustomer = ({ form, onOpenChange }: UseUpdateCustomerProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: AddCustomerPayload }) => {
      return await UpdateCustomer(id, value);
    },
    onSuccess: (_, variables) => {
      toast.success("Customer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllCustomer"] });
      queryClient.invalidateQueries({ queryKey: ["getCustomerById", variables.id] });

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

