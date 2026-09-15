
import { AddUserPayload } from "@/src/interfaces/user/AddUserPayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddUser = async (Payload: AddUserPayload) => {
  try {
    const response = await axiosInstance.post(`user`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

