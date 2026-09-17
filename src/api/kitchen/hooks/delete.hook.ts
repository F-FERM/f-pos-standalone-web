import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CustomError } from "@/src/interfaces/error/CustomError";
import { toast } from "sonner";
import { DeleteKitchen } from "../api/Delete";

export const useDeleteKitchen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; name: string }) => {
      return await DeleteKitchen({ id: payload.id });
    },

    onSuccess: (_data, variables) => {
      if (_data?.archived) {
    toast.warning(_data.message );
  } else {
    toast.success(`${variables.name} deleted successfully`);
  }
      queryClient.invalidateQueries({ queryKey: ["getAllKitchen"] });
    },

    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

