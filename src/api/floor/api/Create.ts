
import { AddFloorPayload } from "@/src/interfaces/floor/AddFloorPayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddFloor = async (Payload: AddFloorPayload) => {
  try {
    const response = await axiosInstance.post(`floor`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

