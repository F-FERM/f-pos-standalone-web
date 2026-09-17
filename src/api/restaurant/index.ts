import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

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
  logoFile?: File
) => {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    const response = await axiosInstance.patch<RestaurantResponse>(
      `restaurant/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
