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

/**
 * Constructs a MongoDB filter object for querying users based on join date, banned status, and role.
 *
 * @param searchParams - Object containing optional filter fields:
 *   - joinDateFrom: Start date for user creation
 *   - joinDateTo: End date for user creation
 *   - banned: 'true' or 'false' to filter by banned status
 *   - role: User role to filter by
 *
 * @returns UsersFilterQuery - MongoDB query object ready for use in find()
 *
 * Process:
 * 1. Applies creation date range filters if `joinDateFrom` or `joinDateTo` are provided
 * 2. Converts `banned` string to boolean if provided
 * 3. Filters by user role if provided
 *
 * @example
 * const filter = constructUsersFilterQuery({ joinDateFrom: '2025-01-01', banned: 'false', role: 'user' });
 * User.find(filter);
 */
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
