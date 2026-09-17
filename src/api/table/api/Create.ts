
import { AddTablePayload } from "@/src/interfaces/table/AddTablePayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddTable = async (Payload: AddTablePayload) => {
  try {
    const response = await axiosInstance.post(`table`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

