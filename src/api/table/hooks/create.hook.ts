
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddTablePayload } from "@/src/interfaces/table/AddTablePayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddTable } from "../api/Create";
import { TableFormValues } from "@/src/components/settings/restaurant/AddTableModal";

interface UseAddTableProps {
  form: UseFormReturn<TableFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useAddTable = ({ form, onOpenChange }: UseAddTableProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddTablePayload) => {
      return await AddTable(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Table created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllTables"] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

