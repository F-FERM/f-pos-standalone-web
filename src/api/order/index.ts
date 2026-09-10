import axiosInstance from "@/src/service/axios";

export type OrderStatus = "Placed" | "Printed" | "Cancelled";

export interface OrderItemPayload {
  foodId: string;
  portion: string | null;
  price: number;
  originalPrice: number;
  qty: number;
  total: number;
  foodName: string;
  priceDetails?: {
    customerTypeId: string;
    price: number;
  };
}

export interface CreateOrderPayload {
  customerTypeId: string;
  vat: number;
  items: OrderItemPayload[];
  subTotal: number;
  total: number;
  discount: number;
  status: OrderStatus;
  customerId?: string;
  onlinePlatform?: string;
  deliveryDetails?: {
    location: string;
    deliveryDate: string;
    deliveryTime: string;
  };
}

export const createOrder = async (payload: CreateOrderPayload) => {
  const response = await axiosInstance.post("order", payload);
  return response.data;
};
