import axiosInstance from "@/src/service/axios";

export type PrinterRecord = {
  _id: string;
  printerName: string;
  printerType: string;
  customerTypeId: { _id: string; type: string } | string;
  kitchenId: { _id: string; name: string } | string;
  printerIp: string;
  isDefault: boolean;
  paperWidth: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type PrinterPayload = {
  printerName: string;
  printerType: string;
  customerTypeId: string;
  kitchenId: string;
  printerIp: string;
  isDefault: boolean;
  paperWidth: string;
};

export async function listPrinters() {
  const response = await axiosInstance.get<{ data: PrinterRecord[] }>("/printer");
  return response.data;
}

export async function createPrinter(payload: PrinterPayload) {
  const response = await axiosInstance.post<{ data: PrinterRecord }>("/printer", payload);
  return response.data;
}

export async function updatePrinter(id: string, payload: PrinterPayload) {
  const response = await axiosInstance.patch<{ data: PrinterRecord }>(`/printer/${id}`, payload);
  return response.data;
}

export async function deletePrinter(id: string) {
  const response = await axiosInstance.delete<{ data: { _id: string } }>(`/printer/${id}`);
  return response.data;
}