export interface ListFloorResponse {
  success: boolean;
  data: Floor[];
  statusCode: number;
}

export interface Floor {
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