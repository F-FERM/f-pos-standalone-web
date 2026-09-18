
import { AddPaymentPayload } from "@/src/interfaces/payment/AddPaymentPayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddPayment = async (Payload: AddPaymentPayload) => {
  try {
    const response = await axiosInstance.post(`payments`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

