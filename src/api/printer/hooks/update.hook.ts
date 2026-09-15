
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddPrinterPayload } from "@/src/interfaces/printer/AddPrinterPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { UpdatePrinter } from "../api/Update";
import { PrinterFormValues } from "@/src/components/settings/pos-settings/AddPrinterModal";

interface UseUpdatePrinterProps {
  form: UseFormReturn<PrinterFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useUpdatePrinter = ({ form, onOpenChange }: UseUpdatePrinterProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: AddPrinterPayload }) => {
      return await UpdatePrinter(id, value);
    },
    onSuccess: (_, variables) => {
      toast.success("Printer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllPrinters"] });
      queryClient.invalidateQueries({ queryKey: ["getPrinterById", variables.id] });

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

