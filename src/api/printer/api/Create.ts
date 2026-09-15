
import { AddPrinterPayload } from "@/src/interfaces/printer/AddPrinterPayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddPrinter = async (Payload: AddPrinterPayload) => {
  try {
    const response = await axiosInstance.post(`printer`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

