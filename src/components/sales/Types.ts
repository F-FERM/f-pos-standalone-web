import { StaticImageData } from "next/image";
import type { ElementType } from "react";

export type Category = {
  id: number;
  name: string;
  icon: ElementType;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string | StaticImageData;
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