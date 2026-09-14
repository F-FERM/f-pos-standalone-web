
import { AddFloorPayload } from "@/src/interfaces/floor/AddFloorPayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const UpdateFloor = async (
  id: string,
  Payload: AddFloorPayload,
) => {
  try {
    const response = await axiosInstance.patch(`floor/${id}`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

