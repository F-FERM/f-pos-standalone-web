export interface ListCustomerTypeByIdResponse {
  success: boolean;
  data: Data;
  statusCode: number;
}

interface Data {
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