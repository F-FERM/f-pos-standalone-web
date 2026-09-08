import { LoginPayload } from "@/src/interfaces/login/LoginPayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const UserLogin = async (Payload: LoginPayload) => {
  try {
    const response = await axiosInstance.post(`auth/login`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};