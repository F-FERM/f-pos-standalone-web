export interface ListUserResponse {
  success: boolean;
  data: Datum[];
  pagination: Pagination;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
}

interface Datum {
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