import axiosInstance from "@/src/service/axios";

export const CUSTOMER_TYPE_OPTIONS = [
  { label: "DINE_IN", value: "DINE_IN" },
  { label: "TAKE_AWAY", value: "TAKE_AWAY" },
  { label: "HOME_DELIVERY", value: "HOME_DELIVERY" },
  { label: "ONLINE", value: "ONLINE" },
] as const;

export type CustomerTypeValue = (typeof CUSTOMER_TYPE_OPTIONS)[number]["value"];

export interface CustomerTypeRecord {
  _id: string;
  type: CustomerTypeValue;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerTypeResponse {
  success: boolean;
  data: CustomerTypeRecord;
  statusCode: number;
}

interface CustomerTypeListResponse {
  success: boolean;
  data: CustomerTypeRecord[];
  statusCode: number;
}

export const listCustomerTypes = async () => {
  const response =
    await axiosInstance.get<CustomerTypeListResponse>("customer-type");
  return response.data;
};

export const createCustomerType = async (type: CustomerTypeValue) => {
  const response = await axiosInstance.post<CustomerTypeResponse>(
    "customer-type",
    { type },
  );
  return response.data;
};

export const updateCustomerType = async (
  id: string,
  type: CustomerTypeValue,
) => {
  const response = await axiosInstance.patch<CustomerTypeResponse>(
    `customer-type/${id}`,
    { type },
  );
  return response.data;
};

export const deleteCustomerType = async (id: string) => {
  const response = await axiosInstance.delete<CustomerTypeResponse>(
    `customer-type/${id}`,
  );
  return response.data;
};

