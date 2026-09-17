
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddPrinterPayload } from "@/src/interfaces/printer/AddPrinterPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddPrinter } from "../api/Create";
import { PrinterFormValues } from "@/src/components/settings/pos-settings/AddPrinterModal";

interface UseAddPrinterProps {
  form: UseFormReturn<PrinterFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useAddPrinter = ({ form, onOpenChange }: UseAddPrinterProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddPrinterPayload) => {
      return await AddPrinter(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Printer created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllPrinters"] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

