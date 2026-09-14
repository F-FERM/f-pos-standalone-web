
import { ListFoodResponseById } from "@/src/interfaces/food/ListFoodResponseById";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const ListFoodByIdApi = async (id: string) => {
  try {
    const response = await axiosInstance.get<ListFoodResponseById>(
      `/food/${id}`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data;

      const normalizedError = new Error(apiError?.error);

      (normalizedError as any).statusCode = apiError?.statusCode;
      (normalizedError as any).raw = apiError;

      throw normalizedError;
    }
    throw error;
  }
};

