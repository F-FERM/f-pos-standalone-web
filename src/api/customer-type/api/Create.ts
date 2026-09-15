
import { AddCustomerTypePayload } from "@/src/interfaces/customer-type/AddCustomerTypePayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddCustomerType = async (Payload: AddCustomerTypePayload) => {
  try {
    const response = await axiosInstance.post(`customer-type`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

