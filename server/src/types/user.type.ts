import { Types } from 'mongoose';

export interface User {
  _id?: string | Types.ObjectId;
  username: string;
  email: string;
  role: string;
  banned: boolean;
  dateOfBan?: Date;
  createdAt?: Date;
}

export interface UserAccount {
  username: string;
  email: string;
  password: string;
  role: string;
  banned: false;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  banned?: boolean;
}

export interface UsersResponse {
  users?: User[];
  pagination: {
    page?: number;
    pages?: number;
    total?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}
