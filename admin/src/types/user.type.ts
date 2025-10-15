export interface User {
  _id?: string;
  username: string;
  email: string;
  banned: boolean;
  dateOfBan?: Date;
  createdAt?: Date;
}

export interface UsersResponse {
  users?: User[];
  pagination?: {
    page?: number;
    pages?: number;
    total?: number;
  };
}
