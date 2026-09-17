
import { ListMenuTypeResponse } from "@/src/interfaces/menu-type/ListMenuTypeResponse";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const ListMenuTypeApi = async (data: {
  search?: string;
  page?: number;
  limit?: number;

}) => {
  const { search, page, limit } = data;
  try {
    const params = new URLSearchParams();
    if (search) {
      params.append("search", search);
    }
    if (page) {
      params.append("page", page.toString());
    }
    if (limit) {
      params.append("limit", limit.toString());
    }
   

    const response = await axiosInstance.get<ListMenuTypeResponse>(
      `/menu-type?${params.toString()}`,
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

