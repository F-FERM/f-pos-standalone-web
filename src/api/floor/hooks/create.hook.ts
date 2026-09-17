
import { FloorFormValues } from "@/src/components/settings/restaurant/AddFloorModal";
import { CustomError } from "@/src/interfaces/error/CustomError";
import { AddFloorPayload } from "@/src/interfaces/floor/AddFloorPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddFloor } from "../api/Create";

interface UseAddFloorProps {
  form: UseFormReturn<FloorFormValues>;
  onOpenChange: (open: boolean) => void;
}

export const useAddFloor = ({ form, onOpenChange }: UseAddFloorProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddFloorPayload) => {
      return await AddFloor(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Floor created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllFloors"] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

