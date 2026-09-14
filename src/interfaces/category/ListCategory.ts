
export interface ListCategoryResponse {
  success: boolean;
  data: Category[];
  statusCode: number;
}

export interface Category {
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