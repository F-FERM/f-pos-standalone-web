import { CustomerTypeEnum, OrderStatus, OrderTab } from "@/src/components/sales/Types";
import axiosInstance from "@/src/service/axios";


export interface OrderItemPayload {
  foodId: string;
   portion: null | string;
  price: number;
  originalPrice: number;
  qty: number;
  total: number;
  foodName: string;
  choices?: string[];
  priceDetails?: {
    customerTypeId: string;
    price: number;
  };
}

export interface CreateOrderPayload {
  customerTypeId: string;
    tableId?: string;
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
export interface ListOrderFilteredResponse {
  success: boolean;
  data: Datum[];
  meta: Meta;
  statusCode: number;
}

interface Meta {
  tab: string;
  status: null;
  count: number;
}

interface Datum {
  _id: string;
  isDeleted: boolean;
  createdBy: string;
  invoiceNo: string;
  companyId: string;
  customerTypeId: CustomerTypeId;
  customerId: null;
  customerTypeName: string;
  onlinePlatform: null;
  deliveryDetails: null;
  items: Item[];
  itemsTotal: number;
  subtotal: number;
  vatPercentage: number;
  vatAmount: number;
  totalAmount: number;
  status: string;
  isActive: boolean;
  printedAt: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Item {
  foodId: FoodId;
  portionId: string;
  foodName: string;
  portionName: string;
  choices?: string[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface FoodId {
  _id: string;
  name: string;
  portions: Portion[];
  choices: string[];
}

interface Portion {
  name: string;
  basePrice: number;
  _id: string;
}

interface CustomerTypeId {
  _id: string;
  type: string;
  onlinePlatforms: string[];
  isActive: boolean;
}


export interface ListOrderByIdResponse {
  success: boolean;
  data: Data;
  statusCode: number;
}

interface Data {
  _id: string;
  isDeleted: boolean;
  createdBy: string;
  invoiceNo: string;
  companyId: string;
  customerTypeId: CustomerTypeId;
  customerId: null;
  customerTypeName: string;
  onlinePlatform: null;
  deliveryDetails: null;
  items: Item[];
  itemsTotal: number;
  subtotal: number;
  vatPercentage: number;
  vatAmount: number;
  totalAmount: number;
  status: string;
  isActive: boolean;
  printedAt: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  payments: any[];
  paymentSummary: PaymentSummary;
}

interface PaymentSummary {
  totalPaid: number;
  remaining: number;
  isFullyPaid: boolean;
  paymentCount: number;
}



interface FoodId {
  _id: string;
  name: string;
  portions: Portion[];
  choices: string[];
  isActive: boolean;
}

interface Portion {
  name: string;
  basePrice: number;
  _id: string;
}

interface CustomerTypeId {
  _id: string;
  type: string;
  onlinePlatforms: string[];
  isActive: boolean;
}
export const createOrder = async (payload: CreateOrderPayload) => {
  const response = await axiosInstance.post("order", payload);
  return response.data;
};

export const getOrders = async (
  tab: OrderTab,
  customerType?: CustomerTypeEnum
): Promise<ListOrderFilteredResponse> => {
  const response = await axiosInstance.get("order", {
    params: {
      tab,
      ...(customerType ? { customerType } : {}),
    },
  });
  return response.data;
};
export const getOrderById = async (id: string): Promise<ListOrderByIdResponse> => {
  const response = await axiosInstance.get(`order/${id}`);
  return response.data;
};

export const updateOrder = async (id: string, payload: CreateOrderPayload) => {
  const response = await axiosInstance.put(`order/${id}`, payload);
  return response.data;
};

export const printOrder = async (id: string) => {
  const response = await axiosInstance.post(`order/${id}/print`);
  return response.data;
};
