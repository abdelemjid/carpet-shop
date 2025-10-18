import { Request, Response } from 'express';
import userModel from '../../models/user.model';
import { FetchingUsersConfig } from '../../config/fetching';
import { User, UserAccount, UsersResponse, UserUpdateRequest } from '../../types/user.type';
import { constructUsersFilterQuery, UsersFilterQuery } from '../../filters/admin/users.filter';
import bcrypt from 'bcrypt';

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

export const getUsers = async (req: Request, res: Response) => {
  try {
    const query: UsersFilterQuery = req?.query ? constructUsersFilterQuery(req.query) : {};

    const page = Math.max(parseInt(req.query.page as string) || FetchingUsersConfig.pageNumber, 1);
    const limit = Math.max(FetchingUsersConfig.pageSize, 1);
    const skip = (page - 1) * limit;

    // skip the current admin
    query._id = { $ne: req.userId };

    const [users, total] = await Promise.all([
      await userModel.find(query).select('-password').skip(skip).limit(limit).lean<User[]>(),
      await userModel.countDocuments(query),
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

export const banUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await userModel.findOne({ _id: userId });
    if (!user) return res.status(404).json({ error: 'User not found!' });

    await userModel.findOneAndUpdate(
      { _id: userId },
      { banned: !user?.banned, dateOfBan: new Date() },
    );

    return res
      .status(201)
      .json({ message: `User {${userId}} ${user.banned ? 'permitted' : 'banned'}` });
  } catch (error) {
    console.error('Error occurred during a user ban:', (error as Error).message);
    return res.status(500).json({ error: 'Something went wrong while banning a user!' });
  }
};

// change this function to update the whole user properties
export const updateUser = async (req: Request, res: Response) => {
  try {
    const password = req?.body?.password || null;
    const email = req?.body?.email || null;
    const username = req?.body?.username || null;
    const role = req?.body?.role || null;
    const banned = req?.body?.banned || null;
    const userId = req?.params?.userId;

    const info: UserUpdateRequest = {};

    if (password) info.password = password;
    if (email) info.email = email;
    if (username) info.username = username;
    if (role) info.role = role;
    if (banned) info.banned = banned;

    if (Object(info).length === 0) return res.status(200).json({ message: 'Nothing updated.' });

    const user = await userModel.findOneAndUpdate({ _id: userId }, info);
    if (!user) return res.status(404).json({ error: 'User not found!' });

    return res.status(201).json({ message: `${user.username} information changed successfully.` });
  } catch (error) {
    console.error("Error occurred while changing the user's role", (error as Error).message);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

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
