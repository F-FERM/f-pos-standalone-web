

export interface AddFoodPayload {
  name: string;
  foodImage?: string;
  foodType?: "VEG" | "NON_VEG";
  menuTypeId?: string;
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