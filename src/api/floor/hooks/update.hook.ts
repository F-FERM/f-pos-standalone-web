
import { FloorFormValues } from "@/src/components/settings/restaurant/AddFloorModal";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddFloorPayload } from "@/src/interfaces/floor/AddFloorPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { UpdateFloor } from "../api/Update";

interface UseUpdateFloorProps {
  form: UseFormReturn<FloorFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useUpdateFloor = ({ form, onOpenChange }: UseUpdateFloorProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: AddFloorPayload }) => {
      return await UpdateFloor(id, value);
    },
    onSuccess: (_, variables) => {
      toast.success("Floor updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllFloors"] });
      queryClient.invalidateQueries({ queryKey: ["getFloorById", variables.id] });

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

