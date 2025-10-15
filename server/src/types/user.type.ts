import { Types } from 'mongoose';

export interface User {
  _id?: string | Types.ObjectId;
  username: string;
  email: string;
  role: string;
  banned: boolean;
  dateOfBan?: Date;
  createdAt: Date;
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
