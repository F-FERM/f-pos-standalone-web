import axiosInstance from "@/src/service/axios";

export interface KitchenRecord {
  _id: string;
  name: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface KitchenResponse {
  success: boolean;
  data: KitchenRecord;
  statusCode: number;
}

interface KitchenListResponse {
  success: boolean;
  data: KitchenRecord[];
  statusCode: number;
}

export const listKitchens = async () => {
  const response = await axiosInstance.get<KitchenListResponse>("kitchen");
  return response.data;
};

export const createKitchen = async (name: string) => {
  const response = await axiosInstance.post<KitchenResponse>("kitchen", {
    name,
  });
  return response.data;
};

export const updateKitchen = async (id: string, name: string) => {
  const response = await axiosInstance.patch<KitchenResponse>(`kitchen/${id}`, {
    name,
  });
  return response.data;
};

export const deleteKitchen = async (id: string) => {
  const response = await axiosInstance.delete<KitchenResponse>(`kitchen/${id}`);
  return response.data;
};

