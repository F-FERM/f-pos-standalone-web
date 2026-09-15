export interface ListCustomerTypeResponse {
  success: boolean;
  data: CustomerType[];
  statusCode: number;
}

export interface CustomerType {
  _id: string;
  isDeleted: boolean;
  createdBy: string;
  type: string;
  onlinePlatforms: string[];
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


