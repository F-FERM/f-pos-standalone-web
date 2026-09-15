export interface ListUserByIdResponse {
  success: boolean;
  data: Data;
}

interface Data {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  restaurant: Restaurant;
}

interface Restaurant {
}