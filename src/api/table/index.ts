import axiosInstance from "@/src/service/axios";

export interface TableRecord {
  _id: string;
  name: string;
  capacity: number;
  floorId: {
    _id: string;
    name: string;
  };
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface TableResponse {
  success: boolean;
  data: TableRecord;
  statusCode: number;
}

interface TableListResponse {
  success: boolean;
  data: TableRecord[];
  statusCode: number;
}

export const listTables = async () => {
  const response = await axiosInstance.get<TableListResponse>("table");
  return response.data;
};

export const createTable = async (payload: {
  floorId: string;
  name: string;
  capacity: number;
}) => {
  const response = await axiosInstance.post<TableResponse>("table", payload);
  return response.data;
};

export const updateTable = async (
  id: string,
  payload: { floorId: string; name: string; capacity: number },
) => {
  const response = await axiosInstance.patch<TableResponse>(
    `table/${id}`,
    payload,
  );
  return response.data;
};

export const deleteTable = async (id: string) => {
  const response = await axiosInstance.delete<TableResponse>(`table/${id}`);
  return response.data;
};
