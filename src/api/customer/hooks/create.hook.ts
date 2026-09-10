
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddCustomer } from "../api/Create";
import { CustomerFormValues } from "@/src/components/customer/AddCustomerModal";
import { AddCustomerPayload } from "@/src/interfaces/customer/AddCustomerPayload";
import { CustomError } from "@/src/interfaces/error/CustomError";

export const useAddCustomer = (form: UseFormReturn<CustomerFormValues>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddCustomerPayload) => {
      return await AddCustomer(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Customer created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllCustomer"] });
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};
