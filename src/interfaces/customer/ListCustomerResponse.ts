export interface ListCustomerResponse {
  success: boolean;
  data: Customer[];
  statusCode: number;
}

export interface Customer {
  _id: string;
  isDeleted: boolean;
  createdBy: string;
  name: string;
  credit: number;
  phone: string;
  address: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
