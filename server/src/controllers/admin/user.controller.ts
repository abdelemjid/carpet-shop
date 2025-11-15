import { Request, Response } from 'express';
import userModel from '../../models/user.model';
import { FetchingUsersConfig } from '../../config/fetching';
import { User, UserAccount, UsersResponse, UserUpdateRequest } from '../../types/user.type';
import { constructUsersFilterQuery, UsersFilterQuery } from '../../filters/admin/users.filter';
import bcrypt from 'bcrypt';

/**
 * Retrieves authenticated user information or another user's data if the requester is an admin.
 *
 * @param req.userId - ID of the authenticated user (extracted from JWT)
 * @param req.params.userId - Optional target user ID (accessible only by admin)
 *
 * @returns 200 - Successfully retrieved user data
 * @returns 400 - Missing or invalid user ID in request
 * @returns 404 - User not found
 * @returns 500 - Server error while fetching user data
 *
 * Process:
 * 1. Validates presence of authenticated userId
 * 2. Fetches user based on userId from token
 * 3. If requester is admin and userId param is provided, fetches target user instead
 * 4. Returns safe user data excluding sensitive fields
 *
 * @example
 * GET /users/me
 * Response: { _id: "64f0a9e3a7b2d4f1c29e...", username: "john_doe", role: "user" }
 *
 * @example
 * GET /users/6741b2f6e29b3a0d12e48b9f (admin only)
 * Response: { _id: "6741b2f6e29b3a0d12e48b9f", username: "alice_admin", role: "user" }
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ error: 'Bad request' });

    const id = req?.params?.userId || null;

    let user = await userModel.findById({ _id: userId });
    if (!user) return res.status(404).json({ error: 'Not found!' });

    if (id && user.role === 'admin') user = await userModel.findOne({ _id: id });

    const userSafe: User = user as User;

    return res.status(200).json(userSafe);
  } catch (error) {
    console.log('Error fetching user:', (error as Error)?.message);
    return res.status(500).json({ error: 'Error getting user!' });
  }
};

/**
 * Retrieves a paginated list of users with optional filtering, excluding the current admin.
 *
 * @param req.query - Optional query parameters for filtering (e.g., username, role)
 * @param req.query.page - Current page number for pagination (optional)
 *
 * @returns 200 - Successfully retrieved users with pagination metadata
 * @returns 500 - Server error while fetching users
 *
 * Process:
 * 1. Constructs MongoDB filter using constructUsersFilterQuery
 * 2. Excludes the currently authenticated admin from results
 * 3. Parses and validates pagination parameters (page, limit)
 * 4. Executes parallel queries for filtered users and total count
 * 5. Returns response with user list (excluding passwords) and pagination info
 *
 * Pagination:
 * - limit: defaults to FetchingUsersConfig.pageSize
 * - page: defaults to FetchingUsersConfig.pageNumber
 * - hasNext: true if more pages exist
 * - hasPrev: true if not on the first page
 *
 * @example
 * GET /users?page=2&role=user
 * Response: {
 *   users: [ { _id: "64f0a9e3a7b2d4f1c29e...", username: "john_doe", role: "user" }, ... ],
 *   pagination: { total: 142, page: 2, pages: 15, hasNext: true, hasPrev: true }
 * }
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const query: UsersFilterQuery = req?.query ? constructUsersFilterQuery(req.query) : {};

    const page = Number(req?.query?.page as string) || FetchingUsersConfig.pageNumber;
    const limit = Math.max(FetchingUsersConfig.pageSize, 1);
    const skip = (page - 1) * limit;

    // skip the current admin
    query._id = { $ne: req.userId };

    const [users, total] = await Promise.all([
      userModel.find(query).select('-password').skip(skip).limit(limit).lean<User[]>(),
      userModel.countDocuments(query),
    ]);

    const response: UsersResponse = {
      users: users,
      pagination: {
        total: total,
        page: page,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching users:', (error as Error).message);
    return res.status(500).json({ error: 'Something went wrong while fetching users!' });
  }
};

/**
 * Toggles the banned status of a user.
 *
 * @param req.params.userId - Unique identifier of the user to ban or unban
 *
 * @returns 201 - User successfully banned or unbanned
 * @returns 404 - User not found
 * @returns 500 - Server error during ban operation
 *
 * Process:
 * 1. Fetches user by userId
 * 2. If user exists, toggles the `banned` flag and updates `dateOfBan` to current time
 * 3. Returns message indicating whether the user was banned or permitted
 *
 * @example
 * PATCH /users/6741b2f6e29b3a0d12e48b9/ban
 * Response: { message: "User {6741b2f6e29b3a0d12e48b9} banned" }
 */
export const banUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await userModel.findOneAndUpdate(
      { _id: userId },
      [
        {
          $set: {
            banned: { $not: '$banned' },
            dateOfBan: { $cond: [{ $eq: ['$banned', false] }, new Date(), '$dateOfBan'] },
          },
        },
      ],
      { new: true },
    );

    if (!user) return res.status(404).json({ error: 'User not found!' });

    return res.status(200).json({
      message: `User ${userId} ${user.banned ? 'banned' : 'permitted'}`,
    });
  } catch (error) {
    console.error('Error occurred during a user ban:', error);
    return res.status(500).json({ error: 'Something went wrong while banning a user!' });
  }
};

/**
 * Updates user information including password, email, username, role, or banned status.
 *
 * @param req.params.userId - Unique identifier of the user to update
 * @param req.body.password - New password (optional)
 * @param req.body.email - New email address (optional)
 * @param req.body.username - New username (optional)
 * @param req.body.role - New role (optional)
 * @param req.body.banned - Updated banned status (optional)
 *
 * @returns 201 - User information successfully updated
 * @returns 200 - No fields provided for update
 * @returns 404 - User not found
 * @returns 500 - Server error during update
 *
 * Process:
 * 1. Extracts userId and potential update fields from request
 * 2. Constructs update object with provided fields
 * 3. Returns early if no fields are provided
 * 4. Updates user in database and returns confirmation message
 *
 * @example
 * PATCH /users/6741b2f6e29b3a0d12e48b9
 * Body: { email: "newemail@example.com", role: "admin" }
 * Response: { message: "john_doe information changed successfully." }
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required.' });

    const { password, email, username, role, banned } = req.body;

    const info: Partial<UserUpdateRequest> = Object.fromEntries(
      Object.entries({ password, email, username, role, banned }).filter(([_, v]) => v != null),
    );

    if (Object.keys(info).length === 0)
      return res.status(200).json({ message: 'Nothing updated.' });

    if (info.password) {
      info.password = await bcrypt.hash(info.password, 10);
    }

    const user = await userModel.findOneAndUpdate({ _id: userId }, info, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ error: 'User not found!' });

    return res.status(200).json({ message: `${user.username} information changed successfully.` });
  } catch (error) {
    console.error('Error occurred while updating user:', error);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

/**
 * Deletes a user by their unique identifier.
 *
 * @param req.params.userId - ID of the user to delete
 *
 * @returns 200 - User deleted successfully
 * @returns 404 - User not found
 * @returns 500 - Server error during deletion
 *
 * Process:
 * 1. Extracts userId from request parameters
 * 2. Attempts to delete the user using findByIdAndDelete
 * 3. Returns confirmation message if deletion succeeds
 * 4. Returns 404 if no matching user exists
 *
 * @example
 * DELETE /users/6741b2f6e29b3a0d12e48b9
 * Response: { message: "User 6741b2f6e29b3a0d12e48b9 is deleted successfully." }
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req?.params?.userId || undefined;

    const user = await userModel.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: 'User not found!' });

    return res.status(200).json({ message: `User ${userId} is deleted successfully.` });
  } catch (error) {
    console.error('Error occurred while deleting a user:', (error as Error).message);
    return res.status(500).json({ error: 'Something went wrong while deleting the user!' });
  }
};

/**
 * Creates a new user account with hashed password.
 *
 * @param req.body.username - Username of the new user
 * @param req.body.email - Email address of the new user
 * @param req.body.password - Plain text password for the new user
 * @param req.body.role - Role of the new user (e.g., "user", "admin")
 *
 * @returns 201 - User created successfully
 * @returns 400 - Email already registered
 * @returns 500 - Server error during user creation
 *
 * Process:
 * 1. Checks if a user with the provided email already exists
 * 2. Hashes the password using bcrypt
 * 3. Constructs new user object with hashed password and default banned status
 * 4. Saves the new user to the database
 * 5. Returns success message
 *
 * @example
 * POST /users
 * Body: { username: "john_doe", email: "john@example.com", password: "SecurePass123!", role: "user" }
 * Response: { message: "User created successfully." }
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req?.body;

    const user = await userModel.findOne({ email });
    if (user) return res.status(400).json({ error: 'Email is registered before!' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData: UserAccount = {
      username: username,
      email: email,
      role: role,
      banned: false,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Error occurred during user creation:', (error as Error).message);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};
