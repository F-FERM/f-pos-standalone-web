import axiosInstance from "@/src/service/axios";

export interface CategoryRecord {
  _id: string;
  name: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryResponse {
  success: boolean;
  data: CategoryRecord;
  statusCode: number;
}

interface CategoryListResponse {
  success: boolean;
  data: CategoryRecord[];
  statusCode: number;
}

export const listCategories = async () => {
  const response = await axiosInstance.get<CategoryListResponse>("category");
  return response.data;
};

export const createCategory = async (name: string) => {
  const response = await axiosInstance.post<CategoryResponse>("category", {
    name,
  });
  return response.data;
};

export const updateCategory = async (id: string, name: string) => {
  const response = await axiosInstance.patch<CategoryResponse>(
    `category/${id}`,
    { name },
  );
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await axiosInstance.delete<CategoryResponse>(
    `category/${id}`,
  );
  return response.data;
};

