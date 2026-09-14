
import { AddMenuTypePayload } from "@/src/interfaces/menu-type/AddMenuTypePayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddMenuType = async (Payload: AddMenuTypePayload) => {
  try {
    const response = await axiosInstance.post(`menu-type`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

