export interface AddPrinterPayload {
  printerName: string;
  printerType: string;
  customerTypeId: string;
  kitchenId: string;
  printerIp: string;
  isDefault: boolean;
  paperWidth: string;
}