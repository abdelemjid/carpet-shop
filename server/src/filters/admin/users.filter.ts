import { Types } from 'mongoose';

export interface UsersFilterQuery {
  _id?: {
    $ne?: Types.ObjectId | string;
  };
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
  banned?: boolean;
  page?: number;
  role?: string;
}

export const constructUsersFilterQuery = (searchParams: any) => {
  const query: UsersFilterQuery = {};

  if (searchParams.joinDateFrom) {
    if (query.createdAt) query.createdAt.$gte = new Date(searchParams.joinDateFrom);
    else query.createdAt = { $gte: new Date(searchParams.joinDateFrom) };
  }
  if (searchParams.joinDateTo) {
    if (query.createdAt) query.createdAt.$lte = new Date(searchParams.joinDateTo);
    else query.createdAt = { $lte: new Date(searchParams.joinDateTo) };
  }
  if (searchParams.banned) query.banned = searchParams.banned === 'true' ? true : false;
  if (searchParams.role) query.role = searchParams.role;

  return query;
};
