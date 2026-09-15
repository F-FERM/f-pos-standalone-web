
import { ListPublicUserResponse } from "@/src/interfaces/user/ListUserPublicList";
import { ListUserResponse } from "@/src/interfaces/user/ListUserResponse";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const ListUserApi = async (data: {
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
   

    const response = await axiosInstance.get<ListUserResponse>(
      `/user?${params.toString()}`,
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

export const ListPublicUserApi = async (data: {
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
   

    const response = await axiosInstance.get<ListPublicUserResponse>(
      `/user/public/list?${params.toString()}`,
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

