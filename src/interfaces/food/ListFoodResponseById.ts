export interface ListFoodResponseById {
  success: boolean;
  data: Data;
  statusCode: number;
}

interface Data {
  _id: string;
  isDeleted: boolean;
  createdBy: string;
  name: string;
  foodImage: string;
  foodType: string;
  menuTypeId: MenuTypeId;
  categoryId: MenuTypeId;
  kitchenId: MenuTypeId;
  isPortionEnabled: boolean;
  portions: any[];
  basePrice: number;
  customerTypes: any[];
  isOfferEnabled: boolean;
  offer: null;
  choices: any[];
  preparationTime: number;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MenuTypeId {
  _id: string;
  name: string;
}