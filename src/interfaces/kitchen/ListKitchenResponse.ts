export interface ListKitcheResponse {
  success: boolean;
  data: Kitchen[];
  statusCode: number;
}

export interface Kitchen {
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