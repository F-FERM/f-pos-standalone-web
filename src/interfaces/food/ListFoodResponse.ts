export interface ListFoodResponse {
  success: boolean;
  data: Food[];
  statusCode: number;
}

export interface Food {
  _id: string;
  isDeleted: boolean;
  createdBy: CreatedBy;
  name: string;
  foodImage: null | string;
  foodType: string;
  menuTypeId: MenuTypeId;
  categoryId: MenuTypeId;
  kitchenId: MenuTypeId;
  isPortionEnabled: boolean;
  portions: Portion[];
  basePrice: number;
  customerTypes: CustomerType[];
  isOfferEnabled: boolean;
  offer: Offer | null;
  choices: string[];
  preparationTime: number;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Offer {
  startDate: string;
  endDate: string;
  discount: number;
}

interface CustomerType {
  customerTypeId: CustomerTypeId;
  onlinePlatform: null;
  price: number;
  _id: string;
}

interface CustomerTypeId {
  _id: string;
  type: string;
  onlinePlatforms: any[];
}

interface Portion {
  name: string;
  basePrice: number;
  _id: string;
}

interface MenuTypeId {
  _id: string;
  name: string;
}

interface CreatedBy {
  _id: string;
  username: string;
}