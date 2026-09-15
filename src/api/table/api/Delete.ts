
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const DeleteTable = async (payload: { id: string }) => {
  try {
    const response = await axiosInstance.delete(`table/${payload.id}`);
    
    return response.data;    
   
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

