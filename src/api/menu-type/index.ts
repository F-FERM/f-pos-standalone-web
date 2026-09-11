import axiosInstance from "@/src/service/axios";

export interface MenuTypeRecord {
  _id: string;
  name: string;
   createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
}
interface CreatedBy {
  _id: string;
  username: string;
}
interface MenuTypeResponse {
  success: boolean;
  data: MenuTypeRecord;
  statusCode: number;
}

interface MenuTypeListResponse {
  success: boolean;
  data: MenuTypeRecord[];
  statusCode: number;
}

export const listMenuTypes = async () => {
  const response = await axiosInstance.get<MenuTypeListResponse>("menu-type");
  return response.data;
};

export const createMenuType = async (name: string) => {
  const response = await axiosInstance.post<MenuTypeResponse>("menu-type", {
    name,
  });
  return response.data;
};

export const updateMenuType = async (id: string, name: string) => {
  const response = await axiosInstance.patch<MenuTypeResponse>(
    `menu-type/${id}`,
    { name },
  );
  return response.data;
};

export const deleteMenuType = async (id: string) => {
  const response = await axiosInstance.delete<MenuTypeResponse>(
    `menu-type/${id}`,
  );
  return response.data;
};

