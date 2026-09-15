export interface ListUserResponse {
  success: boolean;
  data: User[];
  pagination: Pagination;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
}

export interface User {
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