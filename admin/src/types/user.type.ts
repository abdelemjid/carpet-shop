export interface User {
  _id?: string;
  username: string;
  email: string;
  banned: boolean;
  role?: string;
  dateOfBan?: Date;
  createdAt?: Date;
}

export interface UserAccount {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  banned?: string;
}

export interface UsersResponse {
  users?: User[];
  pagination?: {
    page?: number;
    pages?: number;
    total?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export interface UsersFilterSearchQuery {
  joinDateFrom?: string;
  joinDateTo?: string;
  page?: number;
  banned?: boolean;
}
