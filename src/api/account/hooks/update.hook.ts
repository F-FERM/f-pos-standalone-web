
import { AddAccountPayload } from "@/src/interfaces/accounts/AddAccountPayload";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { UpdateAccount } from "../api/Update";
import { AccountFormValues } from "@/src/components/accounts/AddAccountDialogue";

interface UseUpdateAccountProps {
  form: UseFormReturn<AccountFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useUpdateAccount = ({ form, onOpenChange }: UseUpdateAccountProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: AddAccountPayload }) => {
      return await UpdateAccount(id, value);
    },
    onSuccess: (_, variables) => {
      toast.success("Account updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllAccounts"] });
      queryClient.invalidateQueries({ queryKey: ["getAccountById", variables.id] });

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

