
import { AddKitchenPayload } from "@/src/interfaces/kitchen/AddKitchenPayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddKitchen = async (Payload: AddKitchenPayload) => {
  try {
    const response = await axiosInstance.post(`kitchen`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

