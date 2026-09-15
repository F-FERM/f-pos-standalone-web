
import { MenuTypeFormValues } from "@/src/components/menu/AddMenuTypeModal";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddMenuTypePayload } from "@/src/interfaces/menu-type/AddMenuTypePayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { UpdateMenuType } from "../api/Update";

interface UseUpdateMenuTypeProps {
  form: UseFormReturn<MenuTypeFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useUpdateMenuType = ({ form, onOpenChange }: UseUpdateMenuTypeProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: AddMenuTypePayload }) => {
      return await UpdateMenuType(id, value);
    },
    onSuccess: (_, variables) => {
      toast.success("Menu Type updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllMenuTypes"] });
      queryClient.invalidateQueries({ queryKey: ["getMenuTypeById", variables.id] });

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

