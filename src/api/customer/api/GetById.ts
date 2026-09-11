
import { ListCustomerByIdResponse } from "@/src/interfaces/customer/ListCustomerByIdResponse";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const ListCustomerByIdApi = async (id: string) => {
  try {
    const response = await axiosInstance.get<ListCustomerByIdResponse>(
      `/customer/${id}`,
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

