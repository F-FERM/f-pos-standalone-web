
import { AddKitchenPayload } from "@/src/interfaces/kitchen/AddKitchenPayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const UpdateKitchen = async (
  id: string,
  Payload: AddKitchenPayload,
) => {
  try {
    const response = await axiosInstance.patch(`kitchen/${id}`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

