import axiosInstance from "@/src/service/axios";

export interface FloorRecord {
  _id: string;
  name: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface FloorResponse {
  success: boolean;
  data: FloorRecord;
  statusCode: number;
}

interface FloorListResponse {
  success: boolean;
  data: FloorRecord[];
  statusCode: number;
}

export const listFloors = async () => {
  const response = await axiosInstance.get<FloorListResponse>("floor");
  return response.data;
};

export const createFloor = async (name: string) => {
  const response = await axiosInstance.post<FloorResponse>("floor", { name });
  return response.data;
};

export const updateFloor = async (id: string, name: string) => {
  const response = await axiosInstance.patch<FloorResponse>(`floor/${id}`, {
    name,
  });
  return response.data;
};

export const deleteFloor = async (id: string) => {
  const response = await axiosInstance.delete<FloorResponse>(`floor/${id}`);
  return response.data;
};

