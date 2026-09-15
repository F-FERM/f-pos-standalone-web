
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddUserPayload } from "@/src/interfaces/user/AddUserPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { UpdateUser } from "../api/Update";
import { UserFormValues } from "@/src/components/user/AddUserDialogue";
interface UseUpdateUserProps {
  form: UseFormReturn<UserFormValues>;
  onOpenChange: (open: boolean) => void;
}
export const useUpdateUser = ({
  form,
  onOpenChange,
}: UseUpdateUserProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: AddUserPayload }) => {
      return await UpdateUser(id, value);
    },
    onSuccess: (_, variables) => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllUser"] });
      queryClient.invalidateQueries({ queryKey: ["getUserById", variables.id] });
      
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

