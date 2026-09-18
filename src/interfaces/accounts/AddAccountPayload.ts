export interface AddAccountPayload {
  accountName: string;
  accountType: string;
  parentAccountId: string;
  showInPos: boolean;
  description: string;
  openingBalance: number;
}
export enum AccountType {
  ASSET = "Asset",
  CURRENT_ASSET = "Current Asset",
  CASH = "Cash",
  BANK = "Bank",
  CARD = "Card",
  DUE = "Due",
  ONLINE = "Online",
  FIXED_ASSET = "Fixed Asset",
  STOCK = "Stock",
  OTHER_CURRENT_LIABILITIES = "Other Current Liabilities",
  CREDIT_CARD = "Credit Card",
  LIABILITIES = "Liabilities",
  EQUITY = "Equity",
  INCOME = "Income",
  OTHER_INCOME = "Other Income",
  PURCHASE = "Purchase",
  EXPENSE = "Expense",
  COST_OF_GOODS_SOLD = "Cost of Goods Sold",
  OTHER_EXPENSES = "Other Expenses",
  CREDIT = "Credit",
}

export const ACCOUNT_TYPE_OPTIONS = Object.values(AccountType).map((value) => ({
  label: value,
  value,
}));