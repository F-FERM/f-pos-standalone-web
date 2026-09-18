
import { AddAccountPayload } from "@/src/interfaces/accounts/AddAccountPayload";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddAccount } from "../api/Create";
import { AccountFormValues } from "@/src/components/accounts/AddAccountDialogue";

interface UseAddAccountProps {
  form: UseFormReturn<AccountFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useAddAccount = ({ form, onOpenChange }: UseAddAccountProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddAccountPayload) => {
      return await AddAccount(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllAccounts"] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

