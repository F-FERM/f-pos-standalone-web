import axiosInstance from "@/src/service/axios";

export interface RestaurantRecord {
  _id: string;
  name: string;
  address: string;
  country: string;
  state: string;
  city: string;
  phone: string;
  phone2: string | null;
  phone3: string | null;
  email: string;
  logo: string | null;
  trn: string | null;
  vatPercentage: number;
  openingTime: string | null;
  closingTime: string | null;
  currency: string;
  currencySymbol: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantPayload {
  name: string;
  address: string;
  country: string;
  state: string;
  city: string;
  phone: string;
  phone2?: string | null;
  phone3?: string | null;
  email: string;
  trn?: string | null;
  vatPercentage?: number;
  openingTime?: string | null;
  closingTime?: string | null;
  currency?: string;
  currencySymbol?: string;
}

interface RestaurantListResponse {
  success: boolean;
  data: RestaurantRecord[];
  pagination: {
    totalCount: number;
    page: number;
    limit: number;
  };
}

interface RestaurantResponse {
  success: boolean;
  data: RestaurantRecord;
}

export const listRestaurants = async () => {
  const response =
    await axiosInstance.get<RestaurantListResponse>("restaurant");
  return response.data;
};

export const updateRestaurant = async (
  id: string,
  payload: RestaurantPayload,
) => {
  const response = await axiosInstance.patch<RestaurantResponse>(
    `restaurant/${id}`,
    payload,
  );
  return response.data;
};
