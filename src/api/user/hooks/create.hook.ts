
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddUserPayload } from "@/src/interfaces/user/AddUserPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddUser } from "../api/Create";
import { UserFormValues } from "@/src/components/user/AddUserDialogue";
interface UseAddUserProps {
  form: UseFormReturn<UserFormValues>;
  onOpenChange: (open: boolean) => void;
}
export const useAddUser = ({form,onOpenChange}: UseAddUserProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddUserPayload) => {
      return await AddUser(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllUser"] });
       onOpenChange(false);
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

