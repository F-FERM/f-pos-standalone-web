export interface ListTableResponseById {
  success: boolean;
  data: Data;
  statusCode: number;
}

interface Data {
  _id: string;
  isDeleted: boolean;
  createdBy: string;
  name: string;
  capacity: number;
  floorId: FloorId;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface FloorId {
  _id: string;
  name: string;
}