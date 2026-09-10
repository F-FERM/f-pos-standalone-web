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

interface RestaurantListResponse {
  success: boolean;
  data: RestaurantRecord[];
  pagination: {
    totalCount: number;
    page: number;
    limit: number;
  };
}

export const listRestaurants = async () => {
  const response =
    await axiosInstance.get<RestaurantListResponse>("restaurant");
  return response.data;
};
