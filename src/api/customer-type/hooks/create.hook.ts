
import { CustomerTypeFormValues } from "@/src/components/settings/restaurant/AddCustomerTypeModal";
import { AddCustomerTypePayload } from "@/src/interfaces/customer-type/AddCustomerTypePayload";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddCustomerType } from "../api/Create";

interface UseAddCustomerTypeProps {
  form: UseFormReturn<CustomerTypeFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useAddCustomerType = ({ form, onOpenChange }: UseAddCustomerTypeProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddCustomerTypePayload) => {
      return await AddCustomerType(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Customer type created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllCustomerTypes"] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

