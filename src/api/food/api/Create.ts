
import { AddFoodPayload } from "@/src/interfaces/food/AddFoodPayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddFood = async (Payload: AddFoodPayload, imageFile?: File) => {
  try {
    const response = await axiosInstance.post(`food`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

