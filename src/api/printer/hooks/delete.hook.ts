import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CustomError } from "@/src/interfaces/error/CustomError";
import { toast } from "sonner";
import { DeletePrinter } from "../api/Delete";

export const useDeletePrinter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; name: string }) => {
      return await DeletePrinter({ id: payload.id });
    },

    onSuccess: (_data, variables) => {
      if (_data?.archived) {
    toast.warning(_data.message );
  } else {
    toast.success(`${variables.name} deleted successfully`);
  }
      queryClient.invalidateQueries({ queryKey: ["getAllPrinters"] });
    },

    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

