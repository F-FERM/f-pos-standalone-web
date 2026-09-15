export interface ListMenuTypeResponse {
  success: boolean;
  data: MenuType[];
  statusCode: number;
}

export interface MenuType {
  _id: string;
  isDeleted: boolean;
  createdBy: CreatedBy;
  name: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CreatedBy {
  _id: string;
  username: string;
}