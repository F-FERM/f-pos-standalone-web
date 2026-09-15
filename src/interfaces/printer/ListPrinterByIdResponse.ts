export interface ListResponseByIdPrinter {
  success: boolean;
  data: Data;
  statusCode: number;
}

interface Data {
  _id: string;
  isDeleted: boolean;
  createdBy: string;
  printerName: string;
  printerType: string;
  customerTypeId: CustomerTypeId;
  kitchenId: null;
  printerIp: string;
  paperWidth: string;
  isDefault: boolean;
  isActive: boolean;
  companyId: string;
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