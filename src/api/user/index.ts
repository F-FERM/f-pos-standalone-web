import axiosInstance from "@/src/service/axios";

export type UserRecord = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId: string;
  role: string;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserPayload = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId: string;
  password: string;
  role: string;
  isActive: boolean;
};

// Password is required on create but optional on update — most APIs treat
// "leave blank to keep current password" as the edit behavior. Adjust if
// yours requires something different (e.g. a separate reset-password route).
export type UserUpdatePayload = Omit<UserPayload, "password"> & {
  password?: string;
};

export async function listUsers() {
  const response = await axiosInstance.get<{ data: UserRecord[] }>("/user");
  return response.data;
}

export async function createUser(payload: UserPayload) {
  const response = await axiosInstance.post<{ data: UserRecord }>("/user", payload);
  return response.data;
}

export async function updateUser(id: string, payload: UserUpdatePayload) {
  const response = await axiosInstance.patch<{ data: UserRecord }>(`/user/${id}`, payload);
  return response.data;
}

export async function deleteUser(id: string) {
  const response = await axiosInstance.delete<{ data: { _id: string } }>(`/user/${id}`);
  return response.data;
}