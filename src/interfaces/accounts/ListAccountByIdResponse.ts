export interface ListAccountByIdResponse {
  success: boolean;
  data: Data;
  statusCode: number;
}

interface Data {
  _id: string;
  isDeleted: boolean;
  createdBy: string;
  companyId: string;
  accountName: string;
  parentAccountId: null;
  accountType: string;
  showInPos: boolean;
  description: string;
  openingBalance: number;
  isSystemGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}