
import { AddCustomerPayload } from "@/src/interfaces/customer/AddCustomerPayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddCustomer = async (Payload: AddCustomerPayload) => {
  try {
    const response = await axiosInstance.post(`customer`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
