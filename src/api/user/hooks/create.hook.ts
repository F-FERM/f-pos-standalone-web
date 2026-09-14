
import { UserFormValues } from "@/src/components/user/AddUserModal";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddUserPayload } from "@/src/interfaces/user/AddUserPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddUser } from "../api/Create";

export const useAddUser = (form: UseFormReturn<UserFormValues>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddUserPayload) => {
      return await AddUser(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllUser"] });
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

