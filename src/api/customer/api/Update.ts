
import { AddCustomerPayload } from "@/src/interfaces/customer/AddCustomerPayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const UpdateCustomer = async (
  id: string,
  Payload: AddCustomerPayload,
) => {
  try {
    const response = await axiosInstance.patch(`customer/${id}`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
