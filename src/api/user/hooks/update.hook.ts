
import { UserFormValues } from "@/src/components/user/AddUserModal";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddUserPayload } from "@/src/interfaces/user/AddUserPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { UpdateUser } from "../api/Update";

export const useUpdateUser = (
  id: string,
  form: UseFormReturn<UserFormValues>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddUserPayload) => {
      return await UpdateUser(id, data);
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllUser"] });
      queryClient.invalidateQueries({ queryKey: ["getUserById", id] });

      form.reset();
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

