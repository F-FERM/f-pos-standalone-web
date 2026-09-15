export interface ListPublicUserResponse {
  success: boolean;
  data: UserPublic[];
}

export interface UserPublic {
  userId: string;
  username: string;
}