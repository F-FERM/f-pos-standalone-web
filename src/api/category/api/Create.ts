
import { AddCategoryPayload } from "@/src/interfaces/category/AddCategoryPayload";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddCategory = async (Payload: AddCategoryPayload) => {
  try {
    const response = await axiosInstance.post(`category`, Payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

