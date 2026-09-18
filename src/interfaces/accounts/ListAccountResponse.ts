export interface ListAccountResponse {
  success: boolean;
  data: Account[];
  statusCode: number;
}

export interface Account {
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