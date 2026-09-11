
import { ListCustomerResponse } from "@/src/interfaces/customer/ListCustomerResponse";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const ListCustomerApi = async (data: {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  branchId?: string;
}) => {
  const { search, page, limit, status, branchId } = data;
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
   

    const response = await axiosInstance.get<ListCustomerResponse>(
      `/customer?${params.toString()}`,
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

