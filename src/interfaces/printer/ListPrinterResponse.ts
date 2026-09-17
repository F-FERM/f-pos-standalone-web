export interface ListPrinterResponse {
  success: boolean;
  data: Printer[];
  statusCode: number;
}

export interface Printer {
  _id: string;
  isDeleted: boolean;
  createdBy: string;
  printerName: string;
  printerType: string;
  customerTypeId: CustomerTypeId;
  kitchenId: KitchenId | null;
  printerIp: string;
  paperWidth: string;
  isDefault: boolean;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface KitchenId {
  _id: string;
  isDeleted: boolean;
  createdBy: string;
  name: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CustomerTypeId {
  _id: string;
  isDeleted: boolean;
  createdBy: string;
  type: string;
  onlinePlatforms: any[];
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}