
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddPaymentPayload } from "@/src/interfaces/payment/AddPaymentPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddPayment } from "../api/Create";
import { PaymentFormValues } from "@/src/components/sales/PaymentModal";
import { useRouter } from "next/navigation";

interface UseAddPaymentProps {
  form: UseFormReturn<PaymentFormValues>;
  onOpenChange: (open: boolean) => void;
  onSuccessCallback?: () => void;
}

export const useAddPayment = ({ form, onOpenChange, onSuccessCallback }: UseAddPaymentProps) => {
  const queryClient = useQueryClient();
const router=useRouter()
  return useMutation({
    mutationFn: async (data: AddPaymentPayload) => {
      return await AddPayment(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Payment created successfully");
 router.push("/home/sales");
      queryClient.invalidateQueries({ queryKey: ["getAllPayments"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      onSuccessCallback?.();
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

