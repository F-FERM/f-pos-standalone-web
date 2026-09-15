
import { MenuTypeFormValues } from "@/src/components/menu/AddMenuTypeModal";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddMenuTypePayload } from "@/src/interfaces/menu-type/AddMenuTypePayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddMenuType } from "../api/Create";

interface UseAddMenuTypeProps {
  form: UseFormReturn<MenuTypeFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useAddMenuType = ({ form, onOpenChange }: UseAddMenuTypeProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddMenuTypePayload) => {
      return await AddMenuType(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Menu Type created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllMenuTypes"] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

