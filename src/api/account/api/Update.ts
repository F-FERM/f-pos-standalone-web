
import { AddAccountPayload } from "@/src/interfaces/accounts/AddAccountPayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const UpdateAccount = async (
  id: string,
  Payload: AddAccountPayload,
) => {
  try {
    const response = await axiosInstance.patch(`accounts/${id}`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

