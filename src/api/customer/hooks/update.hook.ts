
import { CustomerFormValues } from "@/src/components/customer/AddCustomerModal";
import { AddCustomerPayload } from "@/src/interfaces/customer/AddCustomerPayload";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { UpdateCustomer } from "../api/Update";

export const useUpdateCustomer = (
  id: string,
  form: UseFormReturn<CustomerFormValues>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddCustomerPayload) => {
      return await UpdateCustomer(id, data);
    },
    onSuccess: () => {
      toast.success("Customer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllCustomer"] });
      queryClient.invalidateQueries({ queryKey: ["getCustomerById", id] });

      form.reset();
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};
