import { StaticImageData } from "next/image";
import type { ElementType } from "react";
import { Food, Portion } from "@/src/interfaces/food/ListFoodResponse";

export type Category = {
  id: number;
  name: string;
  icon: ElementType;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string | StaticImageData;
  food: Food;
};

export type CartItemType = {
  id: string; 
  food: Food;
  portion: Portion | null;
  choices: string[];
  qty: number;
  customRate?: number; // user-overridden rate; if undefined, computed from portion/basePrice
};

export type TableStatus = "available" | "running" | "vacating";

export type RestaurantTable = {
  id: number;
  name: string;
  status: TableStatus;
};


export type Customer = {
  id: number;
  name: string;
  address: string;
  phone: string;
  credit: number;
};

export enum OrderStatus {
  PLACED = 'Placed',
  PRINTED = 'Printed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  READY_PICKUP = 'ReadyPickUp',
  OUT_FOR_DELIVERY = 'OutForDelivery',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
}

export enum OrderTab {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum CustomerTypeEnum {
  DINE_IN = 'DINE_IN',
  TAKE_AWAY = 'TAKE_AWAY',
  HOME_DELIVERY = 'HOME_DELIVERY',
  ONLINE = 'ONLINE',
}