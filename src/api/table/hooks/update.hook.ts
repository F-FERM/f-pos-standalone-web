
import { TableFormValues } from "@/src/components/settings/restaurant/AddTableModal";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddTablePayload } from "@/src/interfaces/table/AddTablePayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { UpdateTable } from "../api/Update";

interface UseUpdateTableProps {
  form: UseFormReturn<TableFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useUpdateTable = ({ form, onOpenChange }: UseUpdateTableProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: AddTablePayload }) => {
      return await UpdateTable(id, value);
    },
    onSuccess: (_, variables) => {
      toast.success("Table updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllTables"] });
      queryClient.invalidateQueries({ queryKey: ["getTableById", variables.id] });

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

