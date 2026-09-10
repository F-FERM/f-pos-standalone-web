import axiosInstance from "@/src/service/axios";

export interface FoodRelation {
  _id: string;
  name?: string;
  type?: string;
}

export interface FoodRecord {
  _id: string;
  name: string;
  foodImage?: string;
  foodType: "VEG" | "NON_VEG";
  menuTypeId: FoodRelation;
  categoryId: FoodRelation;
  kitchenId: FoodRelation;
  isPortionEnabled: boolean;
  portions: { name: string; basePrice: number }[];
  basePrice: number;
  customerTypes: {
    customerTypeId: FoodRelation;
    onlinePlatform?: string | null;
    price: number;
  }[];
  isOfferEnabled: boolean;
  offer?: {
    startDate: string;
    endDate: string;
    discount: number;
  } | null;
  choices: string[];
  preparationTime: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoodPayload {
  name: string;
  foodImage?: string;
  foodType: "VEG" | "NON_VEG";
  menuTypeId: string;
  categoryId: string;
  kitchenId: string;
  isPortionEnabled: boolean;
  portions?: { name: string; basePrice: number }[];
  basePrice: number;
  customerTypes?: {
    customerTypeId: string;
    price: number;
  }[];
  isOfferEnabled: boolean;
  offer?: { startDate: string; endDate: string; discount: number };
  choices?: string[];
  preparationTime: number;
}

interface FoodResponse {
  success: boolean;
  data: FoodRecord;
  statusCode: number;
}

interface FoodListResponse {
  success: boolean;
  data: FoodRecord[];
  statusCode: number;
}

export const listFoods = async () => {
  const response = await axiosInstance.get<FoodListResponse>("food");
  return response.data;
};

export const createFood = async (payload: FoodPayload) => {
  const response = await axiosInstance.post<FoodResponse>("food", payload);
  return response.data;
};

export const updateFood = async (id: string, payload: FoodPayload) => {
  const response = await axiosInstance.patch<FoodResponse>(
    `food/${id}`,
    payload,
  );
  return response.data;
};

export const deleteFood = async (id: string) => {
  const response = await axiosInstance.delete<FoodResponse>(`food/${id}`);
  return response.data;
};
